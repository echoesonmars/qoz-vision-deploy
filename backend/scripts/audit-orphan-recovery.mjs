import postgres from "postgres";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const dbUrl = envText.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!dbUrl) throw new Error("DATABASE_URL missing");

const sql = postgres(dbUrl, { max: 1, ssl: "require", prepare: false });

const storageObjects = await sql`
  select name, created_at, updated_at, (metadata->>'size')::bigint as bytes
  from storage.objects
  where bucket_id = 'records'
`;

const incidentPaths = new Set(
  (await sql`select storage_path from public.incidents`).map((r) => r.storage_path),
);
const lessonPaths = new Set(
  (await sql`select storage_path from public.lesson_analyses`).map((r) => r.storage_path),
);
const evidencePaths = new Set(
  (
    await sql`
      select evidence_storage_path as path
      from public.live_incident_events
      where evidence_storage_path is not null and evidence_storage_path <> ''
    `
  ).map((r) => r.path),
);
const recordingPaths = new Set(
  (
    await sql`
      select recording_storage_path as path
      from public.live_monitor_sessions
      where recording_storage_path is not null and recording_storage_path <> ''
    `
  ).map((r) => r.path),
);

const dbPaths = new Set([
  ...incidentPaths,
  ...lessonPaths,
  ...evidencePaths,
  ...recordingPaths,
]);

const orphans = storageObjects.filter((o) => !dbPaths.has(o.name));

const evidenceRe = /^live-evidence\/([0-9a-f-]{36})\/([0-9a-f-]{36})\.jpg$/i;
const recordingRe = /^live-recordings\/([0-9a-f-]{36})\.mp4$/i;

const orphanEvidence = [];
const orphanRecordings = [];
const orphanOther = [];

for (const o of orphans) {
  const ev = o.name.match(evidenceRe);
  if (ev) {
    orphanEvidence.push({
      path: o.name,
      sessionId: ev[1],
      incidentEventId: ev[2],
      created_at: o.created_at,
      updated_at: o.updated_at,
      bytes: Number(o.bytes ?? 0),
    });
    continue;
  }
  const rec = o.name.match(recordingRe);
  if (rec) {
    orphanRecordings.push({
      path: o.name,
      sessionId: rec[1],
      created_at: o.created_at,
      updated_at: o.updated_at,
      bytes: Number(o.bytes ?? 0),
    });
    continue;
  }
  orphanOther.push(o.name);
}

const existingSessions = new Set(
  (await sql`select id::text as id from public.live_monitor_sessions`).map((r) => r.id),
);

const lessonsBySession = await sql`
  select id::text as lesson_id, source_live_session_id::text as session_id, title, created_at
  from public.lesson_analyses
  where source_live_session_id is not null
`;

const lessonSessionMap = new Map(
  lessonsBySession.map((r) => [r.session_id, r]),
);

const evidenceSessionIds = [...new Set(orphanEvidence.map((e) => e.sessionId))];
const recordingSessionIds = [...new Set(orphanRecordings.map((r) => r.sessionId))];
const allOrphanSessionIds = [...new Set([...evidenceSessionIds, ...recordingSessionIds])];

const sessionsWithDbRow = allOrphanSessionIds.filter((id) => existingSessions.has(id));
const sessionsWithoutDbRow = allOrphanSessionIds.filter((id) => !existingSessions.has(id));
const sessionsWithLessonLink = allOrphanSessionIds.filter((id) => lessonSessionMap.has(id));

function groupBySession(items) {
  const map = new Map();
  for (const item of items) {
    const sid = item.sessionId;
    const bucket = map.get(sid) ?? { sessionId: sid, files: 0, bytes: 0, oldest: null, newest: null };
    bucket.files += 1;
    bucket.bytes += item.bytes;
    const ts = item.created_at ? new Date(item.created_at).getTime() : null;
    if (ts) {
      if (!bucket.oldest || ts < bucket.oldest) bucket.oldest = ts;
      if (!bucket.newest || ts > bucket.newest) bucket.newest = ts;
    }
    map.set(sid, bucket);
  }
  return [...map.values()].map((v) => ({
    ...v,
    oldest: v.oldest ? new Date(v.oldest).toISOString() : null,
    newest: v.newest ? new Date(v.newest).toISOString() : null,
    mb: Number((v.bytes / (1024 * 1024)).toFixed(2)),
    hasDbSession: existingSessions.has(v.sessionId),
    hasLessonLink: lessonSessionMap.has(v.sessionId),
    lesson: lessonSessionMap.get(v.sessionId) ?? null,
  }));
}

const evidenceBySession = groupBySession(orphanEvidence);
const recordingsBySession = groupBySession(orphanRecordings);

await sql.end();

console.log(
  JSON.stringify(
    {
      summary: {
        orphanFilesTotal: orphans.length,
        orphanEvidencePhotos: orphanEvidence.length,
        orphanRecordings: orphanRecordings.length,
        orphanOther: orphanOther.length,
        uniqueOrphanSessions: allOrphanSessionIds.length,
        orphanSessionsWithDbRow: sessionsWithDbRow.length,
        orphanSessionsMissingDbRow: sessionsWithoutDbRow.length,
        orphanSessionsWithLessonLink: sessionsWithLessonLink.length,
      },
      recoverability: {
        fromPathOnly: [
          "session_id (uuid in path)",
          "incident_event id (uuid in jpg filename)",
          "storage created_at / updated_at as approximate captured_at",
          "file size for recordings",
        ],
        lostUnlessBackupOrReanalysis: [
          "incident_type, confidence, description, location_context",
          "snapshot payload (engagement, behavior json)",
          "device_id, camera_id, hls_url for deleted sessions",
          "exact captured_at (only approximate from storage timestamps)",
          "snapshot_id linkage",
        ],
        recommendedOrder: [
          "1) Inventory orphans (this report) — do NOT delete storage",
          "2) Rebuild live_monitor_sessions stubs for orphan session_ids",
          "3) Insert minimal live_incident_events rows from jpg paths",
          "4) Optionally re-run Gemini on jpg/mp4 to refill AI metadata",
          "5) Link lessons via source_live_session_id where available",
        ],
      },
      evidenceBySession: evidenceBySession.sort((a, b) => b.files - a.files).slice(0, 20),
      recordingsBySession: recordingsBySession.sort((a, b) => b.bytes - a.bytes).slice(0, 20),
      sampleMissingSessionIds: sessionsWithoutDbRow.slice(0, 10),
      lessonsLinkedToOrphanSessions: lessonsBySession.filter((l) =>
        allOrphanSessionIds.includes(l.session_id),
      ),
    },
    null,
    2,
  ),
);
