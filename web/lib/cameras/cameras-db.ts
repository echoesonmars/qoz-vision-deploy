import { getDb } from "@/lib/db";
import type { CameraRecord } from "@/lib/cameras/cameras-types";

type CameraRow = {
  id: string;
  name: string;
  organization_name: string;
  nvr_address: string;
  channel: number;
  device_type: string;
  serial_no: string;
  equipment_id: string;
  is_enabled: boolean;
  sort_index: number;
};

export function mapCameraRow(row: CameraRow): CameraRecord {
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
  };
}

export async function listCamerasFromDb(): Promise<CameraRecord[]> {
  const sql = getDb();
  const rows = await sql<CameraRow[]>`
    select id, name, organization_name, nvr_address, channel, device_type,
           serial_no, equipment_id, is_enabled, sort_index
    from public.cameras
    order by sort_index asc, channel asc
  `;
  return rows.map(mapCameraRow);
}

export async function findCameraByDeviceIdFromDb(
  deviceId: string,
): Promise<CameraRecord | undefined> {
  const cameras = await listCamerasFromDb();
  return cameras.find((c) => `${c.id}-${c.uniqueChannel}` === deviceId);
}
