"use client";

import { useRef } from "react";
import Link from "next/link";
import { LiveCanvasContainer } from "@/components/cameras/live-canvas-container";
import {
  buildCameraHlsUrl,
  getCameraDisplayLabel,
  getCameraStreamKey,
} from "@/lib/cameras/cameras-registry";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import { useHlsPlayback } from "@/lib/cameras/use-hls-playback";
import { useHlsPreviewSlot } from "@/lib/cameras/hls-preview-slot-context";
import { useInView } from "@/lib/cameras/use-in-view";
import { cn } from "@/lib/utils";
import { MdOpenInNew } from "react-icons/md";

type CameraHlsPreviewCardProps = {
  camera: CameraRecord;
  selected?: boolean;
  onSelect?: (camera: CameraRecord) => void;
  engagementHref?: string;
  className?: string;
};

export function CameraHlsPreviewCard({
  camera,
  selected,
  onSelect,
  engagementHref,
  className,
}: CameraHlsPreviewCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamKey = getCameraStreamKey(camera);
  const inView = useInView(rootRef, streamKey);
  const slotGranted = useHlsPreviewSlot(streamKey, inView);
  const hlsUrl = slotGranted ? buildCameraHlsUrl(camera) : null;
  const { status } = useHlsPlayback(videoRef, hlsUrl);
  const org = camera.organizationName?.trim();

  const footer = (
    <div className="space-y-1 p-3">
      <p className="line-clamp-2 text-sm font-semibold leading-snug">{getCameraDisplayLabel(camera)}</p>
      {org ? <p className="text-muted-foreground line-clamp-1 text-xs">{org}</p> : null}
      {engagementHref ? (
        <Link
          href={engagementHref}
          onClick={(e) => e.stopPropagation()}
          className="text-primary mt-2 inline-flex items-center gap-1 text-xs font-medium hover:underline"
        >
          Аналитика
          <MdOpenInNew className="size-3.5" aria-hidden />
        </Link>
      ) : null}
    </div>
  );

  const preview = (
    <div className="relative">
      <LiveCanvasContainer
        videoRef={videoRef}
        containerClassName="rounded-none border-0 ring-0 aspect-video"
      />
      {status === "loading" ? (
        <p className="text-muted-foreground absolute inset-x-0 bottom-2 text-center text-xs">Подключение…</p>
      ) : null}
      {status === "error" ? (
        <p className="text-destructive absolute inset-x-2 bottom-2 text-center text-xs">Поток недоступен</p>
      ) : null}
      <span className="absolute top-2 left-2 flex size-2.5 animate-pulse rounded-full bg-primary" aria-hidden />
    </div>
  );

  const cardClass = cn(
    "flex w-full flex-col overflow-hidden rounded-xl border text-left transition-all",
    selected
      ? "border-primary ring-2 ring-primary/35"
      : "border-border/70 ring-1 ring-border/40 hover:ring-primary/25",
    className,
  );

  if (onSelect) {
    return (
      <button type="button" onClick={() => onSelect(camera)} className={cn(cardClass, "cursor-pointer")}>
        <div ref={rootRef}>{preview}</div>
        {footer}
      </button>
    );
  }

  return (
    <div ref={rootRef} className={cardClass}>
      {preview}
      {footer}
    </div>
  );
}
