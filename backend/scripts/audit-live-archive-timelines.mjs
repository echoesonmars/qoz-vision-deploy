import postgres from "postgres";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CAPTURE_INTERVAL_SEC = Math.max(
  10,
  Number(process.env.LIVE_CAPTURE_INTERVAL_MS ?? 10_000) / 1000,
);
const GEMINI_MAX_CONCURRENT = Math.max(
  1,
  Number(process.env.GEMINI_LIVE_MAX_CONCURRENT ?? 2),
);
const AVG_GEMINI_SEC_PER_FRAME = Number(process.env.AVG_GEMINI_SEC_PER_FRAME ?? 4);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let url = process.env.DATABASE_URL;
if (!url) {
  const env = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
  const m = env.match(/^DATABASE_URL=(.+)$/m);
  if (m) url = m[1].trim();
}
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const sql = postgres(url, { max: 1, prepare: false, ssl: "require" });

const liveLessons = await sql`
  select
    l.id,
    l.title,
    l.status,
    l.storage_path,
    l.source_live_session_id,
    l.created_at,
    (l.analysis is not null) as has_lesson_analysis,
    s.id as session_id,
    s.device_id,
    s.frame_count,
    s.recording_duration_sec,
    s.recording_upload_status,
    s.started_at as session_started_at,
    s.stopped_at as session_stopped_at,
    coalesce(snap.cnt, 0)::int as snapshot_count,
    coalesce(inc.cnt, 0)::int as incident_count
  from public.lesson_analyses l
  left join public.live_monitor_sessions s on s.id = l.source_live_session_id
  left join lateral (
    select count(*)::int as cnt
    from public.live_analysis_snapshots las
    where las.session_id = s.id
  ) snap on true
  left join lateral (
    select count(*)::int as cnt
    from public.live_incident_events lie
    where lie.session_id = s.id
  ) inc on true
  where l.title ilike 'Live ·%'
     or l.source_live_session_id is not null
  order by l.created_at desc
`;

const orphanSessions = await sql`
  select
    s.id,
    s.device_id,
    s.status,
    s.frame_count,
    s.recording_duration_sec,
    s.recording_upload_status,
    s.recording_storage_path,
    s.started_at,
    s.stopped_at,
    coalesce(snap.cnt, 0)::int as snapshot_count,
    coalesce(inc.cnt, 0)::int as incident_count
  from public.live_monitor_sessions s
  left join lateral (
    select count(*)::int as cnt from public.live_analysis_snapshots las where las.session_id = s.id
  ) snap on true
  left join lateral (
    select count(*)::int as cnt from public.live_incident_events lie where lie.session_id = s.id
  ) inc on true
  where s.recording_upload_status = 'ready'
    and not exists (
      select 1 from public.lesson_analyses l where l.source_live_session_id = s.id
    )
  order by s.started_at desc
`;

function durationSec(row) {
  if (row.recording_duration_sec && row.recording_duration_sec > 0) {
    return row.recording_duration_sec;
  }
  if (row.session_started_at && row.session_stopped_at) {
    return Math.max(
      0,
      Math.floor(
        (new Date(row.session_stopped_at).getTime() -
          new Date(row.session_started_at).getTime()) /
          1000,
      ),
    );
  }
  if (row.started_at && row.stopped_at) {
    return Math.max(
      0,
      Math.floor(
        (new Date(row.stopped_at).getTime() - new Date(row.started_at).getTime()) / 1000,
      ),
    );
  }
  return 600;
}

function estimateFrames(durationSeconds) {
  return Math.max(1, Math.ceil(durationSeconds / CAPTURE_INTERVAL_SEC));
}

