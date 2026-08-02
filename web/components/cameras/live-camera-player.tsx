"use client";

import { useRef } from "react";
import { LiveCanvasContainer } from "@/components/cameras/live-canvas-container";
import { buildCameraHlsUrl, getCameraDisplayLabel, getCameraStreamKey } from "@/lib/cameras/cameras-registry";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import { useHlsPlayback } from "@/lib/cameras/use-hls-playback";

type LiveCameraPlayerProps = {
  camera: CameraRecord | null;
  videoOnly?: boolean;
};

export function LiveCameraPlayer({ camera, videoOnly = false }: LiveCameraPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsUrl = camera ? buildCameraHlsUrl(camera) : null;
  const { status } = useHlsPlayback(videoRef, hlsUrl);
  const org = camera?.organizationName?.trim();

  if (!camera) {
    return null;
  }

  const streamKey = getCameraStreamKey(camera);

  const videoBlock = (
    <div className="relative">
      <LiveCanvasContainer
        key={streamKey}
        videoRef={videoRef}
        containerClassName={videoOnly ? "border-border/70 shadow-lg" : undefined}
      />
      {status === "loading" ? (
        <p className="text-muted-foreground absolute inset-x-0 bottom-3 text-center text-sm">Подключение…</p>
      ) : null}
      {status === "error" ? (
        <p className="text-destructive absolute inset-x-3 bottom-3 text-center text-sm">
          Поток недоступен
        </p>
      ) : null}
    </div>
  );

  if (videoOnly) {
    return videoBlock;
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-base font-semibold">{getCameraDisplayLabel(camera)}</p>
        {org ? <p className="text-muted-foreground text-sm">{org}</p> : null}
        <p className="text-muted-foreground text-xs">
          {camera.address} · #{camera.index}
        </p>
      </div>
      {videoBlock}
    </div>
  );
}
