import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import postgres from "postgres";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const envValue = (key) => envText.match(new RegExp(`^${key}=(.+)$`, "m"))?.[1]?.trim() ?? "";

const sql = postgres(envValue("DATABASE_URL"), { max: 1, prepare: false, ssl: "require" });
const s3 = new S3Client({
  forcePathStyle: true,
  region: envValue("SUPABASE_S3_REGION") || "ap-south-1",
  endpoint: envValue("SUPABASE_S3_ENDPOINT"),
  credentials: {
    accessKeyId: envValue("SUPABASE_S3_ACCESS_KEY_ID"),
    secretAccessKey: envValue("SUPABASE_S3_SECRET_ACCESS_KEY"),
  },
});
const bucket = "records";
const rows = await sql`
  select id, title, storage_path
  from public.lesson_analyses
  order by created_at desc
`;
const out = [];
for (const row of rows) {
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: row.storage_path }));
    out.push({
      id: row.id,
      title: row.title,
      bytes: Number(head.ContentLength ?? 0),
      contentType: head.ContentType ?? null,
    });
  } catch (e) {
    out.push({
      id: row.id,
      title: row.title,
      bytes: null,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
console.log(JSON.stringify(out, null, 2));
await sql.end();
