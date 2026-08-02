import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import postgres from "postgres";

const require = createRequire(import.meta.url);
const ffmpegPath = require("ffmpeg-static");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, "..", "qoz-vision-prod-web", ".env.local");
const envText = readFileSync(envPath, "utf8");

function envValue(key) {
  const m = envText.match(new RegExp(`^${key}=(.+)$`, "m"));
  return m?.[1]?.trim() ?? "";
}

const databaseUrl = envValue("DATABASE_URL");
if (!databaseUrl) throw new Error("DATABASE_URL missing");

const s3 = new S3Client({
  forcePathStyle: true,
  region: envValue("SUPABASE_S3_REGION") || "ap-south-1",
  endpoint: envValue("SUPABASE_S3_ENDPOINT"),
  credentials: {
    accessKeyId: envValue("SUPABASE_S3_ACCESS_KEY_ID"),
    secretAccessKey: envValue("SUPABASE_S3_SECRET_ACCESS_KEY"),
  },
});
const bucket = envValue("STORAGE_BUCKET") || "records";

function formatHms(totalSec) {
  const sec = Math.round(totalSec);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function parseDurationLine(line) {
  const m = line.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!m) return null;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

function probeUrlDurationSec(mediaUrl) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, ["-hide_banner", "-i", mediaUrl], {
      stdio: ["ignore", "ignore", "pipe"],
    });
    let stderr = "";
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error("ffmpeg probe timeout"));
    }, 120_000);
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    proc.on("close", () => {
      clearTimeout(timer);
      for (const line of stderr.split(/\r?\n/)) {
        const sec = parseDurationLine(line);
        if (sec != null) {
          resolve(sec);
          return;
        }
      }
      reject(new Error("Duration not found in ffmpeg output"));
    });
  });
}

const sql = postgres(databaseUrl, { max: 1, prepare: false, ssl: "require" });
const rows = await sql`
  select id, title, status, storage_path, created_at, source_live_session_id, analysis
  from public.lesson_analyses
  order by created_at desc
`;

const items = [];
let totalSec = 0;

for (const row of rows) {
  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucket, Key: row.storage_path }),
    { expiresIn: 600 },
  );
  let durationSec = null;
  let probeError = null;
  try {
    durationSec = await probeUrlDurationSec(signedUrl);
    totalSec += durationSec;
  } catch (e) {
    probeError = e instanceof Error ? e.message : String(e);
  }
  const isLive =
    Boolean(row.source_live_session_id) ||
    (typeof row.title === "string" && row.title.startsWith("Live"));
  items.push({
    id: row.id,
    title: row.title,
    status: row.status,
    isLiveArchive: isLive,
    created_at: row.created_at,
    duration: durationSec != null ? formatHms(durationSec) : null,
    durationSec: durationSec != null ? Math.round(durationSec) : null,
    probeError,
  });
}

const live = items.filter((i) => i.isLiveArchive);
const uploaded = items.filter((i) => !i.isLiveArchive);
const liveSec = live.reduce((s, i) => s + (i.durationSec ?? 0), 0);
const uploadedSec = uploaded.reduce((s, i) => s + (i.durationSec ?? 0), 0);

console.log(
  JSON.stringify(
    {
      tab: "Архив уроков (/dashboard/cameras/engagement?tab=lessons)",
      count: items.length,
      liveArchives: live.length,
      uploadedLessons: uploaded.length,
      totalDuration: formatHms(totalSec),
      totalDurationSec: Math.round(totalSec),
      liveArchivesDuration: formatHms(liveSec),
      uploadedLessonsDuration: formatHms(uploadedSec),
      avgDurationSec: items.length ? Math.round(totalSec / items.length) : 0,
      items,
    },
    null,
    2,
  ),
);

await sql.end();
