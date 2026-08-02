import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { createWriteStream } from "node:fs";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { mkdtemp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import postgres from "postgres";

const require = createRequire(import.meta.url);
const ffmpegPath = require("ffmpeg-static");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const progressPath = join(root, "scripts", "restore-live-progress.json");

const INCIDENT_TYPES = [
  "fight",
  "weapon",
  "fall",
  "smoking",
  "phone_usage",
  "sleep",
  "lost_property",
  "crowd",
  "wanted_person",
  "fence_climbing",
  "anpr",
  "fire",
  "smoke",
];

const EVIDENCE_RE = /^live-evidence\/([0-9a-f-]{36})\/([0-9a-f-]{36})\.jpg$/i;
const RECORDING_RE = /^live-recordings\/([0-9a-f-]{36})\.mp4$/i;
const INTERVAL_SEC = Math.max(5, Number(process.env.RESTORE_INTERVAL_SEC ?? 10));
const MAX_FRAMES = Math.max(1, Number(process.env.RESTORE_MAX_FRAMES ?? 120));
const CLUSTER_MS = Math.max(1000, Number(process.env.RESTORE_CLUSTER_MS ?? 3000));
const MATCH_MS = Math.max(1000, Number(process.env.RESTORE_MATCH_MS ?? 5000));
const GEMINI_SLEEP_MS = Math.max(100, Number(process.env.RESTORE_GEMINI_SLEEP_MS ?? 400));

function liveFrameAnalyzeModels() {
  const fallbacks = (env.GEMINI_LIVE_FRAME_FALLBACK_MODELS ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  const primary =
    env.GEMINI_LIVE_FRAME_MODEL?.trim() ||
    env.GEMINI_ANALYZE_MODEL?.trim() ||
    "gemini-3.1-flash-lite";
  return [...new Set([primary, ...fallbacks])];
}

const incidentConfidenceSchema = z.enum(["high", "medium", "low"]);
const liveDetectedIncidentSchema = z.object({
  type: z.enum(INCIDENT_TYPES),
  confidence: incidentConfidenceSchema,
  location_context: z.string().optional().default(""),
  description: z.string().min(1),
  timestamp_marker: z.string().optional().default("frame_static"),
});
const liveAnalysisPayloadSchema = z.object({
  analytics_meta: z.object({
    target_language: z.string(),
    overall_engagement_score: z.coerce.number().min(0).max(100),
  }),
  classroom_visual_behavior: z.object({
    students_count_detected: z.coerce.number().int().min(0),
    active_phone_users: z.coerce.number().int().min(0),
    sleeping_count: z.coerce.number().int().min(0),
    general_focus_description: z.string(),
  }),
  detected_incidents: z.array(liveDetectedIncidentSchema),
});

const INCIDENT_ALIASES = {
  phone: "phone_usage",
  phones: "phone_usage",
  phoneusage: "phone_usage",
  mobile: "phone_usage",
  smartphone: "phone_usage",
  sleeping: "sleep",
  asleep: "sleep",
  nap: "sleep",
  fighting: "fight",
  brawl: "fight",
  weapons: "weapon",
  gun: "weapon",
  knife: "weapon",
  fallen: "fall",
  cigarette: "smoking",
  flame: "fire",
  gathering: "crowd",
  stranger: "intruder",
  unknown: "intruder",
  lostproperty: "lost_property",
  abandoned: "lost_property",
  wantedperson: "wanted_person",
  fenceclimbing: "fence_climbing",
  climbing: "fence_climbing",
  license_plate: "anpr",
  plate: "anpr",
};
const KNOWN_INCIDENT_TYPES = new Set(INCIDENT_TYPES);

function slugIncidentType(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function normalizeLiveIncidentType(raw) {
  const s = slugIncidentType(String(raw ?? ""));
  if (!s) return "intruder";
  if (KNOWN_INCIDENT_TYPES.has(s)) return s;
  if (INCIDENT_ALIASES[s]) return INCIDENT_ALIASES[s];
  for (const [key, value] of Object.entries(INCIDENT_ALIASES)) {
    if (s.includes(key) || key.includes(s)) return value;
  }
  return "intruder";
}

const DRY = process.argv.includes("--dry-run");
const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");
const SKIP_GEMINI = process.argv.includes("--skip-gemini");
const sessionArg = process.argv.find((a) => a.startsWith("--session="))?.slice("--session=".length);

if (!DRY && !APPLY) {
  console.error("Pass --dry-run or --apply");
  process.exit(1);
}

function loadEnvFile(path) {
  const text = readFileSync(path, "utf8");
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i <= 0) continue;
    out[t.slice(0, i)] = t.slice(i + 1);
  }
  return out;
}

const backendEnv = loadEnvFile(join(root, ".env"));
const localEnv = loadEnvFile(join(root, "..", "qoz-vision-prod-web", ".env.local"));
const env = { ...localEnv, ...backendEnv };
const GEMINI_MODELS = liveFrameAnalyzeModels();

const GEMINI_API_KEY = env.GEMINI_API_KEY?.trim();
if (!SKIP_GEMINI && !GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing");
}

const cameras = JSON.parse(
  readFileSync(join(root, "..", "qoz-vision-prod-web", "cameras.json"), "utf8"),
);
const labelToCamera = new Map();
for (const c of cameras) {
  const deviceId = `${c.id}-${c.uniqueChannel}`;
  const label = `${c.name?.trim() || `Камера ${c.index}`} · к.${c.uniqueChannel}`;
  labelToCamera.set(label, { deviceId, cameraId: c.id });
}

const fallbackCamera = {
  deviceId: `${cameras[0].id}-${cameras[0].uniqueChannel}`,
  cameraId: cameras[0].id,
};

function resolveCameraFromTitle(title) {
  const livePart = title?.match(/^Live · (.+?) · \d{2}\.\d{2}\.\d{4}/)?.[1];
  if (livePart && labelToCamera.has(livePart)) return labelToCamera.get(livePart);
  const channel = livePart?.match(/к\.(\d+)/)?.[1];
  if (channel) {
    const hit = cameras.find((c) => String(c.uniqueChannel) === channel);
    if (hit) return { deviceId: `${hit.id}-${hit.uniqueChannel}`, cameraId: hit.id };
  }
  const deviceInTitle = title?.match(/([a-f0-9]{24}-\d+)/i)?.[1];
  if (deviceInTitle) {
    return { deviceId: deviceInTitle, cameraId: deviceInTitle.split("-")[0] };
  }
  return fallbackCamera;
}

function buildClassroomVisualLivePrompt(targetLanguage) {
  const incidentTypes = INCIDENT_TYPES.join(" | ");
  return `You are an advanced multi-modal AI Video & Image Analytics Engine designed for smart school management systems ("Qoz"). There is NO AUDIO track available; you must rely strictly on visual cues, body language, postures, and spatial positioning.

Your task is to perform a unified visual analysis of the classroom to evaluate student engagement and detect security/safety infractions simultaneously.

### INPUT PARAMETERS:
- Target Language: ${targetLanguage} (All descriptive text fields in the JSON must be strictly in this language).

### UNIFIED VISUAL ANALYSIS CORE CRITERIA:

1. Visual Engagement Tracking:
- Scan individual students for body language metrics:
  * Phone Usage: Holding a mobile device, looking down at the lap/under the desk repeatedly.
  * Sleeping: Head flat on the desk, body slumped, or eyes closed for a prolonged time.
  * Distraction: Turning away from the front, active whispering/talking to neighbors, staring out windows.
- General Focus: Assess overall classroom attention based on gaze direction toward the teacher or blackboard.

2. Security & Infractions Log (13 Strict Categories):
Explicitly scan the frame for any of the following specific incident types:
- fight, weapon, fall, smoking, phone_usage, sleep, lost_property, crowd, wanted_person, fence_climbing, anpr, fire, smoke

IMPORTANT classification rules:
- Normal students sitting at desks during a lesson is NOT "crowd". Do NOT use "crowd" for a regular classroom with seated students.
- Use "crowd" ONLY for abnormal gathering, blocking passages, or a dense cluster in a non-classroom area.
- A single frame may contain MULTIPLE simultaneous violations (e.g. phone_usage AND sleep). Return EACH as a separate object in detected_incidents.
- If the scene shows a routine lesson without a clear safety violation, return detected_incidents as [].

### OUTPUT FORMAT:
Return strictly a raw valid JSON object. Do not wrap it in markdown code blocks. Do not add any conversational prose.

{
  "analytics_meta": {
    "target_language": "string",
    "overall_engagement_score": 0-100
  },
  "classroom_visual_behavior": {
    "students_count_detected": 0,
    "active_phone_users": 0,
    "sleeping_count": 0,
    "general_focus_description": "string"
  },
  "detected_incidents": [
    {
      "type": "${incidentTypes}",
      "confidence": "high | medium | low",
      "location_context": "string",
      "description": "string",
      "timestamp_marker": "frame_static"
    }
  ]
}

If no violations are visible, return detected_incidents as an empty array. Do not invent events not visible in the image.`;
}

function parseLiveAnalysisPayload(raw) {
  try {
    const json = extractJson(raw);
    return liveAnalysisPayloadSchema.parse(JSON.parse(json));
  } catch {
    return null;
  }
}

function extractJson(text) {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence?.[1]) return fence[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function median(values) {
  if (values.length === 0) return INTERVAL_SEC;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : Math.round(sorted[mid]);
}

function clusterByTime(items, windowMs) {
  const sorted = [...items].sort((a, b) => a.ts - b.ts);
  const clusters = [];
  for (const item of sorted) {
    const last = clusters[clusters.length - 1];
    if (!last || item.ts - last.anchorTs > windowMs) {
      clusters.push({ anchorTs: item.ts, items: [item] });
      continue;
    }
    last.items.push(item);
    last.anchorTs = Math.min(last.anchorTs, item.ts);
  }
  return clusters;
}

function probeDurationSec(sourcePath) {
  return new Promise((resolve) => {
    const proc = spawn(ffmpegPath, [
      "-hide_banner",
      "-i",
      sourcePath,
    ], { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (c) => {
      stderr += c.toString();
    });
    proc.on("close", () => {
      const m = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(stderr);
      if (!m) {
        resolve(null);
        return;
      }
      const sec = Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
      resolve(Number.isFinite(sec) && sec > 0 ? Math.round(sec) : null);
    });
    proc.on("error", () => resolve(null));
  });
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error("ffmpeg timeout"));
    }, 300_000);
    proc.stderr.on("data", (c) => {
      stderr += c.toString();
    });
    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0 && code !== 1) {
        reject(new Error(stderr.trim() || `ffmpeg exit ${code}`));
        return;
      }
      resolve(stderr);
    });
  });
}

