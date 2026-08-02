"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveTrackButton } from "@/components/cameras/live-track-button";
import { getCameraDisplayLabel, getCameraStreamKey, buildCameraHlsUrl } from "@/lib/cameras/cameras-registry";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import type { LiveSessionMutationError } from "@/lib/cameras/use-live-session-mutation";
import { cn } from "@/lib/utils";
import { MdVideocam } from "react-icons/md";

type AllCamerasGridItemProps = {
  camera: CameraRecord;
  selected: boolean;
  onSelect: (camera: CameraRecord) => void;
  isMonitoring: boolean;
  actionLoading: boolean;
  error: LiveSessionMutationError | null;
  onToggle: (camera: CameraRecord) => void;
};

export function AllCamerasGridItem({
  camera,
  selected,
  onSelect,
  isMonitoring,
  actionLoading,
  error,
  onToggle,
}: AllCamerasGridItemProps) {
  const deviceId = getCameraStreamKey(camera);
  const hlsUrl = buildCameraHlsUrl(camera);
  const org = camera.organizationName?.trim();
  const itemError = error?.deviceId === deviceId ? error.message : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(camera)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(camera);
        }
      }}
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
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
          <span className="flex flex-wrap items-center gap-2">
            <span className="block text-sm font-medium leading-snug">{getCameraDisplayLabel(camera)}</span>
            {isMonitoring ? (
              <Badge variant="default" className="text-[10px]">
                На мониторинге
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px]">
                Не отслеживается
              </Badge>
            )}
          </span>
          {org ? <span className="text-muted-foreground line-clamp-2 block text-xs">{org}</span> : null}
          <span className="text-muted-foreground block text-xs">
            {camera.address} · #{camera.index}
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap gap-2">
          <LiveTrackButton
            isMonitoring={isMonitoring}
            loading={actionLoading}
            disabled={!hlsUrl}
            onClick={() => onToggle(camera)}
          />
          {isMonitoring ? (
            <Button type="button" size="sm" variant="secondary" asChild>
              <Link href={`/dashboard/cameras/live?deviceId=${encodeURIComponent(deviceId)}`}>
                Прямой эфир
              </Link>
            </Button>
          ) : null}
        </div>
        {itemError ? <p className="text-destructive text-xs leading-snug">{itemError}</p> : null}
      </div>
    </div>
  );
}
