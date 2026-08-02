import "server-only";

import { findCameraByDeviceIdFromDb } from "@/lib/cameras/cameras-db";
import type { CameraRecord } from "@/lib/cameras/cameras-types";

export async function findCameraByDeviceIdAsync(
  deviceId: string,
): Promise<CameraRecord | undefined> {
  return findCameraByDeviceIdFromDb(deviceId);
}
