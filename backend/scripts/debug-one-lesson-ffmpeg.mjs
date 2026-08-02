import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import postgres from "postgres";

const require = createRequire(import.meta.url);
const ffmpegPath = require("ffmpeg-static");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const envValue = (key) => envText.match(new RegExp(`^${key}=(.+)$`, "m"))?.[1]?.trim() ?? "";
const lessonId = process.argv[2] ?? "aff41a89-23aa-44cd-8b44-a49f8f1832be";

const sql = postgres(envValue("DATABASE_URL"), { max: 1, prepare: false, ssl: "require" });
const [row] = await sql`select storage_path from public.lesson_analyses where id = ${lessonId}`;
const s3 = new S3Client({
  forcePathStyle: true,
  region: envValue("SUPABASE_S3_REGION") || "ap-south-1",
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
const dest = join(root, "scripts", "_probe-tmp.mp4");
const res = await fetch(url);
const ws = createWriteStream(dest);
await new Promise((resolve, reject) => {
  res.body.pipeTo(
    new WritableStream({
      write(chunk) {
        return new Promise((res, rej) => ws.write(chunk, (e) => (e ? rej(e) : res())));
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

const proc = spawn(ffmpegPath, ["-hide_banner", "-i", dest], { stdio: ["ignore", "ignore", "pipe"] });
let stderr = "";
proc.stderr.on("data", (c) => { stderr += c.toString(); });
proc.on("close", () => {
  console.log(stderr.slice(0, 2000));
});
await sql.end();
