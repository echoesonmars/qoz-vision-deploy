"use client";

import { useCallback, useMemo, useState } from "react";
import { LiveTrackButton } from "@/components/cameras/live-track-button";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/cameras/status-badge";
import { TelemetryProgress } from "@/components/cameras/telemetry-progress";
import {
  buildCameraHlsUrl,
  getCameraStreamKey,
} from "@/lib/cameras/cameras-registry";
import { useCameras } from "@/lib/cameras/cameras-context";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import { useInfrastructureStatus } from "@/lib/cameras/use-infrastructure-status";
import type { InfrastructureFleetRow } from "@/lib/cameras/infrastructure-types";
import type { LiveSessionMutationError } from "@/lib/cameras/use-live-session-mutation";
import { useLiveSessionMutation } from "@/lib/cameras/use-live-session-mutation";

const PAGE_SIZE = 50;

export function DeviceTable() {
  const { cameras: camerasList } = useCameras();
  void camerasList;
  const { api, fleet, loading, error, summary, refresh } = useInfrastructureStatus();
  const isMonitoringDevice = useCallback(
    (deviceId: string) => api?.byDeviceId[deviceId]?.status === "running",
    [api],
  );
  const {
    loadingDeviceId,
    error: mutationError,
    toggle,
  } = useLiveSessionMutation({
    onSuccess: refresh,
    isMonitoring: isMonitoringDevice,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return fleet;
    return fleet.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.ip.toLowerCase().includes(q) ||
        row.organization.toLowerCase().includes(q) ||
        row.kind.toLowerCase().includes(q),
    );
  }, [fleet, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const slice = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Инфраструктура</p>
        <CardTitle className="text-lg font-semibold">Оборудование</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {loading
            ? "Загрузка реестра камер и статусов мониторинга…"
            : `${summary.camerasEnabled} камер · ${summary.camerasOnline} онлайн · ${summary.camerasMonitoring} на серверном анализе`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        <Input
          placeholder="Поиск по имени, IP, организации…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-md"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Канал</TableHead>
              <TableHead>Организация</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Телеметрия</TableHead>
              <TableHead>Мониторинг</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slice.map((row) => (
              <DeviceRow
                key={row.id}
                row={row}
                actionLoading={loadingDeviceId === row.id}
                mutationError={mutationError}
                onToggle={toggle}
              />
            ))}
          </TableBody>
        </Table>
        <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-sm">
          <p>
            Показано {(pageSafe - 1) * PAGE_SIZE + 1}–
            {Math.min(pageSafe * PAGE_SIZE, filtered.length)} из {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-primary disabled:opacity-40"
              disabled={pageSafe <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Назад
            </button>
            <span className="tabular-nums">
              {pageSafe}/{totalPages}
            </span>
            <button
              type="button"
              className="text-primary disabled:opacity-40"
              disabled={pageSafe >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Далее
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type DeviceRowProps = {
  row: InfrastructureFleetRow;
  actionLoading: boolean;
  mutationError: LiveSessionMutationError | null;
  onToggle: (camera: CameraRecord) => void;
};

function DeviceRow({ row, actionLoading, mutationError, onToggle }: DeviceRowProps) {
  const { cameras } = useCameras();
  const camera = cameras.find((c) => getCameraStreamKey(c) === row.id);
  const hlsUrl = camera ? buildCameraHlsUrl(camera) : null;
  const itemError = mutationError?.deviceId === row.id ? mutationError.message : null;

  return (
    <TableRow>
      <TableCell className="max-w-48 font-medium">{row.name}</TableCell>
      <TableCell className="max-w-36 text-xs">{row.kind}</TableCell>
      <TableCell className="font-mono text-sm tabular-nums">{row.ip}</TableCell>
      <TableCell>{row.room}</TableCell>
      <TableCell className="max-w-40 truncate text-xs" title={row.organization}>
        {row.organization}
      </TableCell>
      <TableCell>
        <StatusBadge online={row.online} />
        {row.monitoring ? (
          <span className="text-primary mt-1 block text-[10px] font-medium uppercase">
            Live
          </span>
        ) : null}
      </TableCell>
      <TableCell className="min-w-36">
        <TelemetryProgress value={row.telemetry} />
      </TableCell>
      <TableCell className="min-w-32">
        {camera ? (
          <div className="flex flex-col gap-1">
            <LiveTrackButton
              isMonitoring={row.monitoring}
              loading={actionLoading}
              disabled={!hlsUrl}
              onClick={() => onToggle(camera)}
            />
            {itemError ? (
              <p className="text-destructive max-w-40 text-[10px] leading-snug">{itemError}</p>
            ) : null}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )}
      </TableCell>
    </TableRow>
  );
}
