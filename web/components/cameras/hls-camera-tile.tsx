"use client";

import { getCameraDisplayLabel, getCameraStreamKey } from "@/lib/cameras/cameras-registry";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import { cn } from "@/lib/utils";
import { MdVideocam } from "react-icons/md";

type LiveCameraPickerItemProps = {
  camera: CameraRecord;
  selected: boolean;
  onSelect: (camera: CameraRecord) => void;
};

export function LiveCameraPickerItem({ camera, selected, onSelect }: LiveCameraPickerItemProps) {
  const org = camera.organizationName?.trim();

  return (
    <button
      type="button"
      onClick={() => onSelect(camera)}
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border px-3 py-3 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
          : "border-border/60 bg-card ring-1 ring-border/40 hover:border-border hover:bg-muted/40",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
            selected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          <MdVideocam className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1 space-y-1">
          <span className="block text-sm font-medium leading-snug">{getCameraDisplayLabel(camera)}</span>
          {org ? <span className="text-muted-foreground line-clamp-2 block text-xs">{org}</span> : null}
          <span className="text-muted-foreground block text-xs">
            {camera.address} · #{camera.index}
          </span>
        </span>
      </div>
      <span className="text-muted-foreground text-xs">
        {selected ? "Смотреть эфир" : "Нажмите для просмотра"}
      </span>
    </button>
  );
}

export function getPickerItemKey(camera: CameraRecord): string {
  return getCameraStreamKey(camera);
}
