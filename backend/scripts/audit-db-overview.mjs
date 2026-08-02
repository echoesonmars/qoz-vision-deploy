import postgres from "postgres";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const dbUrl = envText.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!dbUrl) throw new Error("DATABASE_URL missing");

const sql = postgres(dbUrl, { max: 1, ssl: "require", prepare: false });

const tables = await sql`
  select table_name
  from information_schema.tables
  where table_schema = 'public'
    and table_type = 'BASE TABLE'
  order by table_name
`;

async function tableStats(tableName) {
  const countRows = await sql.unsafe(`select count(*)::int as n from public.${tableName}`);
  const n = countRows[0]?.n ?? 0;
  if (n === 0) {
    return { table: tableName, count: 0 };
  }

  const dateCols = await sql`
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = ${tableName}
      and data_type in ('timestamp with time zone', 'timestamp without time zone')
    order by ordinal_position
  `;

  const primaryDate =
    dateCols.find((c) => c.column_name === "created_at")?.column_name ??
    dateCols.find((c) => c.column_name === "captured_at")?.column_name ??
    dateCols.find((c) => c.column_name === "started_at")?.column_name ??
    dateCols[0]?.column_name ??
    null;

  if (!primaryDate) {
    return { table: tableName, count: n };
  }

  const range = await sql.unsafe(`
    select
      min(${primaryDate}) as oldest,
      max(${primaryDate}) as newest
    from public.${tableName}
  `);

  return {
    table: tableName,
    count: n,
    dateColumn: primaryDate,
    oldest: range[0]?.oldest ?? null,
    newest: range[0]?.newest ?? null,
  };
}

const publicStats = [];
for (const row of tables) {
  publicStats.push(await tableStats(row.table_name));
}

const incidentsByMonth = await sql`
  select
    to_char(date_trunc('month', created_at), 'YYYY-MM') as month,
    count(*)::int as n
  from public.incidents
  group by 1
  order by 1
`;

const lessonsByMonth = await sql`
  select
    to_char(date_trunc('month', created_at), 'YYYY-MM') as month,
    count(*)::int as n
  from public.lesson_analyses
  group by 1
  order by 1
`;

const liveSessionsByMonth = await sql`
  select
    to_char(date_trunc('month', started_at), 'YYYY-MM') as month,
    count(*)::int as n
  from public.live_monitor_sessions
  group by 1
  order by 1
`;

const liveSnapshotsByMonth = await sql`
  select
    to_char(date_trunc('month', captured_at), 'YYYY-MM') as month,
    count(*)::int as n
  from public.live_analysis_snapshots
  group by 1
  order by 1
`;

const liveIncidentsByMonth = await sql`
  select
    to_char(date_trunc('month', captured_at), 'YYYY-MM') as month,
    count(*)::int as n
  from public.live_incident_events
  group by 1
  order by 1
`;

const liveEvidence = await sql`
  select
    count(*)::int as total,
    count(*) filter (where evidence_storage_path is not null and evidence_storage_path <> '')::int as with_evidence_path,
    count(*) filter (where evidence_storage_path is null or evidence_storage_path = '')::int as without_evidence_path
  from public.live_incident_events
`;

const sessionRecordings = await sql`
  select
    count(*)::int as total_sessions,
    count(*) filter (where recording_storage_path is not null and recording_storage_path <> '')::int as with_recording_path,
    count(*) filter (where recording_upload_status = 'ready')::int as recording_ready
  from public.live_monitor_sessions
`;

const storageByPrefix = await sql`
  select
    split_part(name, '/', 1) as prefix,
    count(*)::int as objects,
    coalesce(sum((metadata->>'size')::bigint), 0)::bigint as bytes
  from storage.objects
  where bucket_id = 'records'
  group by 1
  order by objects desc
`;

const incidentPaths = await sql`select storage_path from public.incidents`;
const lessonPaths = await sql`select storage_path from public.lesson_analyses`;
const evidencePaths = await sql`
  select evidence_storage_path as path
  from public.live_incident_events
  where evidence_storage_path is not null and evidence_storage_path <> ''
`;
const recordingPaths = await sql`
  select recording_storage_path as path
  from public.live_monitor_sessions
  where recording_storage_path is not null and recording_storage_path <> ''
`;

const dbPaths = new Set(
  [
    ...incidentPaths.map((r) => r.storage_path),
    ...lessonPaths.map((r) => r.storage_path),
    ...evidencePaths.map((r) => r.path),
    ...recordingPaths.map((r) => r.path),
  ].filter(Boolean),
);

const storageObjects = await sql`
  select name, (metadata->>'size')::bigint as bytes
  from storage.objects
  where bucket_id = 'records'
`;

const orphanStorage = storageObjects.filter((o) => !dbPaths.has(o.name));
const missingStorage = [...dbPaths].filter(
  (path) => !storageObjects.some((o) => o.name === path),
);

const retentionNote = {
  script: "live-retention.ts (LIVE_RETENTION_DAYS=30)",
  currentSourceState: "disabled in src (LIVE_RETENTION_DAYS=0, prune is no-op)",
  deletedTables: [
    "live_incident_events",
    "live_analysis_snapshots",
    "live_monitor_sessions (stopped/error)",
  ],
  didNotDelete: ["public.incidents", "public.lesson_analyses", "storage.objects directly"],
};

await sql.end();

console.log(
  JSON.stringify(
    {
      retentionNote,
      publicTables: publicStats,
      breakdownByMonth: {
        incidents: incidentsByMonth,
        lesson_analyses: lessonsByMonth,
        live_monitor_sessions: liveSessionsByMonth,
        live_analysis_snapshots: liveSnapshotsByMonth,
        live_incident_events: liveIncidentsByMonth,
      },
      liveEvidence,
      sessionRecordings,
      storageByPrefix: storageByPrefix.map((row) => ({
        ...row,
        mb: Number((Number(row.bytes) / (1024 * 1024)).toFixed(1)),
      })),
      integrity: {
        dbPathsReferenced: dbPaths.size,
        storageObjects: storageObjects.length,
        orphanStorageFiles: {
          count: orphanStorage.length,
          sample: orphanStorage.slice(0, 15).map((o) => ({
            name: o.name,
            mb: Number((Number(o.bytes ?? 0) / (1024 * 1024)).toFixed(2)),
          })),
        },
        dbRowsMissingStorageFile: {
          count: missingStorage.length,
          sample: missingStorage.slice(0, 15),
        },
      },
    },
    null,
    2,
  ),
);