async function downloadUrl(url, dest) {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`download HTTP ${res.status}`);
  await new Promise((resolve, reject) => {
    const ws = createWriteStream(dest);
    res.body
      .pipeTo(
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
      )
      .catch(reject);
  });
}

async function extractFrames(sourcePath, framesDir, intervalSec) {
  await mkdir(framesDir, { recursive: true });
  const pattern = join(framesDir, "frame_%05d.jpg");
  await runFfmpeg([
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-err_detect",
    "ignore_err",
    "-fflags",
    "+discardcorrupt+genpts",
    "-i",
    sourcePath,
    "-vf",
    `fps=1/${intervalSec},scale=640:-1`,
    "-q:v",
    "4",
    "-frames:v",
    String(MAX_FRAMES),
    pattern,
  ]);
  const names = (await readdir(framesDir))
    .filter((n) => /^frame_\d+\.jpg$/i.test(n))
    .sort((a, b) => a.localeCompare(b));
  const frames = [];
  for (let i = 0; i < names.length; i += 1) {
    const jpeg = await readFile(join(framesDir, names[i]));
    if (jpeg.length > 0) {
      frames.push({ index: i, offsetSec: i * intervalSec, jpeg });
    }
  }
  return frames;
}

const s3 = new S3Client({
  forcePathStyle: true,
  region: env.SUPABASE_S3_REGION || "ap-south-1",
  endpoint: env.SUPABASE_S3_ENDPOINT,
  credentials: {
    accessKeyId: env.SUPABASE_S3_ACCESS_KEY_ID,
    secretAccessKey: env.SUPABASE_S3_SECRET_ACCESS_KEY,
  },
});
const bucket = env.STORAGE_BUCKET || "records";
const sql = postgres(env.DATABASE_URL, { max: 2, prepare: false, ssl: "require" });
const ai = SKIP_GEMINI ? null : new GoogleGenAI({ apiKey: GEMINI_API_KEY });

