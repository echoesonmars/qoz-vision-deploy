"use client";

import { AdmLogo } from "@/components/brand/adm-logo";
import {
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCameraStreamKey } from "@/lib/cameras/cameras-registry";
import { useCameras } from "@/lib/cameras/cameras-context";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import type { InfrastructureFleetRow, InfrastructureSummary } from "@/lib/cameras/infrastructure-types";
import { cn } from "@/lib/utils";
import { MdSensors, MdVideocam, MdWifi } from "react-icons/md";

type LiveActiveCamerasBentoProps = {
  summary: InfrastructureSummary;
  fleet: InfrastructureFleetRow[];
  loading: boolean;
  selectedKey: string | null;
  onSelectCamera: (camera: CameraRecord) => void;
};

export function LiveActiveCamerasBento({
  summary,
  fleet,
  loading,
  selectedKey,
  onSelectCamera,
}: LiveActiveCamerasBentoProps) {
  const { cameras } = useCameras();
  const findCamera = (deviceId: string): CameraRecord | undefined =>
    cameras.find((c) => getCameraStreamKey(c) === deviceId);
  const active = fleet
    .filter((r) => r.monitoring || r.online)
    .sort((a, b) => {
      if (a.monitoring !== b.monitoring) return a.monitoring ? -1 : 1;
      return b.telemetry - a.telemetry;
    });

  const monitoring = fleet.filter((r) => r.monitoring);
  const preview = active.slice(0, 6);

  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className={summaryKicker}>Live · инфраструктура</p>
        <h2 className="text-lg font-semibold tracking-tight">Активные камеры</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12 lg:auto-rows-[minmax(88px,auto)]">
        <Card
          className={cn(
            checksCardInteractive,
            "md:col-span-3 lg:col-span-4 lg:row-span-2",
          )}
        >
          <CardHeader className="border-b border-border/60 bg-muted/30 pb-3">
            <p className={summaryKicker}>Сводка</p>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <AdmLogo size="xs" />
              <span>Сеть камер</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4">
            <p className="text-primary text-4xl font-semibold tabular-nums leading-none">
              {loading ? "…" : summary.camerasOnline}
              <span className="text-muted-foreground text-lg font-normal">
                /{loading ? "…" : summary.camerasEnabled}
              </span>
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {loading
                ? "Загрузка статусов…"
                : `${summary.camerasMonitoring} на серверном анализе · ${summary.networkDevicesPercent}% в сети`}
            </p>
            <div className="bg-muted/60 h-2 overflow-hidden rounded-full ring-1 ring-border/50">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{
                  width: loading ? "0%" : `${summary.networkDevicesPercent}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <BentoStat
          className="md:col-span-3 lg:col-span-2"
          icon={<MdSensors className="size-4" aria-hidden />}
          label="Анализ live"
          value={loading ? "…" : String(summary.camerasMonitoring)}
        />
        <BentoStat
          className="md:col-span-3 lg:col-span-2"
          icon={<MdWifi className="size-4" aria-hidden />}
          label="В сети"
          value={loading ? "…" : String(summary.networkOnline)}
        />
        <BentoStat
          className="md:col-span-3 lg:col-span-2"
          icon={<MdVideocam className="size-4" aria-hidden />}
          label="В реестре"
          value={loading ? "…" : String(summary.camerasTotal)}
        />

        {preview.length === 0 ? (
          <Card
            className={cn(
              checksCardInteractive,
              "flex items-center justify-center md:col-span-6 lg:col-span-8 lg:row-span-2",
            )}
          >
            <CardContent className="text-muted-foreground py-8 text-center text-sm">
              {loading
                ? "Загрузка…"
                : monitoring.length === 0
                  ? "Нет активных камер. Запустите «Отслеживать» в блоке ниже."
                  : "Нет камер в сети"}
            </CardContent>
          </Card>
        ) : (
          preview.map((row, idx) => {
            const camera = findCamera(row.id);
            const span =
              idx === 0
                ? "md:col-span-6 lg:col-span-4 lg:row-span-2"
                : idx === 1
                  ? "md:col-span-3 lg:col-span-4"
                  : "md:col-span-3 lg:col-span-2";
            return (
              <BentoCameraTile
                key={row.id}
                row={row}
                className={span}
                selected={selectedKey === row.id}
                onClick={() => {
                  if (camera) onSelectCamera(camera);
                }}
              />
            );
          })
        )}
      </div>
    </section>
  );
}

function BentoStat({
  className,
  icon,
  label,
  value,
}: {
  className?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className={cn(checksCardInteractive, className)}>
      <CardContent className="flex h-full flex-col justify-center gap-2 p-4">
        <span className="text-primary flex size-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
          {icon}
        </span>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

function BentoCameraTile({
  row,
  className,
  selected,
  onClick,
}: {
  row: InfrastructureFleetRow;
  className?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left",
        checksCardInteractive,
        "h-full min-h-[88px] rounded-xl border bg-card p-4 transition-all",
        selected
          ? "border-primary ring-2 ring-primary/35"
          : "border-border/70 ring-1 ring-border/40 hover:ring-primary/25",
        className,
      )}
    >
      <div className="flex h-full flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "flex size-2.5 shrink-0 rounded-full",
              row.monitoring ? "animate-pulse bg-primary" : "bg-primary/80",
            )}
            aria-hidden
          />
          {row.monitoring ? (
            <span className="text-primary text-[10px] font-semibold uppercase tracking-wide">
              Live
            </span>
          ) : null}
        </div>
        <div>
          <p className="line-clamp-2 text-sm font-semibold leading-snug">{row.name}</p>
          <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">{row.organization}</p>
          <p className="text-muted-foreground mt-2 text-xs tabular-nums">
            {row.telemetry > 0 ? `телеметрия ${row.telemetry}%` : row.ip}
          </p>
        </div>
      </div>
    </button>
  );
}
