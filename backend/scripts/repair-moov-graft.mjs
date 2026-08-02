import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { mkdtemp, mkdir, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import postgres from "postgres";

const require = createRequire(import.meta.url);
const ffmpegPath = require("ffmpeg-static");
const envText = readFileSync("d:/edtech/qoz-vision-prod-web/.env.local", "utf8");
const envValue = (k) => envText.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1]?.trim();

async function downloadLesson(id) {
  const sql = postgres(envValue("DATABASE_URL"), { max: 1, prepare: false, ssl: "require" });
  const [row] = await sql`select storage_path from public.lesson_analyses where id = ${id}`;
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
  return Buffer.from(await (await fetch(url)).arrayBuffer());
}

function readBox(buf, offset) {
  const size = buf.readUInt32BE(offset);
  const type = buf.slice(offset + 4, offset + 8).toString("ascii");
  return { size, type, start: offset, end: offset + size };
}

function extractMoov(buf) {
  let off = 0;
  while (off < buf.length - 8) {
    const box = readBox(buf, off);
    if (box.size < 8) break;
    if (box.type === "moov") return buf.subarray(box.start, box.end);
    off = box.end;
  }
  return null;
}

function extractFtyp(buf) {
  const box = readBox(buf, 0);
  if (box.type === "ftyp") return buf.subarray(0, box.end);
  return null;
}

function extractMdatPayload(buf) {
  let off = 0;
  while (off < buf.length - 8) {
    const box = readBox(buf, off);
    if (box.type === "mdat") return buf.subarray(box.start + 8);
    if (box.size < 8) break;
    off = box.end === 0 ? buf.length : box.end;
  }
  return null;
}

const brokenId = process.argv[2] ?? "aff41a89-23aa-44cd-8b44-a49f8f1832be";
const refId = process.argv[3] ?? "8fbf45a2-75d2-48f1-9592-ce4fe1ba239a";

const broken = await downloadLesson(brokenId);
const ref = await downloadLesson(refId);
const ftyp = extractFtyp(broken) ?? extractFtyp(ref);
const moov = extractMoov(ref);
const mdatPayload = extractMdatPayload(broken);
if (!ftyp || !moov || !mdatPayload) {
  console.error("missing parts", { ftyp: !!ftyp, moov: !!moov, mdat: !!mdatPayload });
  process.exit(1);
}

const mdatSize = 8 + mdatPayload.length;
const mdatHeader = Buffer.alloc(8);
mdatHeader.writeUInt32BE(mdatSize, 0);
mdatHeader.write("mdat", 4);
const repaired = Buffer.concat([ftyp, moov, mdatHeader, mdatPayload]);

const work = await mkdtemp(join(tmpdir(), "repair-"));
const repairedPath = join(work, "repaired.mp4");
writeFileSync(repairedPath, repaired);
console.log("repaired bytes", repaired.length);

function run(args) {
  return new Promise((resolve) => {
    const proc = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (c) => { stderr += c.toString(); });
    proc.on("close", (code) => resolve({ code, stderr }));
  });
}

await mkdir(join(work, "frames"), { recursive: true });
const attempts = [
  ["default", ["-hide_banner", "-y", "-i", repairedPath, "-vf", "fps=1/10", "-frames:v", "10", join(work, "frames", "a_%03d.jpg")]],
  ["err_ignore", ["-hide_banner", "-y", "-err_detect", "ignore_err", "-fflags", "+discardcorrupt+genpts", "-i", repairedPath, "-vf", "fps=1/10", "-frames:v", "10", join(work, "frames", "b_%03d.jpg")]],
  ["vsync0", ["-hide_banner", "-y", "-fflags", "+discardcorrupt", "-i", repairedPath, "-vsync", "0", "-vf", "fps=1/10", "-frames:v", "10", join(work, "frames", "c_%03d.jpg")]],
];
for (const [name, args] of attempts) {
  const { code, stderr } = await run(args);
  const prefix = name === "default" ? "a_" : name === "err_ignore" ? "b_" : "c_";
  const frames = (await readdir(work)).filter((f) => f.startsWith(prefix) && f.endsWith(".jpg")).length;
  const dur = stderr.match(/Duration: ([^\n,]+)/)?.[1] ?? "n/a";
  console.log(name, "code", code, "frames", frames, "duration", dur);
}
await rm(work, { recursive: true, force: true });
