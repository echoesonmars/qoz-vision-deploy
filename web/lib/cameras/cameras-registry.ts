import type { CameraRecord } from "@/lib/cameras/cameras-types";

const DEFAULT_HLS_BASE = "/hls";

export function getCameraHlsBase(): string | null {
  const base = process.env.NEXT_PUBLIC_CAMERA_HLS_BASE?.trim();
  if (base) return base.replace(/\/$/, "");
  return DEFAULT_HLS_BASE;
}

const NVRLIKE_DEVICE = /^(DS-N316|XVR)/i;

export function buildCameraHlsPath(camera: CameraRecord): { pathId: string; sub: number } {
  if (NVRLIKE_DEVICE.test(camera.deviceType ?? "")) {
    return { pathId: camera.equipmentId, sub: camera.uniqueChannel };
  }
  return { pathId: camera.id, sub: 1 };
}

export function buildCameraHlsUrl(camera: CameraRecord): string | null {
  const base = getCameraHlsBase();
  if (!base) return null;
  const { pathId, sub } = buildCameraHlsPath(camera);
  return `${base}/camera_${pathId}_sub_${sub}/video1_stream.m3u8`;
}

export function getCameraStreamKey(camera: CameraRecord): string {
  return `${camera.id}-${camera.uniqueChannel}`;
}

export function getCameraDisplayLabel(camera: CameraRecord): string {
  const name = camera.name?.trim() || `Камера ${camera.index}`;
  return `${name} · к.${camera.uniqueChannel}`;
}

export function getCameraOrganizations(cameras: CameraRecord[]): string[] {
  const set = new Set<string>();
  for (const camera of cameras) {
    const org = camera.organizationName?.trim();
    if (org) set.add(org);
  }
  return [...set].sort((a, b) => a.localeCompare(b, "ru"));
}

export function getPublicBackendBase(): string {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!base) return "/backend";
  return base.replace(/\/$/, "");
}
