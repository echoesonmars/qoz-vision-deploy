import postgres from "postgres";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const CAPTURE_INTERVAL_SEC = 10;
const INPUT_PRICE_PER_M = 0.25;
const OUTPUT_PRICE_PER_M = 1.5;
const PROMPT_TOKENS = 550;
const IMAGE_TOKENS = 700;
const OUTPUT_TOKENS = 350;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
function envKey(name) {
  const m = envText.match(new RegExp(`^${name}=(.+)$`, "m"));
  return m?.[1]?.trim() ?? "";
}

const require = createRequire(import.meta.url);
function ffprobePath() {
  const fromEnv = envKey("FFPROBE_PATH");
  if (fromEnv) return fromEnv;
  try {
    const bundled = require("ffmpeg-static");
    if (bundled) return bundled.replace(/ffmpeg(\.exe)?$/i, "ffprobe$1");
  } catch {
    /* */
  }
  return "ffprobe";
}

function probeDurationSec(url) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      ffprobePath(),
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        url,
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    let out = "";
    let err = "";
    proc.stdout.on("data", (c) => (out += c.toString()));
    proc.stderr.on("data", (c) => (err += c.toString()));
    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(err.trim() || `ffprobe exit ${code}`));
        return;
      }
      const sec = Number.parseFloat(out.trim());
      if (!Number.isFinite(sec) || sec <= 0) {
        reject(new Error(`invalid duration: ${out.trim()}`));
        return;
      }
      resolve(sec);
    });
    proc.on("error", reject);
  });
}

const s3 = new S3Client({
  forcePathStyle: true,
  region: envKey("SUPABASE_S3_REGION") || "ap-south-1",
  endpoint: envKey("SUPABASE_S3_ENDPOINT"),
  credentials: {
    accessKeyId: envKey("SUPABASE_S3_ACCESS_KEY_ID"),
    secretAccessKey: envKey("SUPABASE_S3_SECRET_ACCESS_KEY"),
  },
});

async function presign(path) {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: envKey("STORAGE_BUCKET") || "records", Key: path }),
    { expiresIn: 3600 },
  );
}

const sql = postgres(envKey("DATABASE_URL"), { max: 1, prepare: false, ssl: "require" });
const lessons = await sql`
  select id, title, storage_path, created_at
  from public.lesson_analyses
  where title ilike 'Live ·%'
  order by created_at desc
`;

const rows = [];
for (const lesson of lessons) {
  let durationSec = null;
  let probeError = null;
  try {
    const url = await presign(lesson.storage_path);
    durationSec = await probeDurationSec(url);
  } catch (e) {
    probeError = e instanceof Error ? e.message : String(e);
  }
  const frames =
    durationSec != null ? Math.max(1, Math.ceil(durationSec / CAPTURE_INTERVAL_SEC)) : null;
  rows.push({
    id: lesson.id,
    title: lesson.title,
    storagePath: lesson.storage_path,
    durationSec,
    durationMin: durationSec != null ? Math.round((durationSec / 60) * 10) / 10 : null,
    framesEvery10Sec: frames,
    probeError,
  });
}

const probed = rows.filter((r) => r.durationSec != null);
const totalSec = probed.reduce((s, r) => s + r.durationSec, 0);
const totalFrames = probed.reduce((s, r) => s + r.framesEvery10Sec, 0);
const inputTokens = totalFrames * (PROMPT_TOKENS + IMAGE_TOKENS);
const outputTokens = totalFrames * OUTPUT_TOKENS;
const costUsd =
  (inputTokens / 1_000_000) * INPUT_PRICE_PER_M + (outputTokens / 1_000_000) * OUTPUT_PRICE_PER_M;
const costUsdBatch = costUsd * 0.5;
const kzt = Math.round(costUsd * 510);
const kztBatch = Math.round(costUsdBatch * 510);

function fmtMin(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}м ${s}с`;
}

console.log(
  JSON.stringify(
    {
      method: "1 кадр каждые 10 секунд на все Live-архивы",
      model: "gemini-3.1-flash-lite",
      pricingUsdPerM: { input: INPUT_PRICE_PER_M, output: OUTPUT_PRICE_PER_M },
      tokenAssumptionsPerFrame: {
        prompt: PROMPT_TOKENS,
        image: IMAGE_TOKENS,
        outputJson: OUTPUT_TOKENS,
      },
      videos: rows.length,
      probedOk: probed.length,
      probedFailed: rows.filter((r) => r.probeError).map((r) => ({
        title: r.title,
        error: r.probeError,
      })),
      totals: {
        videoDurationSec: Math.round(totalSec),
        videoDurationLabel: fmtMin(totalSec),
        geminiRequests: totalFrames,
        inputTokens,
        outputTokens,
        costUsd: Math.round(costUsd * 100) / 100,
        costUsdBatch: Math.round(costUsdBatch * 100) / 100,
        costKztApprox: kzt,
        costKztBatchApprox: kztBatch,
        freeTierDaysAt500PerDay: Math.ceil(totalFrames / 500),
      },
      perVideo: rows.map((r) => ({
        title: r.title,
        durationMin: r.durationMin,
        frames: r.framesEvery10Sec,
        costUsd:
          r.framesEvery10Sec != null
            ? Math.round(
                ((r.framesEvery10Sec * (PROMPT_TOKENS + IMAGE_TOKENS)) / 1_000_000) *
                  INPUT_PRICE_PER_M +
                  ((r.framesEvery10Sec * OUTPUT_TOKENS) / 1_000_000) * OUTPUT_PRICE_PER_M,
                3,
              )
            : null,
      })),
    },
    null,
    2,
  ),
);

await sql.end();