function loadProgress() {
  if (!existsSync(progressPath)) return { completedSessions: [] };
  return JSON.parse(readFileSync(progressPath, "utf8"));
}

function saveProgress(progress) {
  writeFileSync(progressPath, JSON.stringify(progress, null, 2));
}

function structuralPayloadOnly() {
  return {
    analytics_meta: { target_language: "ru", overall_engagement_score: 50 },
    classroom_visual_behavior: {
      students_count_detected: 0,
      active_phone_users: 0,
      sleeping_count: 0,
      general_focus_description: "Восстановлено из storage (без AI-анализа)",
    },
    detected_incidents: [],
  };
}

function filterFalseCrowdIncidents(incidents, behavior) {
  return incidents.filter((inc) => {
    if (normalizeLiveIncidentType(inc.type) !== "crowd") return true;
    const students = Number(behavior?.students_count_detected ?? 0);
    const desc = String(inc.description ?? "").toLowerCase();
    const routineClass =
      students > 0 &&
      /урок|класс|сидят|сидя|занят|парты|ученик|student|seated|desk|lesson|routine|normal/i.test(
        desc,
      );
    if (routineClass && inc.confidence !== "high") return false;
    return true;
  });
}

async function analyzeFrame(jpeg) {
  if (SKIP_GEMINI) {
    return structuralPayloadOnly();
  }
  const base64 = jpeg.toString("base64");
  const prompt = buildClassroomVisualLivePrompt("ru");
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                { inlineData: { mimeType: "image/jpeg", data: base64 } },
                { text: "Верни только JSON по схеме из инструкции." },
              ],
            },
          ],
        });
        const text = response.text;
        if (!text) throw new Error("empty gemini");
        const parsed = parseLiveAnalysisPayload(text);
        if (!parsed) throw new Error("invalid gemini json");
        parsed.detected_incidents = filterFalseCrowdIncidents(
          parsed.detected_incidents,
          parsed.classroom_visual_behavior,
        );
        return parsed;
      } catch (err) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        if (/429|503|UNAVAILABLE|RESOURCE_EXHAUSTED/i.test(msg) && attempt < 1) {
          await sleep(1500 * (attempt + 1));
          continue;
        }
        break;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("gemini failed");
}

