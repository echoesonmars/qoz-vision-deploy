"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  metricFeatureCardClass,
  metricFeatureChartPanelClass,
  metricFeatureContentClass,
  MetricFeatureHeader,
} from "@/components/dashboard/metrics/metric-feature-shell";
import { useInfrastructureStatus } from "@/lib/cameras/use-infrastructure-status";
import { cn } from "@/lib/utils";
import { MdOutlineVideoLibrary, MdWifi } from "react-icons/md";

const GRID_COLS = 9;
const GRID_ROWS = 5;
const GRID_SLOTS = GRID_COLS * GRID_ROWS;

export function MetricInfrastructureCard() {
  const { summary, loading, error } = useInfrastructureStatus();

  const dots = Array.from({ length: GRID_SLOTS }, (_, i) => {
    const cell = summary.gridPreview[i];
    if (cell) return { online: cell.online, key: `cam-${i}` };
    return { online: false, key: `empty-${i}` };
  });

  const previewShown = Math.min(summary.gridPreview.length, GRID_SLOTS);
  const onlineLabel = loading
    ? "…"
    : `${summary.camerasOnline}/${summary.camerasEnabled}`;

  return (
    <Card className={metricFeatureCardClass}>
      <MetricFeatureHeader
        icon={<MdOutlineVideoLibrary className="size-4" aria-hidden />}
        kicker="Инфраструктура"
        title={
          <span className="tabular-nums">
            Активная инфраструктура · {onlineLabel} камер
          </span>
        }
        description={
          summary.camerasMonitoring > 0
            ? `Камеры из реестра · ${summary.camerasMonitoring} на серверном мониторинге`
            : "Камеры классов и сеть устройств ADM"
        }
      />
      <CardContent className={metricFeatureContentClass}>
        {error ? <p className="text-destructive mb-2 text-xs">{error}</p> : null}
        <Box
          className={cn(metricFeatureChartPanelClass, "gap-3")}
          role="img"
          aria-label={`${summary.camerasOnline} камер онлайн из ${summary.camerasEnabled}`}
        >
          <div className="flex shrink-0 items-center justify-between gap-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Карта камер
              {summary.gridPreviewTotal > GRID_SLOTS
                ? ` · превью ${previewShown} из ${summary.gridPreviewTotal}`
                : null}
            </p>
            <Box className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="bg-primary size-2.5 rounded-full shadow-sm shadow-primary/30" />
                онлайн
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
                офлайн
              </span>
            </Box>
          </div>

          <div
            className="grid min-h-0 flex-1 gap-2"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`,
            }}
          >
            {dots.map((dot) => (
              <span
                key={dot.key}
                className={cn(
                  "block h-full w-full min-h-5 rounded-md transition-colors",
                  dot.online
                    ? "bg-primary shadow-sm shadow-primary/30 ring-1 ring-primary/35"
                    : "bg-muted-foreground/25 ring-1 ring-border/50",
                )}
              />
            ))}
          </div>

          <div className="flex shrink-0 flex-col gap-2 border-t border-border/40 pt-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <MdWifi className="text-primary size-4" aria-hidden />
                Сеть и устройства
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {loading ? "…" : `${summary.networkDevicesPercent}%`}
              </span>
            </div>
            <div className="bg-muted/60 flex h-3 overflow-hidden rounded-full ring-1 ring-border/50">
              <Box
                className="bg-[linear-gradient(90deg,var(--primary),color-mix(in_oklch,var(--primary)_70%,white))] h-full transition-all"
                style={{
                  width: loading ? "0%" : `${summary.networkDevicesPercent}%`,
                }}
              />
            </div>
            <p className="text-muted-foreground text-xs tabular-nums">
              {loading
                ? "Загрузка…"
                : `${summary.networkOnline} из ${summary.networkTotal} камер в сети · всего в реестре ${summary.camerasTotal}`}
            </p>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
}

function Box({
  className,
  children,
  style,
  role,
  "aria-label": ariaLabel,
}: {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  role?: string;
  "aria-label"?: string;
}) {
  return (
    <div className={className} style={style} role={role} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
