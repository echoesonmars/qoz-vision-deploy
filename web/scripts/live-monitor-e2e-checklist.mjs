#!/usr/bin/env node
const base = process.env.BACKEND_URL?.replace(/\/$/, "") ?? "http://localhost:8080";
const secret = process.env.BACKEND_INTERNAL_SECRET;

const steps = [
  "1 камера 30 мин → snapshots + offsets в БД",
  "2 камеры параллельно → разные device_id в dashboard",
  "Stop → один mp4 upload, playback signed URL",
  "Инцидент → evidence_storage_path + превью",
  "Dashboard: один запрос /api/live/dashboard",
  "5–10 камер staging → fleet activeIngests ≤ MAX",
  "Export lesson → lesson pending → ready + phases",
  "Рестарт mid-session → resume или needsRestart banner",
];

console.log("Live E2E checklist (manual)\n");
console.log(`Backend: ${base}\n`);
for (const s of steps) console.log(`[ ] ${s}`);

if (secret) {
  try {
    const res = await fetch(`${base}/api/live/fleet`, {
      headers: { "X-Backend-Secret": secret },
    });
    const fleet = await res.json();
    console.log("\nFleet snapshot:", fleet);
    const health = await fetch(`${base}/health`);
    console.log("Health:", await health.json());
  } catch (e) {
    console.warn("Probe failed:", e.message);
  }
} else {
  console.log("\nSet BACKEND_URL + BACKEND_INTERNAL_SECRET to auto-probe fleet/health.");
}