async function discoverOrphanSessions() {
  const storageObjects = await sql`
    select name, created_at, updated_at, (metadata->>'size')::bigint as bytes
    from storage.objects
    where bucket_id = ${bucket}
  `;

  const incidentPaths = new Set(
    (await sql`select storage_path from public.incidents`).map((r) => r.storage_path),
  );
  const lessonPaths = new Set(
    (await sql`select storage_path from public.lesson_analyses`).map((r) => r.storage_path),
  );
  const evidencePaths = new Set(
    (
      await sql`
        select evidence_storage_path as path
        from public.live_incident_events
        where evidence_storage_path is not null and evidence_storage_path <> ''
      `
    ).map((r) => r.path),
  );
  const recordingPaths = new Set(
    (
      await sql`
        select recording_storage_path as path
        from public.live_monitor_sessions
        where recording_storage_path is not null and recording_storage_path <> ''
      `
    ).map((r) => r.path),
  );
  const dbPaths = new Set([
    ...incidentPaths,
    ...lessonPaths,
    ...evidencePaths,
    ...recordingPaths,
  ]);

  const sessions = new Map();

  for (const obj of storageObjects) {
    if (dbPaths.has(obj.name)) continue;
    const ev = obj.name.match(EVIDENCE_RE);
    if (ev) {
      const sessionId = ev[1];
      const bucketEntry = sessions.get(sessionId) ?? {
        sessionId,
        evidence: [],
        recording: null,
      };
      bucketEntry.evidence.push({
        path: obj.name,
        eventId: ev[2],
        ts: new Date(obj.created_at).getTime(),
        bytes: Number(obj.bytes ?? 0),
      });
      sessions.set(sessionId, bucketEntry);
      continue;
    }
    const rec = obj.name.match(RECORDING_RE);
    if (rec) {
      const sessionId = rec[1];
      const bucketEntry = sessions.get(sessionId) ?? {
        sessionId,
        evidence: [],
        recording: null,
      };
      bucketEntry.recording = {
        path: obj.name,
        ts: new Date(obj.created_at).getTime(),
        bytes: Number(obj.bytes ?? 0),
      };
      sessions.set(sessionId, bucketEntry);
    }
  }

  return [...sessions.values()].filter(
    (s) => s.evidence.length > 0 || s.recording != null,
  );
}

