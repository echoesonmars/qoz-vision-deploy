import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const url = envText.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) throw new Error("DATABASE_URL missing");
const sql = postgres(url, { max: 1, prepare: false, ssl: "require" });

const totals = {
  sessions: Number((await sql`select count(*)::int as n from public.live_monitor_sessions`)[0].n),
  snapshots: Number((await sql`select count(*)::int as n from public.live_analysis_snapshots`)[0].n),
  incidents: Number((await sql`select count(*)::int as n from public.live_incident_events`)[0].n),
  incidentsWithEvidence: Number(
    (await sql`
      select count(*)::int as n from public.live_incident_events
      where evidence_storage_path is not null and evidence_storage_path <> ''
    `)[0].n,
  ),
};

const lessons = await sql`
  select
    l.id,
    l.title,
    l.source_live_session_id,
    s.device_id,
    coalesce(snap.cnt, 0)::int as snapshots,
    coalesce(inc.cnt, 0)::int as incidents,
    coalesce(ev.cnt, 0)::int as evidence
  from public.lesson_analyses l
  left join public.live_monitor_sessions s on s.id = l.source_live_session_id
  left join lateral (
    select count(*)::int as cnt from public.live_analysis_snapshots las where las.session_id = s.id
  ) snap on true
  left join lateral (
    select count(*)::int as cnt from public.live_incident_events lie where lie.session_id = s.id
  ) inc on true
  left join lateral (
    select count(*)::int as cnt from public.live_incident_events lie
    where lie.session_id = s.id and lie.evidence_storage_path is not null
  ) ev on true
  order by l.created_at desc
`;

console.log(JSON.stringify({ totals, lessons }, null, 2));
await sql.end();
