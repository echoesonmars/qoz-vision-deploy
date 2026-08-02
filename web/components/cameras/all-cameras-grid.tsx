"use client";

import { AllCamerasGridItem } from "@/components/cameras/all-cameras-grid-item";
import { getPickerItemKey } from "@/components/cameras/hls-camera-tile";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import type { CameraInfrastructureResponse } from "@/lib/cameras/infrastructure-types";
import type { LiveSessionMutationError } from "@/lib/cameras/use-live-session-mutation";

type AllCamerasGridProps = {
  cameras: CameraRecord[];
  selectedKey: string | null;
  onSelect: (camera: CameraRecord) => void;
  api: CameraInfrastructureResponse | null;
  loadingDeviceId: string | null;
  error: LiveSessionMutationError | null;
  onToggle: (camera: CameraRecord) => void;
};

export function AllCamerasGrid({
  cameras,
  selectedKey,
  onSelect,
  api,
  loadingDeviceId,
  error,
  onToggle,
}: AllCamerasGridProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cameras.map((camera) => {
        const key = getPickerItemKey(camera);
        const st = api?.byDeviceId[key];
        const monitoring = st?.status === "running";
        return (
          <AllCamerasGridItem
            key={key}
            camera={camera}
            selected={selectedKey === key}
            onSelect={onSelect}
            isMonitoring={monitoring}
            actionLoading={loadingDeviceId === key}
            error={error}
            onToggle={onToggle}
          />
        );
      })}
    </div>
  );
}