async function resolveDeviceForSession(sessionStart) {
  const envDevice = env.RESTORE_DEFAULT_DEVICE_ID?.trim();
  if (envDevice) {
    const camId = envDevice.split("-")[0];
    return { deviceId: envDevice, cameraId: camId };
  }

  const [lesson] = await sql`
    select title, created_at
    from public.lesson_analyses
    where created_at between ${new Date(sessionStart.getTime() - 3 * 60 * 60 * 1000)} and ${new Date(sessionStart.getTime() + 3 * 60 * 60 * 1000)}
      and title ilike '%Live%'
    order by abs(extract(epoch from (created_at - ${sessionStart})))
    limit 1
  `;
  if (lesson?.title) return resolveCameraFromTitle(lesson.title);
  return fallbackCamera;
}

async function sessionNeedsRestore(sessionId) {
  const [row] = await sql`
    select
      s.id,
      coalesce(snap.cnt, 0)::int as snapshot_count
    from public.live_monitor_sessions s
    left join lateral (
      select count(*)::int as cnt
      from public.live_analysis_snapshots las
      where las.session_id = s.id
    ) snap on true
    where s.id = ${sessionId}
    limit 1
  `;
  if (!row) return true;
  if (FORCE) return true;
  return row.snapshot_count === 0;
}

async function clearSessionData(sessionId) {
  await sql`delete from public.live_incident_events where session_id = ${sessionId}`;
  await sql`delete from public.live_analysis_snapshots where session_id = ${sessionId}`;
}

async function upsertSession(input) {
  const {
    sessionId,
    deviceId,
    cameraId,
    startedAt,
    stoppedAt,
    recordingPath,
    recordingBytes,
    frameCount,
  } = input;
  const durationSec = Math.max(
    1,
    Math.round((stoppedAt.getTime() - startedAt.getTime()) / 1000),
  );
  await sql`
    insert into public.live_monitor_sessions (
      id,
      device_id,
      camera_id,
      hls_url,
      status,
      started_at,
      stopped_at,
      recording_storage_path,
      recording_upload_status,
      recording_duration_sec,
      recording_bytes,
      frame_count
    )
    values (
      ${sessionId},
      ${deviceId},
      ${cameraId},
      ${""},
      ${"stopped"},
      ${startedAt},
      ${stoppedAt},
      ${recordingPath},
      ${recordingPath ? "ready" : null},
      ${recordingPath ? durationSec : null},
      ${recordingBytes ?? null},
      ${frameCount}
    )
    on conflict (id) do update set
      device_id = excluded.device_id,
      camera_id = excluded.camera_id,
      status = excluded.status,
      started_at = excluded.started_at,
      stopped_at = excluded.stopped_at,
      recording_storage_path = coalesce(excluded.recording_storage_path, public.live_monitor_sessions.recording_storage_path),
      recording_upload_status = coalesce(excluded.recording_upload_status, public.live_monitor_sessions.recording_upload_status),
      recording_duration_sec = coalesce(excluded.recording_duration_sec, public.live_monitor_sessions.recording_duration_sec),
      recording_bytes = coalesce(excluded.recording_bytes, public.live_monitor_sessions.recording_bytes),
      frame_count = greatest(excluded.frame_count, public.live_monitor_sessions.frame_count)
  `;
}

