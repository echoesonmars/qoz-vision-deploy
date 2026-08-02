"use client";

import { LiveCameraPickerItem, getPickerItemKey } from "@/components/cameras/hls-camera-tile";
import type { CameraRecord } from "@/lib/cameras/cameras-types";

type LiveCamerasGridProps = {
  cameras: CameraRecord[];
  selectedKey: string | null;
  onSelect: (camera: CameraRecord) => void;
};

export function LiveCamerasGrid({ cameras, selectedKey, onSelect }: LiveCamerasGridProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cameras.map((camera) => {
        const key = getPickerItemKey(camera);
        return (
          <LiveCameraPickerItem
            key={key}
            camera={camera}
            selected={selectedKey === key}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}
