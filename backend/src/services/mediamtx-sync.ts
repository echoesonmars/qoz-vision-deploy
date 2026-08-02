import { getEnv } from "../config/env.js";
import { getDb } from "./db.js";
import {
  buildCameraPathName,
  buildRtspUrl,
  buildTranscodeCommand,
  type CameraRow,
} from "./camera-rtsp.js";

type PathConf = {
  source?: string;
  sourceOnDemand?: boolean;
  sourceOnDemandCloseAfter?: string;
  rtspTransport?: string;
  runOnDemand?: string;
  runOnDemandRestart?: boolean;
  runOnDemandStartTimeout?: string;
  runOnDemandCloseAfter?: string;
};

function apiBase(): string {
  return getEnv().MEDIAMTX_API_URL.replace(/\/$/, "");
}

async function mtxFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

export function pathConfForCamera(camera: CameraRow): PathConf {
  const rtspUrl = buildRtspUrl(camera);
  if (camera.transcode_to_h264) {
    return {
      runOnDemand: buildTranscodeCommand(rtspUrl),
      runOnDemandRestart: true,
      runOnDemandStartTimeout: "20s",
      runOnDemandCloseAfter: "30s",
    };
  }
  return {
    source: rtspUrl,
    sourceOnDemand: true,
    sourceOnDemandCloseAfter: "30s",
    rtspTransport: "tcp",
  };
}

export async function upsertMediaMtxPath(camera: CameraRow): Promise<void> {
  const name = buildCameraPathName(camera.equipment_id, camera.channel);
  const body = JSON.stringify(pathConfForCamera(camera));
  const replace = await mtxFetch(`/v3/config/paths/replace/${encodeURIComponent(name)}`, {
    method: "POST",
    body,
  });
  if (replace.ok) return;
  if (replace.status === 404) {
    const add = await mtxFetch(`/v3/config/paths/add/${encodeURIComponent(name)}`, {
      method: "POST",
      body,
    });
    if (!add.ok) {
      const text = await add.text();
      throw new Error(`MediaMTX add path failed (${add.status}): ${text}`);
    }
    return;
  }
  const text = await replace.text();
  throw new Error(`MediaMTX replace path failed (${replace.status}): ${text}`);
}

export async function deleteMediaMtxPath(equipmentId: string, channel: number): Promise<void> {
  const name = buildCameraPathName(equipmentId, channel);
  const res = await mtxFetch(`/v3/config/paths/delete/${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 404) {
    const text = await res.text();
    throw new Error(`MediaMTX delete path failed (${res.status}): ${text}`);
  }
}

export async function listEnabledCameras(): Promise<CameraRow[]> {
  const sql = getDb();
  return sql<CameraRow[]>`
    select *
    from public.cameras
    where is_enabled = true
    order by sort_index asc, channel asc
  `;
}

export async function syncAllFromDb(log?: { info: (o: unknown, msg?: string) => void }): Promise<void> {
  const cameras = await listEnabledCameras();
  for (const camera of cameras) {
    await upsertMediaMtxPath(camera);
  }
  log?.info({ count: cameras.length }, "MediaMTX paths synced from database");
}

export async function syncAllFromDbWithRetry(
  log?: { info: (o: unknown, msg?: string) => void; warn: (o: unknown, msg?: string) => void },
  attempts = 12,
): Promise<void> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      await syncAllFromDb(log);
      return;
    } catch (err) {
      lastError = err;
      log?.warn({ err, attempt: i + 1 }, "MediaMTX sync retry");
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