function normalizePayload(raw) {
  const parsed = liveAnalysisPayloadSchema.safeParse(raw);
  const payload = parsed.success ? parsed.data : structuralPayloadOnly();
  return {
    analytics_meta: payload.analytics_meta,
    classroom_visual_behavior: payload.classroom_visual_behavior,
    detected_incidents: filterFalseCrowdIncidents(
      payload.detected_incidents.map((inc) => ({
        type: normalizeLiveIncidentType(inc.type),
        confidence: inc.confidence,
        location_context: inc.location_context ?? "",
        description: inc.description,
        timestamp_marker: inc.timestamp_marker ?? "frame_static",
      })),
      payload.classroom_visual_behavior,
    ),
  };
}

function mapIncidentsToEvidence(incidents, evidenceItems) {
  if (incidents.length === 0) return [];
  const rows = [];
  const primary = evidenceItems[0] ?? null;

  if (evidenceItems.length <= 1) {
    for (let i = 0; i < incidents.length; i += 1) {
      const inc = incidents[i];
      rows.push({
        id: i === 0 && primary?.eventId ? primary.eventId : randomUUID(),
        incident_type: normalizeLiveIncidentType(inc.type),
        confidence: inc.confidence,
        location_context: inc.location_context ?? "",
        description: inc.description,
        timestamp_marker: inc.timestamp_marker ?? "frame_static",
        evidence_storage_path: primary?.path ?? null,
      });
    }
    return rows;
  }

  const pairCount = Math.max(incidents.length, evidenceItems.length);
  for (let i = 0; i < pairCount; i += 1) {
    const inc = incidents[i % incidents.length];
    const ev = evidenceItems[i] ?? evidenceItems[0];
    rows.push({
      id: ev.eventId,
      incident_type: normalizeLiveIncidentType(inc.type),
      confidence: inc.confidence,
      location_context: inc.location_context ?? "",
      description: inc.description,
      timestamp_marker: inc.timestamp_marker ?? "frame_static",
      evidence_storage_path: ev.path,
    });
  }
  return rows;
}

function augmentIncidentsFromBehavior(payload, evidenceItems) {
  if (evidenceItems.length === 0 || payload.detected_incidents.length > 0) {
    return payload;
  }
  const b = payload.classroom_visual_behavior;
  const inferred = [];
  if (Number(b.active_phone_users) > 0) {
    inferred.push({
      type: "phone_usage",
      confidence: "medium",
      location_context: "",
      description: "Использование телефона на уроке",
      timestamp_marker: "frame_static",
    });
  }
  if (Number(b.sleeping_count) > 0) {
    inferred.push({
      type: "sleep",
      confidence: "medium",
      location_context: "",
      description: "Засыпание на уроке",
      timestamp_marker: "frame_static",
    });
  }
  if (inferred.length === 0) return payload;
  return { ...payload, detected_incidents: inferred };
}

async function insertSnapshotBundle(input) {
  const {
    sessionId,
    deviceId,
    sessionStartedAt,
    offsetSec,
    payload,
    evidenceItems,
    matchedEvidencePaths,
  } = input;
  const capturedAt = new Date(sessionStartedAt.getTime() + offsetSec * 1000);
  const withBehavior = augmentIncidentsFromBehavior(payload, evidenceItems);
  const normalized = normalizePayload(withBehavior);
  const incidents = normalized.detected_incidents;
  const [snapshot] = await sql`
    insert into public.live_analysis_snapshots (
      session_id,
      device_id,
      payload,
      engagement_score,
      incident_count,
      session_offset_sec,
      captured_at
    )
    values (
      ${sessionId},
      ${deviceId},
      ${sql.json(normalized)},
      ${normalized.analytics_meta.overall_engagement_score},
      ${incidents.length},
      ${offsetSec},
      ${capturedAt}
    )
    returning id, captured_at
  `;

  const incidentRows = mapIncidentsToEvidence(incidents, evidenceItems);
  if (incidentRows.length === 0) {
    return { snapshotId: snapshot.id, incidents: 0 };
  }

  await sql`
    update public.live_analysis_snapshots
    set incident_count = ${incidentRows.length}
    where id = ${snapshot.id}
  `;

  const rows = incidentRows.map((row) => {
    if (row.evidence_storage_path) matchedEvidencePaths.add(row.evidence_storage_path);
    return {
      id: row.id,
      snapshot_id: snapshot.id,
      session_id: sessionId,
      device_id: deviceId,
      captured_at: snapshot.captured_at,
      incident_type: row.incident_type,
      confidence: row.confidence,
      location_context: row.location_context,
      description: row.description,
      timestamp_marker: row.timestamp_marker,
      evidence_storage_path: row.evidence_storage_path,
    };
  });

  await sql`
    insert into public.live_incident_events ${sql(
      rows,
      "id",
      "snapshot_id",
      "session_id",
      "device_id",
      "captured_at",
      "incident_type",
      "confidence",
      "location_context",
      "description",
      "timestamp_marker",
      "evidence_storage_path",
    )}
    on conflict (id) do nothing
  `;

  return { snapshotId: snapshot.id, incidents: rows.length };
}

