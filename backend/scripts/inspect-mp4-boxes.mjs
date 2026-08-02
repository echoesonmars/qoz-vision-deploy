import { readFileSync } from "node:fs";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import postgres from "postgres";

const envText = readFileSync("d:/edtech/qoz-vision-prod-web/.env.local", "utf8");
const envValue = (k) => envText.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1]?.trim();
const lessonId = process.argv[2] ?? "aff41a89-23aa-44cd-8b44-a49f8f1832be";

const sql = postgres(envValue("DATABASE_URL"), { max: 1, prepare: false, ssl: "require" });
const [row] = await sql`select storage_path from public.lesson_analyses where id = ${lessonId}`;
await sql.end();

const s3 = new S3Client({
  forcePathStyle: true,
  region: envValue("SUPABASE_S3_REGION"),
  endpoint: envValue("SUPABASE_S3_ENDPOINT"),
  credentials: {
    accessKeyId: envValue("SUPABASE_S3_ACCESS_KEY_ID"),
    secretAccessKey: envValue("SUPABASE_S3_SECRET_ACCESS_KEY"),
  },
});
const url = await getSignedUrl(
  s3,
  new GetObjectCommand({ Bucket: "records", Key: row.storage_path }),
  { expiresIn: 600 },
);
const res = await fetch(url);
const buf = Buffer.from(await res.arrayBuffer());
console.log("size", buf.length);
console.log("head", buf.slice(0, 32).toString("hex"));
const boxes = [];
for (let i = 0; i < Math.min(buf.length, 2000); ) {
  if (i + 8 > buf.length) break;
  const size = buf.readUInt32BE(i);
  const type = buf.slice(i + 4, i + 8).toString("ascii");
  boxes.push({ off: i, size, type });
  if (size < 8 || size > buf.length) break;
  i += size;
}
console.log("boxes", boxes.slice(0, 10));
console.log("moov index", buf.indexOf(Buffer.from("moov")));
console.log("mdat index", buf.indexOf(Buffer.from("mdat")));
console.log("ftyp index", buf.indexOf(Buffer.from("ftyp")));
