export type CameraVendor = "dahua" | "hikvision" | "custom";
export type StreamProfile = "main" | "sub";

export type CameraRow = {
  id: string;
  name: string;
  organization_name: string;
  vendor: CameraVendor;
  nvr_address: string;
  nvr_port: number;
  username: string;
  password: string;
  channel: number;
  stream_profile: StreamProfile;
  transcode_to_h264: boolean;
  rtsp_url_override: string | null;
  device_type: string;
  serial_no: string;
  equipment_id: string;
  is_enabled: boolean;
  sort_index: number;
  created_at: string;
  updated_at: string;
};

export type CameraInput = {
  name: string;
  organizationName?: string;
  vendor: CameraVendor;
  nvrAddress: string;
  nvrPort?: number;
  username: string;
  password: string;
  channel: number;
  streamProfile?: StreamProfile;
  transcodeToH264?: boolean;
  rtspUrlOverride?: string | null;
  deviceType?: string;
  serialNo?: string;
  equipmentId: string;
  isEnabled?: boolean;
  sortIndex?: number;
};

export function buildCameraPathName(equipmentId: string, channel: number): string {
  return `camera_${equipmentId}_sub_${channel}`;
}

export function buildRtspUrl(camera: {
  vendor: CameraVendor;
  nvr_address: string;
  nvr_port: number;
  username: string;
  password: string;
  channel: number;
  stream_profile: StreamProfile;
  rtsp_url_override: string | null;
}): string {
  if (camera.rtsp_url_override?.trim()) {
    return camera.rtsp_url_override.trim();
  }
  const user = encodeURIComponent(camera.username);
  const password = encodeURIComponent(camera.password);
  const host = `${camera.nvr_address}:${camera.nvr_port}`;
  const credentials = `${user}:${password}`;

  if (camera.vendor === "dahua") {
    const subtype = camera.stream_profile === "main" ? 0 : 1;
    return `rtsp://${credentials}@${host}/cam/realmonitor?channel=${camera.channel}&subtype=${subtype}`;
  }
  if (camera.vendor === "hikvision") {
    const suffix = camera.stream_profile === "main" ? "01" : "02";
    return `rtsp://${credentials}@${host}/Streaming/Channels/${camera.channel}${suffix}`;
  }
  throw new Error("custom vendor requires rtsp_url_override");
}

export function buildTranscodeCommand(rtspUrl: string): string {
  return (
    "ffmpeg -nostdin -loglevel warning -rtsp_transport tcp -fflags nobuffer " +
    `-i ${rtspUrl} -an ` +
    "-c:v libx264 -preset ultrafast -tune zerolatency -profile:v baseline " +
    "-pix_fmt yuv420p -crf 26 -g 50 -sc_threshold 0 " +
    "-f rtsp -rtsp_transport tcp rtsp://127.0.0.1:$RTSP_PORT/$MTX_PATH"
  );
}

export function toCameraRecord(row: CameraRow) {
  return {
    id: row.id,
    index: row.sort_index,
    uniqueChannel: row.channel,
    isEnabled: row.is_enabled,
    address: row.nvr_address,
    name: row.name,
    deviceType: row.device_type,
    serialNo: row.serial_no,
    equipmentId: row.equipment_id,
    organizationName: row.organization_name,
    vendor: row.vendor,
    nvrPort: row.nvr_port,
    username: row.username,
    streamProfile: row.stream_profile,
    transcodeToH264: row.transcode_to_h264,
    rtspUrlOverride: row.rtsp_url_override,
  };
}
