import postgres from "postgres";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) throw new Error("DATABASE_URL missing");
const sql = postgres(url, { max: 1, prepare: false, ssl: "require" });

const lessonsTotal = (await sql`select count(*)::int as n from public.lesson_analyses`)[0].n;
const lessonsWithVideo = (
  await sql`select count(*)::int as n from public.lesson_analyses where storage_path is not null and storage_path <> ''`
)[0].n;
const lessonsLive = (
  await sql`select count(*)::int as n from public.lesson_analyses where title ilike 'Live ·%' or source_live_session_id is not null`
)[0].n;
const incidentsTotal = (await sql`select count(*)::int as n from public.incidents`)[0].n;
const incidentsWithVideo = (
  await sql`select count(*)::int as n from public.incidents where storage_path is not null and storage_path <> ''`
)[0].n;
const sessionsTotal = (await sql`select count(*)::int as n from public.live_monitor_sessions`)[0].n;
const sessionsWithRecording = (
  await sql`select count(*)::int as n from public.live_monitor_sessions where recording_storage_path is not null and recording_storage_path <> ''`
)[0].n;

const byStatus = await sql`
  select status, count(*)::int as n
  from public.lesson_analyses
  group by status
  order by n desc
`;

const recentLessons = await sql`
  select id, title, status, storage_path is not null as has_video, created_at
  from public.lesson_analyses
  order by created_at desc
  limit 8
`;

console.log(
  JSON.stringify(
    {
      lessons: { total: lessonsTotal, withVideo: lessonsWithVideo, liveTitled: lessonsLive, byStatus },
      incidents: { total: incidentsTotal, withVideo: incidentsWithVideo },
      liveSessions: { total: sessionsTotal, withRecording: sessionsWithRecording },
      recentLessons,
    },
    null,
    2,
  ),
);
await sql.end();
