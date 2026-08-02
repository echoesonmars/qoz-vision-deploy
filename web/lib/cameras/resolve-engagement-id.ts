import { getCameraStreamKey } from "@/lib/cameras/cameras-registry";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import { findCameraInCache } from "@/lib/cameras/cameras-cache";

export function findCameraByDeviceIdInList(
  cameras: CameraRecord[],
  deviceId: string,
): CameraRecord | undefined {
  return cameras.find((c) => getCameraStreamKey(c) === deviceId);
}

export function findCameraByDeviceId(deviceId: string): CameraRecord | undefined {
  return findCameraInCache(deviceId);
}

export function resolveEngagementDetailKind(id: string): "live" | "lesson" {
  if (findCameraByDeviceId(id)) return "live";
  return "lesson";
}
