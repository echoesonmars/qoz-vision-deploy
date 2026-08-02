import postgres from "postgres";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "node:https";

const ids = process.argv.slice(2);
if (ids.length === 0) {
  console.error("Usage: node delete-incidents-by-id.mjs <incident-uuid> ...");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");

function envGet(key) {
  const m = envText.match(new RegExp(`^${key}=(.+)$`, "m"));
  return m?.[1]?.trim();
}

const dbUrl = envGet("DATABASE_URL");
if (!dbUrl) throw new Error("DATABASE_URL missing");

const endpoint = envGet("SUPABASE_S3_ENDPOINT");
const accessKeyId = envGet("SUPABASE_S3_ACCESS_KEY_ID");
const secretAccessKey = envGet("SUPABASE_S3_SECRET_ACCESS_KEY");
const region = envGet("SUPABASE_S3_REGION") ?? "ap-south-1";
if (!endpoint || !accessKeyId || !secretAccessKey) {
  throw new Error("S3 env missing");
}

const sql = postgres(dbUrl, { max: 1, prepare: false, ssl: "require" });
const s3 = new S3Client({
  forcePathStyle: true,
  region,
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
  requestHandler: new NodeHttpHandler({
    httpsAgent: new https.Agent({ keepAlive: false, maxSockets: 1 }),
    connectionTimeout: 30_000,
    requestTimeout: 600_000,
  }),
});

const results = [];

for (const id of ids) {
  const [row] = await sql`
    select id, storage_path
    from public.incidents
    where id = ${id}
    limit 1
  `;
  if (!row) {
    results.push({ id, db: "not_found" });
    continue;
  }

  const key = row.storage_path;
  let s3Status = "deleted";
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: "records", Key: key }));
  } catch (err) {
    s3Status = err instanceof Error ? err.message : String(err);
  }

  const deleted = await sql`
    delete from public.incidents
    where id = ${id}
    returning id
  `;

  results.push({
    id,
    storage_path: key,
    s3: s3Status,
    db: deleted.length > 0 ? "deleted" : "delete_failed",
  });
}

await sql.end();
console.log(JSON.stringify(results, null, 2));
