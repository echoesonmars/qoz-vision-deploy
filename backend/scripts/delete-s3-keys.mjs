import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DeleteObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "node:https";

const keys = process.argv.slice(2);
if (keys.length === 0) {
  console.error("Usage: node delete-s3-keys.mjs <s3-key> ...");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");

function envGet(key) {
  const m = envText.match(new RegExp(`^${key}=(.+)$`, "m"));
  return m?.[1]?.trim();
}

const endpoint = envGet("SUPABASE_S3_ENDPOINT");
const accessKeyId = envGet("SUPABASE_S3_ACCESS_KEY_ID");
const secretAccessKey = envGet("SUPABASE_S3_SECRET_ACCESS_KEY");
const region = envGet("SUPABASE_S3_REGION") ?? "ap-south-1";

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
for (const key of keys) {
  let exists = false;
  try {
    await s3.send(new HeadObjectCommand({ Bucket: "records", Key: key }));
    exists = true;
  } catch {
    exists = false;
  }

  if (!exists) {
    results.push({ key, status: "not_found" });
    continue;
  }

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: "records", Key: key }));
    results.push({ key, status: "deleted" });
  } catch (err) {
    results.push({
      key,
      status: "error",
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

console.log(JSON.stringify(results, null, 2));
