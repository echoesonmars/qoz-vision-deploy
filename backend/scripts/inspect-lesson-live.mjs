import postgres from "postgres";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const lessonId = process.argv[2];
if (!lessonId) {
  console.error("Usage: node inspect-lesson-live.mjs <lesson-uuid>");
  process.exit(1);
}

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

const [lesson] = await sql`
  select
    id,
    title,
    status,
    storage_path,
    source_live_session_id,
    created_at,
    (analysis is not null) as has_analysis
  from public.lesson_analyses
  where id = ${lessonId}
`;

if (!lesson) {
  console.log(JSON.stringify({ error: "lesson not found", lessonId }, null, 2));
  await sql.end();
  process.exit(0);
}

const sessionId = lesson.source_live_session_id;
let session = null;
let snapCount = 0;
let incCount = 0;
let sampleSnaps = [];
let totalSnapsInDb = 0;

if (sessionId) {
  [session] = await sql`
    select
      id,
      device_id,
      status,
      frame_count,
      error_message,
      started_at,
      stopped_at,
      recording_upload_status,
      recording_storage_path,
      recording_duration_sec
    from public.live_monitor_sessions
    where id = ${sessionId}
  `;
  snapCount =
    (
      await sql`
        select count(*)::int as n
        from public.live_analysis_snapshots
        where session_id = ${sessionId}
      `
    )[0]?.n ?? 0;
  incCount =
    (
      await sql`
        select count(*)::int as n
        from public.live_incident_events
        where session_id = ${sessionId}
      `
    )[0]?.n ?? 0;
  sampleSnaps = await sql`
    select id, captured_at, engagement_score, incident_count, session_offset_sec
    from public.live_analysis_snapshots
    where session_id = ${sessionId}
    order by captured_at desc
    limit 5
  `;
}

totalSnapsInDb =
  (
    await sql`
      select count(*)::int as n from public.live_analysis_snapshots
    `
  )[0]?.n ?? 0;

const oldestSnap = await sql`
  select min(captured_at) as oldest, max(captured_at) as newest
  from public.live_analysis_snapshots
`;

console.log(
  JSON.stringify(
    {
      lesson,
      session,
      snapCountForSession: snapCount,
      incidentCountForSession: incCount,
      sampleSnaps,
      totalSnapsInDb,
      globalSnapRange: oldestSnap[0] ?? null,
      diagnosis:
        snapCount === 0 && session?.frame_count > 0
          ? "snapshots_missing_but_frame_count_positive"
          : snapCount === 0
            ? "no_snapshots_for_session"
            : "snapshots_present",
    },
    null,
    2,
  ),
);

await sql.end();
