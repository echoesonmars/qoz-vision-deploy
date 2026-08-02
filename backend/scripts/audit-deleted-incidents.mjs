import postgres from "postgres";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "node:https";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");

function envGet(key) {
  const m = envText.match(new RegExp(`^${key}=(.+)$`, "m"));
  return m?.[1]?.trim();
}

const deletedDbIds = [
  "69b48cc6-1668-42d4-b08f-307a982f8067",
  "6404e19b-a972-434c-97a2-d5462b005cbc",
  "935e1df0-3b3b-4075-967e-f6c4f3a61164",
];

const deletedStorageKeys = [
  "incidents/2ab8558a-b566-4b8e-b8a9-193809ad5eab.mp4",
  "incidents/d6d3a319-552d-4dc9-a4c4-2b2c4518a9b0.mp4",
  "incidents/ae845a14-5bb5-4730-ab68-f9dd960ff263.mp4",
];

const dbUrl = envGet("DATABASE_URL");
if (!dbUrl) throw new Error("DATABASE_URL missing");

const sql = postgres(dbUrl, { max: 1, ssl: "require", prepare: false });

const byId = await sql`
  select id, storage_path, category, created_at
  from public.incidents
  where id = any(${deletedDbIds}::uuid[])
`;

const byPath = await sql`
  select id, storage_path, category, created_at
  from public.incidents
  where storage_path like any(${deletedStorageKeys.map((key) => `%${key.split("/").pop()?.replace(".mp4", "")}%`)}::text[])
`;

const total = await sql`select count(*)::int as n from public.incidents`;

const recycleTables = await sql`
  select table_schema, table_name
  from information_schema.tables
  where table_schema in ('public', 'storage')
    and (
      table_name ilike '%trash%'
      or table_name ilike '%deleted%'
      or table_name ilike '%archive%'
    )
  order by 1, 2
`;

const storageObjects = await sql`
  select id, name, bucket_id, created_at, updated_at
  from storage.objects
  where bucket_id = 'records'
    and (
      name = any(${deletedStorageKeys}::text[])
      or name ilike any(${deletedStorageKeys.map((key) => `%${key.split("/").pop()?.replace(".mp4", "")}%`)}::text[])
    )
`;

const endpoint = envGet("SUPABASE_S3_ENDPOINT");
const accessKeyId = envGet("SUPABASE_S3_ACCESS_KEY_ID");
const secretAccessKey = envGet("SUPABASE_S3_SECRET_ACCESS_KEY");
const region = envGet("SUPABASE_S3_REGION") ?? "ap-south-1";

const s3Results = [];
if (endpoint && accessKeyId && secretAccessKey) {
  const s3 = new S3Client({
    forcePathStyle: true,
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    requestHandler: new NodeHttpHandler({
      httpsAgent: new https.Agent({ keepAlive: false, maxSockets: 1 }),
      connectionTimeout: 30_000,
      requestTimeout: 120_000,
    }),
  });

  for (const key of deletedStorageKeys) {
    try {
      const out = await s3.send(new HeadObjectCommand({ Bucket: "records", Key: key }));
      s3Results.push({
        key,
        exists: true,
        size: out.ContentLength ?? null,
        lastModified: out.LastModified ?? null,
      });
    } catch (err) {
      s3Results.push({
        key,
        exists: false,
        error: err instanceof Error ? err.name : String(err),
        status: err?.$metadata?.httpStatusCode ?? null,
      });
    }
  }
}

const supabaseUrl = envGet("NEXT_PUBLIC_SUPABASE_URL");
const serviceRole = envGet("SUPABASE_SERVICE_ROLE_KEY");
let projectApi = null;
if (supabaseUrl && serviceRole) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: serviceRole,
        Authorization: `Bearer ${serviceRole}`,
      },
    });
    projectApi = { status: res.status, server: res.headers.get("server") };
  } catch (err) {
    projectApi = { error: err instanceof Error ? err.message : String(err) };
  }
}

await sql.end();

console.log(
  JSON.stringify(
    {
      database: {
        totalIncidents: total[0].n,
        deletedRowsById: byId,
        deletedRowsByStoragePath: byPath,
        recycleTables,
      },
      storageMetadata: storageObjects,
      s3HeadChecks: s3Results,
      supabaseRestProbe: projectApi,
      note: "No Supabase trash bin exists; deleted rows/files are gone unless restored from backup/PITR.",
    },
    null,
    2,
  ),
);
