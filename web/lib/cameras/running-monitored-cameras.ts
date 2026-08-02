import { getCameraStreamKey } from "@/lib/cameras/cameras-registry";
import { getCamerasCache } from "@/lib/cameras/cameras-cache";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import type { CameraInfrastructureResponse } from "@/lib/cameras/infrastructure-types";

export function listRunningMonitoredCameras(
  api: CameraInfrastructureResponse | null,
  cameras?: CameraRecord[],
): CameraRecord[] {
  if (!api) return [];
  const source = cameras ?? getCamerasCache();
  const runningIds = new Set(
    api.activeSessions.filter((s) => s.status === "running").map((s) => s.deviceId),
  );
  return source.filter((c) => c.isEnabled && runningIds.has(getCameraStreamKey(c)));
}

export function getRunningMonitoredCameras(
  cameras: CameraRecord[],
  api: CameraInfrastructureResponse | null,
): CameraRecord[] {
  return listRunningMonitoredCameras(api, cameras);
}
