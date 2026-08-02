import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import postgres from "postgres";

const require = createRequire(import.meta.url);
const ffmpegPath = require("ffmpeg-static");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const envValue = (key) => envText.match(new RegExp(`^${key}=(.+)$`, "m"))?.[1]?.trim() ?? "";

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

function parseDuration(stderr) {
  for (const line of stderr.split(/\r?\n/)) {
    const m = line.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
    if (m) return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
  }
  return null;
}

function probeLocal(path) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, ["-hide_banner", "-i", path], { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (c) => { stderr += c.toString(); });
    proc.on("error", reject);
    proc.on("close", () => {
      const sec = parseDuration(stderr);
      if (sec != null) resolve(sec);
      else reject(new Error("no duration"));
    });
  });
}

async function downloadToFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`download HTTP ${res.status}`);
  await new Promise((resolve, reject) => {
    const ws = createWriteStream(dest);
    res.body.pipeTo(
      new WritableStream({
        write(chunk) {
          return new Promise((res, rej) => {
            ws.write(chunk, (err) => (err ? rej(err) : res()));
          });
        },
        close() {
          ws.end();
          resolve();
        },
        abort(err) {
          ws.destroy();
          reject(err);
        },
      }),
    ).catch(reject);
  });
}

function formatHms(totalSec) {
  const sec = Math.round(totalSec);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const sql = postgres(envValue("DATABASE_URL"), { max: 1, prepare: false, ssl: "require" });
const rows = await sql`
  select id, title, storage_path, created_at, source_live_session_id
  from public.lesson_analyses
  order by created_at desc
`;

const tmpRoot = await mkdtemp(join(tmpdir(), "lesson-dur-"));
const items = [];
let totalSec = 0;

try {
  for (const row of rows) {
    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: bucket, Key: row.storage_path }),
      { expiresIn: 3600 },
    );
    const localPath = join(tmpRoot, `${row.id}.mp4`);
    let durationSec = null;
    let probeError = null;
    try {
      await downloadToFile(signedUrl, localPath);
      durationSec = await probeLocal(localPath);
      totalSec += durationSec;
    } catch (e) {
      probeError = e instanceof Error ? e.message : String(e);
    }
    const isLive =
      Boolean(row.source_live_session_id) ||
      (typeof row.title === "string" && row.title.startsWith("Live"));
    items.push({
      title: row.title,
      isLiveArchive: isLive,
      created_at: row.created_at,
      duration: durationSec != null ? formatHms(durationSec) : null,
      durationSec: durationSec != null ? Math.round(durationSec) : null,
      probeError,
    });
  }
} finally {
  await rm(tmpRoot, { recursive: true, force: true });
}

const live = items.filter((i) => i.isLiveArchive);
const uploaded = items.filter((i) => !i.isLiveArchive);
console.log(
  JSON.stringify(
    {
      count: items.length,
      liveArchives: live.length,
      uploadedLessons: uploaded.length,
      totalDuration: formatHms(totalSec),
      totalDurationSec: Math.round(totalSec),
      liveArchivesDuration: formatHms(live.reduce((s, i) => s + (i.durationSec ?? 0), 0)),
      uploadedLessonsDuration: formatHms(uploaded.reduce((s, i) => s + (i.durationSec ?? 0), 0)),
      avgDurationSec: items.length ? Math.round(totalSec / items.length) : 0,
      items,
    },
    null,
    2,
  ),
);
await sql.end();
