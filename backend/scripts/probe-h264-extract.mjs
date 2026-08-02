import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import postgres from "postgres";

const require = createRequire(import.meta.url);
const ffmpegPath = require("ffmpeg-static");
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
const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: "records", Key: row.storage_path }), { expiresIn: 600 });
const buf = Buffer.from(await (await fetch(url)).arrayBuffer());

const work = await mkdtemp(join(tmpdir(), "h264-"));
const rawPath = join(work, "raw.h264");
const mdatStart = buf.indexOf(Buffer.from("mdat")) + 4;
writeFileSync(rawPath, buf.subarray(mdatStart));

function run(args) {
  return new Promise((resolve) => {
    const proc = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (c) => { stderr += c.toString(); });
    proc.on("close", (code) => resolve({ code, stderr }));
  });
}

const tries = [
  ["h264_raw", ["-hide_banner", "-y", "-f", "h264", "-i", rawPath, "-vf", "fps=1/10", "-frames:v", "5", join(work, "f_%03d.jpg")]],
  ["h264_probe", ["-hide_banner", "-y", "-probesize", "50M", "-analyzeduration", "50M", "-f", "h264", "-i", rawPath, "-vf", "fps=1/10", "-frames:v", "5", join(work, "g_%03d.jpg")]],
  ["concat_ref", null],
];

for (const [name, args] of tries) {
  if (!args) continue;
  const { code, stderr } = await run(args);
  const frames = (await readdir(work)).filter((f) => f.endsWith(".jpg")).length;
  const dur = stderr.match(/Duration: ([^\n,]+)/)?.[1] ?? "n/a";
  console.log(name, "code", code, "frames", frames, "duration", dur);
}

await rm(work, { recursive: true, force: true });
