"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { CameraHlsPreviewCard } from "@/components/cameras/camera-hls-preview-card";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { HlsPreviewSlotProvider } from "@/lib/cameras/hls-preview-slot-context";
import { getCameraStreamKey } from "@/lib/cameras/cameras-registry";
import type { CameraInfrastructureResponse } from "@/lib/cameras/infrastructure-types";
import { listRunningMonitoredCameras } from "@/lib/cameras/running-monitored-cameras";

type EngagementLiveGridProps = {
  api: CameraInfrastructureResponse | null;
  loading: boolean;
};

export function EngagementLiveGrid({ api, loading }: EngagementLiveGridProps) {
  const router = useRouter();
  const cameras = useMemo(() => listRunningMonitoredCameras(api), [api]);

  if (loading) {
    return <AdmLoadingScreen variant="inline" message="Загрузка live-камер…" />;
  }

  if (cameras.length === 0) {
    return (
      <p className="text-muted-foreground text-sm leading-relaxed">
        Нет камер с включённым мониторингом. Запустите «Отслеживать» в разделе «Все камеры».
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
            onSelect={() => router.push(`/dashboard/cameras/engagement/${encodeURIComponent(key)}`)}
          />
        );
      })}
    </div>
    </HlsPreviewSlotProvider>
  );
}
