"use client";

import {
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useInfrastructureStatus } from "@/lib/cameras/use-infrastructure-status";

type StatMiniProps = {
  label: string;
  value: string;
  kicker?: string;
  hint?: string;
};

function StatMini({ label, value, kicker, hint }: StatMiniProps) {
  return (
    <Card className={cn(checksCardInteractive, "h-full")}>
      <CardHeader className={cn("border-b border-border/60 bg-muted/30 pb-3")}>
        {kicker ? <p className={summaryKicker}>{kicker}</p> : null}
        <CardTitle className="text-base font-semibold">{label}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-primary text-2xl font-semibold tabular-nums">{value}</p>
        {hint ? <p className="text-muted-foreground mt-1 text-xs leading-snug">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export function StatsSummary() {
  const { stats, loading, api } = useInfrastructureStatus();
  const dash = loading ? "…" : undefined;
  const monitoring = stats.monitoring;
  const recentWithoutMonitoring = Math.max(0, stats.online - stats.monitoring);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatMini
        kicker="Реестр"
        label="Включено в реестре"
        value={dash ?? String(stats.total)}
        hint="Камеры с isEnabled в конфиге, не только с «Отслеживать»"
      />
      <StatMini
        kicker="Сеть"
        label="На мониторинге"
        value={dash ?? String(monitoring)}
        hint={
          recentWithoutMonitoring > 0
            ? `+${recentWithoutMonitoring} без мониторинга, но кадры за 15 мин`
            : undefined
        }
      />
      <StatMini
        kicker="Сервер"
        label="Идёт анализ (live)"
        value={dash ?? String(api?.activeSessions.length ?? monitoring)}
      />
      <StatMini
        kicker="Шина"
        label="Доля на мониторинге"
        value={dash ?? `${stats.networkLoadPercent}%`}
        hint="От числа включённых в реестре"
      />
    </div>
  );
}
