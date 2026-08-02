"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ActiveCamerasPreviewGrid } from "@/components/cameras/active-cameras-preview-grid";
import { LiveCameraPlayer } from "@/components/cameras/live-camera-player";
import { getCameraHlsBase, getCameraStreamKey } from "@/lib/cameras/cameras-registry";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import { listRunningMonitoredCameras } from "@/lib/cameras/running-monitored-cameras";
import { useInfrastructureStatus } from "@/lib/cameras/use-infrastructure-status";

export function LiveStreamPageClient() {
  const hlsBase = getCameraHlsBase();
  const { api, loading } = useInfrastructureStatus();
  const searchParams = useSearchParams();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const activeList = useMemo(() => listRunningMonitoredCameras(api), [api]);

  const selectedCamera = useMemo((): CameraRecord | null => {
    if (!selectedKey) return null;
    return activeList.find((c) => getCameraStreamKey(c) === selectedKey) ?? null;
  }, [activeList, selectedKey]);

  useEffect(() => {
    const deviceId = searchParams.get("deviceId");
    if (!deviceId) return;
    if (activeList.some((c) => getCameraStreamKey(c) === deviceId)) {
      setSelectedKey(deviceId);
    }
  }, [searchParams, activeList]);

  useEffect(() => {
    if (selectedKey && !activeList.some((c) => getCameraStreamKey(c) === selectedKey)) {
      setSelectedKey(activeList[0] ? getCameraStreamKey(activeList[0]) : null);
    }
  }, [activeList, selectedKey]);

  if (!hlsBase) {
    return (
      <p className="text-muted-foreground text-sm">Не задан базовый URL HLS (NEXT_PUBLIC_CAMERA_HLS_BASE).</p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Live</p>
        <h2 className="text-lg font-semibold tracking-tight">Прямой эфир</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Только камеры с включённым отслеживанием. Запустите мониторинг в{" "}
          <Link href="/dashboard/cameras/all" className="text-primary font-medium hover:underline">
            Все камеры
          </Link>
          .
        </p>
      </div>

      <ActiveCamerasPreviewGrid
        api={api}
        loading={loading}
        selectedKey={selectedKey}
        onSelectCamera={(c) => setSelectedKey(getCameraStreamKey(c))}
        showEngagementLink
      />

      {selectedCamera ? <LiveCameraPlayer camera={selectedCamera} /> : null}
    </div>
  );
}
