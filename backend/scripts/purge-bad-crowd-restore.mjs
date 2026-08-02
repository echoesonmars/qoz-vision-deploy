import postgres from "postgres";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DRY = process.argv.includes("--dry-run");
const APPLY = process.argv.includes("--apply");
if (!DRY && !APPLY) {
  console.error("Pass --dry-run or --apply");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const url = envText.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) throw new Error("DATABASE_URL missing");

const sql = postgres(url, { max: 1, ssl: "require", prepare: false });

const badIncidentFilter = sql`
  incident_type = 'crowd'
  and confidence = 'low'
  and (
    description ilike '%Восстановлено из storage%'
    or description ilike '%ожидает AI-анализ%'
  )
`;

const beforeIncidents = await sql`
  select count(*)::int as n
  from public.live_incident_events
  where ${badIncidentFilter}
`;

const beforeSnapshots = await sql`
  select count(*)::int as n
  from public.live_analysis_snapshots s
  where s.payload->'classroom_visual_behavior'->>'general_focus_description' ilike '%Восстановлено из storage%'
     or (
       s.incident_count > 0
       and not exists (
         select 1
         from public.live_incident_events e
         where e.snapshot_id = s.id
       )
     )
`;

const evidencePathsKept = await sql`
  select count(distinct evidence_storage_path)::int as n
  from public.live_incident_events
  where ${badIncidentFilter}
    and evidence_storage_path is not null
    and evidence_storage_path <> ''
`;

console.log(
  JSON.stringify(
    {
      mode: DRY ? "dry-run" : "apply",
      willDelete: {
        live_incident_events: beforeIncidents[0].n,
        live_analysis_snapshots: beforeSnapshots[0].n,
      },
      storagePhotosUntouched: evidencePathsKept[0].n,
      note: "Storage files (live-evidence/*.jpg) are NOT deleted — only DB metadata.",
    },
    null,
    2,
  ),
);

if (DRY) {
  await sql.end();
  process.exit(0);
}

const deletedIncidents = await sql`
  with deleted as (
    delete from public.live_incident_events
    where ${badIncidentFilter}
    returning id, evidence_storage_path
  )
  select count(*)::int as n from deleted
`;

const deletedSnapshots = await sql`
  with deleted as (
    delete from public.live_analysis_snapshots s
    where s.payload->'classroom_visual_behavior'->>'general_focus_description' ilike '%Восстановлено из storage%'
       or (
         s.incident_count > 0
         and not exists (
           select 1 from public.live_incident_events e where e.snapshot_id = s.id
         )
       )
    returning id
  )
  select count(*)::int as n from deleted
`;

const after = await sql`
  select
    (select count(*)::int from public.live_incident_events where incident_type = 'crowd') as crowd_left,
    (select count(*)::int from public.live_incident_events) as incidents_total,
    (select count(*)::int from public.live_analysis_snapshots) as snapshots_total
`;

await sql.end();

console.log(
  JSON.stringify(
    {
      deleted: {
        live_incident_events: deletedIncidents[0].n,
        live_analysis_snapshots: deletedSnapshots[0].n,
      },
      after,
    },
    null,
    2,
  ),
);
