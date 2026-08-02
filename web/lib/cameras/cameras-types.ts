export type CameraRecord = {
  id: string;
  index: number;
  uniqueChannel: number;
  isEnabled: boolean;
  address: string;
  name: string;
  deviceType: string;
  serialNo: string;
  equipmentId: string;
  organizationName: string;
};

export type CameraOrganizationFilter = "all" | string;

export type CamerasPageSize = 12 | 24 | 48;

export type CamerasFilterState = {
  search: string;
  organization: CameraOrganizationFilter;
  enabledOnly: boolean;
};
