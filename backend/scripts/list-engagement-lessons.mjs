import postgres from "postgres";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) throw new Error("DATABASE_URL missing");
const sql = postgres(url, { max: 1, prepare: false, ssl: "require" });

function parseMmSs(value) {
  if (!value || typeof value !== "string") return null;
  const m = value.trim().match(/^(\d+):(\d{2})$/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

function formatHms(totalSec) {
  const sec = Math.round(totalSec);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function durationFromAnalysis(analysis) {
  if (!analysis || typeof analysis !== "object") return { label: null, sec: null, source: null };
  const overview = analysis.lesson_overview;
  if (overview && typeof overview.duration === "string") {
    const sec = parseMmSs(overview.duration);
    if (sec != null) {
      return { label: overview.duration, sec, source: "analysis.duration" };
    }
  }
  const timeline = Array.isArray(analysis.timeline) ? analysis.timeline : [];
  let maxSec = 0;
  for (const ev of timeline) {
    if (!ev || typeof ev.timestamp !== "string") continue;
    const sec = parseMmSs(ev.timestamp);
    if (sec != null && sec > maxSec) maxSec = sec;
  }
  if (maxSec > 0) {
    return { label: formatHms(maxSec), sec: maxSec, source: "analysis.timeline" };
  }
  return { label: null, sec: null, source: null };
}

const rows = await sql`
  select
    l.id,
    l.title,
    l.status,
    l.storage_path,
    l.created_at,
    l.source_live_session_id,
    l.analysis
  from public.lesson_analyses l
  order by l.created_at desc
`;

const items = rows.map((row) => {
  const analysis =
    row.analysis && typeof row.analysis === "object"
      ? row.analysis
      : typeof row.analysis === "string"
        ? (() => {
            try {
              return JSON.parse(row.analysis);
            } catch {
              return null;
            }
          })()
        : null;
  const dur = durationFromAnalysis(analysis);
  const isLive =
    Boolean(row.source_live_session_id) ||
    (typeof row.title === "string" && row.title.startsWith("Live ·"));
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    isLiveArchive: isLive,
    created_at: row.created_at,
    duration: dur.label,
    durationSec: dur.sec,
    durationSource: dur.source,
    hasAnalysis: Boolean(analysis),
  };
});

const withDuration = items.filter((i) => i.durationSec != null);
const withoutDuration = items.filter((i) => i.durationSec == null);
const totalSec = withDuration.reduce((sum, i) => sum + (i.durationSec ?? 0), 0);

console.log(
  JSON.stringify(
    {
      count: items.length,
      liveArchives: items.filter((i) => i.isLiveArchive).length,
      uploadedLessons: items.filter((i) => !i.isLiveArchive).length,
      withDurationSec: withDuration.length,
      withoutDurationSec: withoutDuration.length,
      totalDuration: formatHms(totalSec),
      totalDurationSec: totalSec,
      avgDurationSec: withDuration.length ? Math.round(totalSec / withDuration.length) : 0,
      items,
    },
    null,
    2,
  ),
);

await sql.end();
