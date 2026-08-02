"use client";

import Link from "next/link";
import { LiveCameraPlayer } from "@/components/cameras/live-camera-player";
import { LiveMonitorPanel } from "@/components/cameras/live-monitor-panel";
import { Button } from "@/components/ui/button";
import {
  getCameraDisplayLabel,
  getCameraStreamKey,
} from "@/lib/cameras/cameras-registry";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import { MdLiveTv, MdArrowBack } from "react-icons/md";

type LiveCameraDetailClientProps = {
  camera: CameraRecord;
  initialSessionId?: string | null;
};

export function LiveCameraDetailClient({
  camera,
  initialSessionId = null,
}: LiveCameraDetailClientProps) {
  const deviceId = getCameraStreamKey(camera);
  const org = camera.organizationName?.trim();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard/cameras/engagement?tab=live"
            className="text-muted-foreground inline-flex items-center gap-1 text-sm hover:text-foreground"
          >
            <MdArrowBack className="size-4" aria-hidden />
            К live-камерам
          </Link>
          <h1 className="text-xl font-semibold tracking-tight">{getCameraDisplayLabel(camera)}</h1>
          {org ? <p className="text-muted-foreground text-sm">{org}</p> : null}
          <p className="text-muted-foreground text-xs">
            {camera.address} · Live · {deviceId}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" asChild>
          <Link href={`/dashboard/cameras/live?deviceId=${encodeURIComponent(deviceId)}`}>
            <MdLiveTv className="size-4" aria-hidden />
            Прямой эфир
          </Link>
        </Button>
      </div>
      <section className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Прямой эфир</p>
        <LiveCameraPlayer camera={camera} videoOnly />
      </section>
      <LiveMonitorPanel camera={camera} initialSessionId={initialSessionId} />
    </div>
  );
}
