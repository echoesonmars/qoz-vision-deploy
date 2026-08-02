import {
  findCameraByDeviceId,
} from "@/lib/cameras/resolve-engagement-id";
import { getCameraDisplayLabel } from "@/lib/cameras/cameras-registry";

export function getCameraLabelByDeviceId(deviceId: string): string {
  const camera = findCameraByDeviceId(deviceId);
  if (camera) return getCameraDisplayLabel(camera);
  return deviceId;
}

export function buildEngagementSessionHref(
  deviceId: string,
  sessionId: string,
): string {
  return `/dashboard/cameras/engagement/${encodeURIComponent(deviceId)}?sessionId=${encodeURIComponent(sessionId)}`;
}
