"use client";

import { LiveEventTypeGrid } from "@/components/cameras/live-event-type-grid";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { useFleetSituations } from "@/lib/cameras/use-fleet-situations";
import { fleetHistoryPeriodLabel } from "@/lib/cameras/fleet-history-period";

export function EngagementFleetSituations() {
  const fleet = useFleetSituations();

  return (
    <section className="flex flex-col gap-3">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Типы ситуаций</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Сводка по камерам, live-сессиям и журналу инцидентов {fleetHistoryPeriodLabel(fleet.retentionDays)}.
          Нажмите тип, чтобы открыть полный список событий.
        </p>
      </div>
      {fleet.summaryError ? (
        <p className="text-destructive text-sm">{fleet.summaryError}</p>
      ) : null}
      {fleet.summaryLoading && fleet.stats.length === 0 ? (
        <AdmLoadingScreen variant="inline" message="Загрузка типов ситуаций…" />
      ) : (
        <LiveEventTypeGrid stats={fleet.stats} />
      )}
    </section>
  );
}
