import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createWriteStream } from "node:fs";
import { readFileSync } from "node:fs";
import { mkdtemp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const require = createRequire(import.meta.url);
const ffmpegPath = require("ffmpeg-static");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const envValue = (k) => envText.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1]?.trim() ?? "";

const lessonId = process.argv[2] ?? "aff41a89-23aa-44cd-8b44-a49f8f1832be";

function run(bin, args) {
  return new Promise((resolve) => {
    const proc = spawn(bin, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (c) => { stderr += c.toString(); });
    proc.on("close", (code) => resolve({ code, stderr }));
  });
}

async function download(key, dest) {
  const s3 = new S3Client({
    forcePathStyle: true,
    region: envValue("SUPABASE_S3_REGION") || "ap-south-1",
    endpoint: envValue("SUPABASE_S3_ENDPOINT"),
    credentials: {
      accessKeyId: envValue("SUPABASE_S3_ACCESS_KEY_ID"),
      secretAccessKey: envValue("SUPABASE_S3_SECRET_ACCESS_KEY"),
    },
  });
  const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: "records", Key: key }), { expiresIn: 600 });
  const res = await fetch(url);
  await new Promise((resolve, reject) => {
    const ws = createWriteStream(dest);
    res.body.pipeTo(new WritableStream({
      write(chunk) { return new Promise((r, j) => ws.write(chunk, (e) => (e ? j(e) : r()))); },
      close() { ws.end(); resolve(); },
      abort(e) { ws.destroy(); reject(e); },
    })).catch(reject);
  });
}

import postgres from "postgres";
const sql = postgres(envValue("DATABASE_URL"), { max: 1, prepare: false, ssl: "require" });
const [lesson] = await sql`select storage_path from public.lesson_analyses where id = ${lessonId}`;
await sql.end();

const work = await mkdtemp(join(tmpdir(), "repair-"));
const src = join(work, "src.mp4");
await download(lesson.storage_path, src);
const stat = await readFile(src).then((b) => b.length);
console.log("bytes", stat);

const attempts = [
  ["default", ["-hide_banner", "-y", "-i", src, "-vf", "fps=1/10", "-frames:v", "5", join(work, "a_%03d.jpg")]],
  ["discardcorrupt", ["-hide_banner", "-y", "-err_detect", "ignore_err", "-fflags", "+discardcorrupt+genpts", "-i", src, "-vf", "fps=1/10", "-frames:v", "5", join(work, "b_%03d.jpg")]],
  ["analyzeduration", ["-hide_banner", "-y", "-analyzeduration", "100M", "-probesize", "100M", "-i", src, "-vf", "fps=1/10", "-frames:v", "5", join(work, "c_%03d.jpg")]],
  ["copy_remux", ["-hide_banner", "-y", "-err_detect", "ignore_err", "-i", src, "-c", "copy", "-movflags", "+faststart", join(work, "remux.mp4")]],
];

for (const [name, args] of attempts) {
  const { code, stderr } = await run(ffmpegPath, args);
  const tail = stderr.split(/\r?\n/).slice(-4).join(" | ");
  let frames = 0;
  if (name === "copy_remux") {
    const remux = join(work, "remux.mp4");
    await mkdir(join(work, "remux_frames"), { recursive: true });
    const r2 = await run(ffmpegPath, ["-hide_banner", "-y", "-i", remux, "-vf", "fps=1/10", "-frames:v", "5", join(work, "remux_frames", "f_%03d.jpg")]);
    frames = (await readdir(join(work, "remux_frames"))).filter((f) => f.endsWith(".jpg")).length;
    console.log(name, "remux_code", r2.code, "frames", frames, tail.slice(0, 120));
  } else {
    const prefix = name === "default" ? "a_" : name === "discardcorrupt" ? "b_" : "c_";
    frames = (await readdir(work)).filter((f) => f.startsWith(prefix) && f.endsWith(".jpg")).length;
    console.log(name, "code", code, "frames", frames, tail.slice(0, 120));
  }
}

await rm(work, { recursive: true, force: true });
