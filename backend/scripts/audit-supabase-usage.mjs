import postgres from "postgres";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");

function envGet(key) {
  const m = envText.match(new RegExp(`^${key}=(.+)$`, "m"));
  return m?.[1]?.trim();
}

const dbUrl = envGet("DATABASE_URL");
if (!dbUrl) throw new Error("DATABASE_URL missing");

const projectRef = dbUrl.match(/postgres\.([a-z0-9]+):/i)?.[1] ?? null;
const sql = postgres(dbUrl, { max: 1, ssl: "require", prepare: false });

const dbSize = await sql`
  select
    pg_size_pretty(pg_database_size(current_database())) as pretty,
    pg_database_size(current_database())::bigint as bytes
`;

const storage = await sql`
  select
    count(*)::int as objects,
    coalesce(sum((metadata->>'size')::bigint), 0)::bigint as bytes
  from storage.objects
  where bucket_id = 'records'
`;

const incidentObjects = await sql`
  select count(*)::int as objects
  from storage.objects
  where bucket_id = 'records' and name like 'incidents/%'
`;

const incidentRows = await sql`select count(*)::int as n from public.incidents`;

const buckets = await sql`
  select id, name, public, file_size_limit, allowed_mime_types
  from storage.buckets
  order by name
`;

const wal = await sql`
  select name, setting
  from pg_settings
  where name in ('wal_level', 'archive_mode', 'max_wal_senders')
  order by name
`;

await sql.end();

const dbBytes = Number(dbSize[0].bytes);
const storageBytes = Number(storage[0].bytes);

function guessPlan() {
  if (dbBytes > 500 * 1024 * 1024 || storageBytes > 1024 * 1024 * 1024) {
    return "likely_paid_not_free_limits";
  }
  return "within_free_tier_limits_or_unknown";
}

console.log(
  JSON.stringify(
    {
      projectRef,
      usage: {
        database: dbSize[0],
        storageRecordsBucket: {
          ...storage[0],
          pretty: `${(storageBytes / (1024 * 1024)).toFixed(1)} MB`,
        },
        incidentRows: incidentRows[0].n,
        incidentStorageObjects: incidentObjects[0].objects,
      },
      buckets,
      wal,
      planGuess: guessPlan(),
      planNote:
        "Exact plan (Free/Pro) is only visible in Supabase Dashboard → Project Settings → Billing. PITR is Pro+ add-on.",
    },
    null,
    2,
  ),
);
