import postgres from "postgres";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) throw new Error("DATABASE_URL missing");
const sql = postgres(url, { max: 1, prepare: false, ssl: "require" });

const sessions = await sql`
  select id, device_id, status, frame_count, started_at, stopped_at,
         recording_upload_status, recording_storage_path, error_message
  from public.live_monitor_sessions
  order by started_at desc
  limit 20
`;

const lessons = await sql`
  select id, title, source_live_session_id, storage_path, created_at
  from public.lesson_analyses
  where title ilike '%Live%' or source_live_session_id is not null
  order by created_at desc
  limit 15
`;

const counts = {
  sessions: Number((await sql`select count(*)::int as n from public.live_monitor_sessions`)[0].n),
  snapshots: Number((await sql`select count(*)::int as n from public.live_analysis_snapshots`)[0].n),
  incidents: Number((await sql`select count(*)::int as n from public.live_incident_events`)[0].n),
  lessonsWithLiveLink: Number(
    (await sql`select count(*)::int as n from public.lesson_analyses where source_live_session_id is not null`)[0].n,
  ),
};

console.log(JSON.stringify({ counts, sessions, lessons }, null, 2));
await sql.end();
