export type CameraInfraDeviceStatus = {
  status: string;
  frameCount: number;
  lastFrameAt: string | null;
  online: boolean;
  telemetryPercent: number;
};

export type CameraInfrastructureResponse = {
  stats: {
    sessionsTracked: number;
    monitoring: number;
    online: number;
  };
  byDeviceId: Record<string, CameraInfraDeviceStatus>;
  activeSessions: {
    deviceId: string;
    status: string;
    frameCount: number;
    lastFrameAt: string | null;
    online: boolean;
    telemetryPercent: number;
  }[];
};

export type InfrastructureFleetRow = {
  id: string;
  name: string;
  kind: string;
  ip: string;
  room: string;
  organization: string;
  online: boolean;
  monitoring: boolean;
  telemetry: number;
  enabled: boolean;
};

export type InfrastructureSummary = {
  camerasTotal: number;
  camerasEnabled: number;
  camerasOnline: number;
  camerasMonitoring: number;
  networkDevicesPercent: number;
  networkOnline: number;
  networkTotal: number;
  gridPreview: { online: boolean; label: string }[];
  gridPreviewTotal: number;
};