function formatDuration(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}ч ${m}м`;
  if (m > 0) return `${m}м ${s}с`;
  return `${s}с`;
}

function classifyLesson(row) {
  const hasTimeline = row.snapshot_count > 0;
  const hasRecording = Boolean(row.storage_path);
  const hasSessionLink = Boolean(row.source_live_session_id && row.session_id);
  return { hasTimeline, hasRecording, hasSessionLink };
}

const lessonRows = liveLessons.map((row) => {
  const { hasTimeline, hasRecording, hasSessionLink } = classifyLesson(row);
  const dur = durationSec(row);
  const framesNeeded = hasTimeline ? 0 : estimateFrames(dur);
  return {
    kind: "lesson",
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    storagePath: row.storage_path,
    sourceLiveSessionId: row.source_live_session_id,
    sessionId: row.session_id,
    deviceId: row.device_id,
    snapshotCount: row.snapshot_count,
    incidentCount: row.incident_count,
    frameCount: row.frame_count,
    recordingDurationSec: dur,
    hasTimeline,
    hasRecording,
    hasSessionLink,
    hasLessonAnalysis: row.has_lesson_analysis,
    framesToAnalyze: framesNeeded,
  };
});

const sessionRows = orphanSessions.map((row) => {
  const hasTimeline = row.snapshot_count > 0;
  const dur = durationSec(row);
  return {
    kind: "session_only",
    id: row.id,
    title: `Session ${row.device_id} · ${new Date(row.started_at).toISOString().slice(0, 16)}`,
    createdAt: row.started_at,
    storagePath: row.recording_storage_path,
    sourceLiveSessionId: row.id,
    sessionId: row.id,
    deviceId: row.device_id,
    snapshotCount: row.snapshot_count,
    incidentCount: row.incident_count,
    frameCount: row.frame_count,
    recordingDurationSec: dur,
    hasTimeline,
    hasRecording: true,
    hasSessionLink: true,
    hasLessonAnalysis: false,
    framesToAnalyze: hasTimeline ? 0 : estimateFrames(dur),
  };
});

const all = [...lessonRows, ...sessionRows];
const withTimeline = all.filter((r) => r.hasTimeline);
const withoutTimeline = all.filter((r) => !r.hasTimeline && r.hasRecording);
const withoutTimelineList = withoutTimeline.map((r) => ({
  id: r.id,
  kind: r.kind,
  title: r.title,
  createdAt: r.createdAt,
  durationSec: r.recordingDurationSec,
  durationLabel: formatDuration(r.recordingDurationSec),
  snapshots: r.snapshotCount,
  sessionLink: r.hasSessionLink,
  storagePath: r.storagePath,
  framesToAnalyze: r.framesToAnalyze,
}));

const totalFrames = withoutTimeline.reduce((s, r) => s + r.framesToAnalyze, 0);
const totalVideoSec = withoutTimeline.reduce((s, r) => s + r.recordingDurationSec, 0);
const serialGeminiSec = totalFrames * AVG_GEMINI_SEC_PER_FRAME;
const parallelGeminiSec = Math.ceil(serialGeminiSec / GEMINI_MAX_CONCURRENT);
const wallClockWithOverhead = Math.ceil(parallelGeminiSec * 1.15);

console.log(
  JSON.stringify(
    {
      assumptions: {
        model: "gemini-3.1-flash-lite",
        captureIntervalSec: CAPTURE_INTERVAL_SEC,
        geminiMaxConcurrent: GEMINI_MAX_CONCURRENT,
        avgGeminiSecPerFrame: AVG_GEMINI_SEC_PER_FRAME,
        note: "Оценка для повторного разбора mp4 по кадру каждые N сек (как live ingest). Без учёта 429/free tier.",
      },
      totals: {
        liveArchiveLessons: lessonRows.length,
        orphanRecordedSessions: sessionRows.length,
        allRecordings: all.filter((r) => r.hasRecording).length,
        withTimeline: withTimeline.length,
        withoutTimeline: withoutTimeline.length,
        totalSnapshotsInDb: (
          await sql`select count(*)::int as n from public.live_analysis_snapshots`
        )[0].n,
        totalSessionsInDb: (
          await sql`select count(*)::int as n from public.live_monitor_sessions`
        )[0].n,
      },
      geminiBackfillEstimate: {
        videosToAnalyze: withoutTimeline.length,
        totalVideoDurationSec: totalVideoSec,
        totalVideoDurationLabel: formatDuration(totalVideoSec),
        totalGeminiFrames: totalFrames,
        serialTimeLabel: formatDuration(serialGeminiSec),
        parallelTimeLabel: formatDuration(parallelGeminiSec),
        realisticWallClockLabel: formatDuration(wallClockWithOverhead),
        requestsPerDayFreeTierLimit: 500,
        wouldExceedFreeTierInOneDay: totalFrames > 500,
        daysOnFreeTierAt500PerDay: Math.ceil(totalFrames / 500),
      },
      withTimelineList: withTimeline.map((r) => ({
        id: r.id,
        title: r.title,
        snapshots: r.snapshotCount,
        incidents: r.incidentCount,
      })),
      withoutTimelineList,
    },
    null,
    2,
  ),
);

await sql.end();