async function downloadStorageObject(key, dest) {
  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 },
  );
  await downloadUrl(signedUrl, dest);
}

async function processSession(bundle) {
  const { sessionId, evidence, recording } = bundle;
  if (!(await sessionNeedsRestore(sessionId))) {
    return { sessionId, status: "skipped_existing" };
  }

  const evidenceSorted = [...evidence].sort((a, b) => a.ts - b.ts);
  const startTs = Math.min(
    evidenceSorted[0]?.ts ?? Number.MAX_SAFE_INTEGER,
    recording?.ts ?? Number.MAX_SAFE_INTEGER,
  );
  let endTs = Math.max(
    evidenceSorted[evidenceSorted.length - 1]?.ts ?? 0,
    recording?.ts ?? 0,
  );
  const startedAt = new Date(startTs);
  let stoppedAt = new Date(Math.max(endTs, startTs + INTERVAL_SEC * 1000));
  const camera = await resolveDeviceForSession(startedAt);

  const deltas = [];
  for (let i = 1; i < evidenceSorted.length; i += 1) {
    const d = (evidenceSorted[i].ts - evidenceSorted[i - 1].ts) / 1000;
    if (d >= 1 && d <= 120) deltas.push(d);
  }
  const intervalSec = median(deltas);

  const plan = {
    sessionId,
    deviceId: camera.deviceId,
    evidencePhotos: evidenceSorted.length,
    hasRecording: Boolean(recording),
    intervalSec,
    startedAt: startedAt.toISOString(),
    stoppedAt: stoppedAt.toISOString(),
  };

  if (DRY) {
    return { sessionId, status: "planned", plan };
  }

  await clearSessionData(sessionId);
  await upsertSession({
    sessionId,
    deviceId: camera.deviceId,
    cameraId: camera.cameraId,
    startedAt,
    stoppedAt,
    recordingPath: recording?.path ?? null,
    recordingBytes: recording?.bytes ?? null,
    frameCount: 0,
  });

  const matchedEvidencePaths = new Set();
  let snapshotCount = 0;
  let incidentCount = 0;
  let maxOffsetSec = 0;

  const workDir = await mkdtemp(join(tmpdir(), `restore-live-${sessionId.slice(0, 8)}-`));
  try {
    let frames = [];
    let recordingDurationSec = null;
    if (recording) {
      try {
        const sourcePath = join(workDir, "source.mp4");
        const framesDir = join(workDir, "frames");
        await downloadStorageObject(recording.path, sourcePath);
        recordingDurationSec = await probeDurationSec(sourcePath);
        if (recordingDurationSec != null) {
          stoppedAt = new Date(startedAt.getTime() + recordingDurationSec * 1000);
        }
        frames = await extractFrames(sourcePath, framesDir, intervalSec);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`  [${sessionId.slice(0, 8)}] recording skip: ${msg.split("\n")[0]}`);
      }
    }

    if (frames.length > 0) {
      for (const frame of frames) {
        const frameTs = startedAt.getTime() + frame.offsetSec * 1000;
        const nearbyEvidence = evidenceSorted.filter(
          (e) => Math.abs(e.ts - frameTs) <= MATCH_MS,
        );
        process.stdout.write(
          `  [${sessionId.slice(0, 8)}] frame ${frame.index + 1}/${frames.length} @${frame.offsetSec}s... `,
        );
        const payload = await analyzeFrame(frame.jpeg);
        const result = await insertSnapshotBundle({
          sessionId,
          deviceId: camera.deviceId,
          sessionStartedAt: startedAt,
          offsetSec: frame.offsetSec,
          payload,
          evidenceItems: nearbyEvidence,
          matchedEvidencePaths,
        });
        snapshotCount += 1;
        incidentCount += result.incidents;
        maxOffsetSec = Math.max(maxOffsetSec, frame.offsetSec);
        console.log(`snap ${result.snapshotId.slice(0, 8)} inc ${result.incidents}`);
        await sleep(GEMINI_SLEEP_MS);
      }
    }

    const remainingEvidence = evidenceSorted.filter((e) => !matchedEvidencePaths.has(e.path));
    const clusters = clusterByTime(remainingEvidence, CLUSTER_MS);
    for (const cluster of clusters) {
      const rep = cluster.items[0];
      const offsetSec = Math.max(0, Math.round((rep.ts - startedAt.getTime()) / 1000));
      process.stdout.write(
        `  [${sessionId.slice(0, 8)}] evidence cluster @${offsetSec}s (${cluster.items.length} jpg)... `,
      );
      const signedUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: bucket, Key: rep.path }),
        { expiresIn: 3600 },
      );
      const jpeg = Buffer.from(await (await fetch(signedUrl)).arrayBuffer());
      const payload = await analyzeFrame(jpeg);
      const result = await insertSnapshotBundle({
        sessionId,
        deviceId: camera.deviceId,
        sessionStartedAt: startedAt,
        offsetSec,
        payload,
        evidenceItems: cluster.items,
        matchedEvidencePaths,
      });
      snapshotCount += 1;
      incidentCount += result.incidents;
      maxOffsetSec = Math.max(maxOffsetSec, offsetSec);
      console.log(`snap ${result.snapshotId.slice(0, 8)} inc ${result.incidents}`);
      await sleep(GEMINI_SLEEP_MS);
    }

    if (maxOffsetSec > 0) {
      const evidenceEnd = new Date(startedAt.getTime() + maxOffsetSec * 1000);
      if (evidenceEnd > stoppedAt) stoppedAt = evidenceEnd;
    }

    await upsertSession({
      sessionId,
      deviceId: camera.deviceId,
      cameraId: camera.cameraId,
      startedAt,
      stoppedAt,
      recordingPath: recording?.path ?? null,
      recordingBytes: recording?.bytes ?? null,
      frameCount: Math.max(snapshotCount, frames.length, evidenceSorted.length),
    });

    return {
      sessionId,
      status: "restored",
      deviceId: camera.deviceId,
      snapshots: snapshotCount,
      incidents: incidentCount,
      evidenceLinked: matchedEvidencePaths.size,
      evidenceTotal: evidenceSorted.length,
    };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

const progress = loadProgress();
const completed = new Set(progress.completedSessions ?? []);
const bundles = (await discoverOrphanSessions()).filter((b) =>
  sessionArg ? b.sessionId === sessionArg : true,
);

const targets = bundles.filter((b) => !completed.has(b.sessionId) || FORCE);

console.log(
  JSON.stringify(
    {
      mode: DRY ? "dry-run" : "apply",
      model: SKIP_GEMINI ? "skipped" : GEMINI_MODELS.join(", "),
      intervalSecDefault: INTERVAL_SEC,
      maxFrames: MAX_FRAMES,
      targets: targets.length,
      totalOrphanSessions: bundles.length,
    },
    null,
    2,
  ),
);

const results = [];
for (const bundle of targets) {
  console.log(`\n=== session ${bundle.sessionId} ===`);
  try {
    const result = await processSession(bundle);
    results.push(result);
    if (!DRY && result.status === "restored") {
      completed.add(bundle.sessionId);
      progress.completedSessions = [...completed];
      saveProgress(progress);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`failed: ${message}`);
    results.push({ sessionId: bundle.sessionId, status: "failed", error: message });
  }
}

await sql.end();
console.log("\n=== summary ===");
console.log(JSON.stringify(results, null, 2));
