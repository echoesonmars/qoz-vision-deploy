import {
  getCameraDisplayLabel,
  getCameraStreamKey,
} from "@/lib/cameras/cameras-registry";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import type {
  CameraInfrastructureResponse,
  CameraInfraDeviceStatus,
  InfrastructureFleetRow,
  InfrastructureSummary,
} from "@/lib/cameras/infrastructure-types";

const GRID_PREVIEW_SLOTS = 45;

function statusForDevice(
  deviceId: string,
  byDeviceId: Record<string, CameraInfraDeviceStatus>,
): CameraInfraDeviceStatus | undefined {
  return byDeviceId[deviceId];
}

function isOnline(status: CameraInfraDeviceStatus | undefined): boolean {
  return Boolean(status?.online);
}

function isMonitoring(status: CameraInfraDeviceStatus | undefined): boolean {
  return status?.status === "running";
}

function mapCameraToRow(
  camera: CameraRecord,
  id: string,
  st: CameraInfraDeviceStatus | undefined,
): InfrastructureFleetRow {
  return {
    id,
    name: getCameraDisplayLabel(camera),
    kind: camera.deviceType?.trim() || "ADM",
    ip: camera.address?.trim() || "—",
    room: `к.${camera.uniqueChannel}`,
    organization: camera.organizationName?.trim() || "—",
    online: isOnline(st),
    monitoring: isMonitoring(st),
    telemetry: st?.telemetryPercent ?? 0,
    enabled: camera.isEnabled,
  };
}

export function buildInfrastructureFleet(
  api: CameraInfrastructureResponse | null,
  cameras: CameraRecord[],
): InfrastructureFleetRow[] {
  const byDeviceId = api?.byDeviceId ?? {};
  return cameras.filter((c) => c.isEnabled).map((camera) => {
    const id = getCameraStreamKey(camera);
    const st = statusForDevice(id, byDeviceId);
    return mapCameraToRow(camera, id, st);
  });
}

export function buildInfrastructureSummary(
  api: CameraInfrastructureResponse | null,
  cameras: CameraRecord[],
): InfrastructureSummary {
  const enabled = cameras.filter((c) => c.isEnabled);
  const byDeviceId = api?.byDeviceId ?? {};
  const fleet = enabled.map((camera) => {
    const id = getCameraStreamKey(camera);
    return { camera, id, st: statusForDevice(id, byDeviceId) };
  });

  const camerasOnline = fleet.filter((f) => isOnline(f.st)).length;
  const camerasMonitoring = fleet.filter((f) => isMonitoring(f.st)).length;
  const camerasTotal = cameras.length;
  const camerasEnabled = enabled.length;
  const networkTotal = camerasEnabled;
  const networkOnline = camerasOnline;
  const networkDevicesPercent =
    networkTotal > 0 ? Math.round((camerasMonitoring / networkTotal) * 100) : 0;

  const previewSource = [...fleet].sort((a, b) => {
    const ao = isOnline(a.st) ? 1 : 0;
    const bo = isOnline(b.st) ? 1 : 0;
    if (bo !== ao) return bo - ao;
    return a.camera.index - b.camera.index;
  });

  const gridPreview = previewSource.slice(0, GRID_PREVIEW_SLOTS).map((f) => ({
    online: isOnline(f.st),
    label: getCameraDisplayLabel(f.camera),
  }));

  return {
    camerasTotal,
    camerasEnabled,
    camerasOnline,
    camerasMonitoring,
    networkDevicesPercent,
    networkOnline,
    networkTotal,
    gridPreview,
    gridPreviewTotal: camerasEnabled,
  };
}

export function buildInfrastructureStatsFromSummary(summary: InfrastructureSummary) {
  const maintenance = Math.max(0, summary.camerasEnabled - summary.camerasOnline);
  return {
    total: summary.camerasEnabled,
    online: summary.camerasOnline,
    monitoring: summary.camerasMonitoring,
    maintenance,
    networkLoadPercent: summary.networkDevicesPercent,
  };
}
