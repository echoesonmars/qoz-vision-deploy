"use client";

import Link from "next/link";
import { CameraHlsPreviewCard } from "@/components/cameras/camera-hls-preview-card";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { HlsPreviewSlotProvider } from "@/lib/cameras/hls-preview-slot-context";
import { getCameraStreamKey } from "@/lib/cameras/cameras-registry";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import type { CameraInfrastructureResponse } from "@/lib/cameras/infrastructure-types";
import { listRunningMonitoredCameras } from "@/lib/cameras/running-monitored-cameras";

type ActiveCamerasPreviewGridProps = {
  api: CameraInfrastructureResponse | null;
  loading: boolean;
  selectedKey?: string | null;
  onSelectCamera?: (camera: CameraRecord) => void;
  showEngagementLink?: boolean;
};

export function ActiveCamerasPreviewGrid({
  api,
  loading,
  selectedKey,
  onSelectCamera,
  showEngagementLink = false,
}: ActiveCamerasPreviewGridProps) {
  const cameras = listRunningMonitoredCameras(api);

  if (loading) {
    return <AdmLoadingScreen variant="inline" message="Загрузка активных камер…" />;
  }

  if (cameras.length === 0) {
    return (
      <p className="text-muted-foreground text-sm leading-relaxed">
        Нет камер на мониторинге. Включите «Отслеживать» в разделе{" "}
        <Link href="/dashboard/cameras/all" className="text-primary font-medium hover:underline">
          Все камеры
        </Link>
        .
      </p>
    );
  }

  return (
    <HlsPreviewSlotProvider>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cameras.map((camera) => {
        const key = getCameraStreamKey(camera);
        return (
          <CameraHlsPreviewCard
            key={key}
            camera={camera}
            selected={selectedKey === key}
            onSelect={onSelectCamera}
            engagementHref={
              showEngagementLink
                ? `/dashboard/cameras/engagement/${encodeURIComponent(key)}`
                : undefined
            }
          />
        );
      })}
    </div>
    </HlsPreviewSlotProvider>
  );
}
