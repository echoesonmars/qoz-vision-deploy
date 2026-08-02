import postgres from "postgres";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const url = envText.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
const sql = postgres(url, { max: 1, ssl: "require", prepare: false });

const crowd = await sql`select count(*)::int as n from public.live_incident_events where incident_type = 'crowd'`;
const total = await sql`select count(*)::int as n from public.live_incident_events`;
const byType = await sql`
  select incident_type, count(*)::int as n
  from public.live_incident_events
  group by 1
  order by n desc
`;
const badRestore = await sql`
  select count(*)::int as n
  from public.live_incident_events
  where description ilike '%Восстановлено из storage%'
     or description ilike '%ожидает AI%'
`;
const sampleCrowd = await sql`
  select id, incident_type, confidence, left(description, 80) as description, captured_at
  from public.live_incident_events
  where incident_type = 'crowd'
  order by captured_at desc
  limit 5
`;

console.log(
  JSON.stringify(
    { crowd: crowd[0].n, total: total[0].n, byType, badRestore: badRestore[0].n, sampleCrowd },
    null,
    2,
  ),
);
await sql.end();
