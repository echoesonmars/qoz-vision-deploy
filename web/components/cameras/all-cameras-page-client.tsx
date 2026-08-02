"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AllCamerasGrid } from "@/components/cameras/all-cameras-grid";
import { LiveCameraPlayer } from "@/components/cameras/live-camera-player";
import { LiveCamerasPagination } from "@/components/cameras/live-cameras-pagination";
import { LiveCamerasToolbar } from "@/components/cameras/live-cameras-toolbar";
import { StatsSummary } from "@/components/cameras/stats-summary";
import { getPickerItemKey } from "@/components/cameras/hls-camera-tile";
import { getCameraOrganizations, getCameraStreamKey } from "@/lib/cameras/cameras-registry";
import { useCameras } from "@/lib/cameras/cameras-context";
import { filterCameras, paginateCameras } from "@/lib/cameras/cameras-filter";
import type { CameraRecord, CameraOrganizationFilter, CamerasFilterState, CamerasPageSize } from "@/lib/cameras/cameras-types";
import { useInfrastructureStatus } from "@/lib/cameras/use-infrastructure-status";
import { useLiveSessionMutation } from "@/lib/cameras/use-live-session-mutation";

export function AllCamerasPageClient() {
  const { cameras } = useCameras();
  const organizations = useMemo(() => getCameraOrganizations(cameras), [cameras]);
  const { api, refresh } = useInfrastructureStatus();
  const isMonitoringDevice = useCallback(
    (deviceId: string) => api?.byDeviceId[deviceId]?.status === "running",
    [api],
  );
  const { loadingDeviceId, error, toggle } = useLiveSessionMutation({
    onSuccess: refresh,
    isMonitoring: isMonitoringDevice,
  });
  const [search, setSearch] = useState("");
  const [organization, setOrganization] = useState<CameraOrganizationFilter>("all");
  const [pageSize, setPageSize] = useState<CamerasPageSize>(24);
  const [page, setPage] = useState(1);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const filters: CamerasFilterState = useMemo(
    () => ({
      search,
      organization,
      enabledOnly: true,
    }),
    [search, organization],
  );

  const filtered = useMemo(() => filterCameras(cameras, filters), [cameras, filters]);

  const paginated = useMemo(
    () => paginateCameras(filtered, page, pageSize),
    [filtered, page, pageSize],
  );

  const selectedCamera = useMemo((): CameraRecord | null => {
    if (!selectedKey) return null;
    return cameras.find((c) => getCameraStreamKey(c) === selectedKey) ?? null;
  }, [selectedKey, cameras]);

  const handleSelect = (camera: CameraRecord) => {
    setSelectedKey(getPickerItemKey(camera));
  };

  const handleToggle = useCallback(
    (camera: CameraRecord) => {
      void toggle(camera);
    },
    [toggle],
  );

  useEffect(() => {
    setPage(1);
  }, [search, organization, pageSize]);

  useEffect(() => {
    if (selectedKey && !filtered.some((c) => getCameraStreamKey(c) === selectedKey)) {
      setSelectedKey(null);
    }
  }, [filtered, selectedKey]);

  useEffect(() => {
    if (page > paginated.totalPages) {
      setPage(paginated.totalPages);
    }
  }, [page, paginated.totalPages]);

  return (
    <div className="flex flex-col gap-6">
      <StatsSummary />
      <LiveCamerasToolbar
        search={search}
        onSearchChange={setSearch}
        organization={organization}
        onOrganizationChange={setOrganization}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        organizations={organizations}
      />

      {selectedCamera ? (
        <section className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Выбранная камера
          </p>
          <LiveCameraPlayer camera={selectedCamera} />
        </section>
      ) : null}

      <p className="text-muted-foreground text-sm">
        {paginated.total === 0
          ? "Ничего не найдено"
          : `Показано ${paginated.rangeStart}–${paginated.rangeEnd} из ${paginated.total}`}
      </p>
      {paginated.items.length > 0 ? (
        <AllCamerasGrid
          cameras={paginated.items}
          selectedKey={selectedKey}
          onSelect={handleSelect}
          api={api}
          loadingDeviceId={loadingDeviceId}
          error={error}
          onToggle={handleToggle}
        />
      ) : null}
      <LiveCamerasPagination
        page={paginated.page}
        totalPages={paginated.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
