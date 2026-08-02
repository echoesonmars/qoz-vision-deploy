import type { CameraRecord } from "@/lib/cameras/cameras-types";
import { getCameraStreamKey } from "@/lib/cameras/cameras-registry";

let camerasCache: CameraRecord[] = [];

export function setCamerasCache(cameras: CameraRecord[]): void {
  camerasCache = cameras;
}

export function getCamerasCache(): CameraRecord[] {
  return camerasCache;
}

export function findCameraInCache(deviceId: string): CameraRecord | undefined {
  return camerasCache.find((c) => getCameraStreamKey(c) === deviceId);
}
