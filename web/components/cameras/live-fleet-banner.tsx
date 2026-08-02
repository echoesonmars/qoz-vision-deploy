"use client";

import { useLiveFleetStatus } from "@/lib/cameras/use-live-fleet-status";
import { MdWarning } from "react-icons/md";

export function LiveFleetBanner() {
  const { fleet } = useLiveFleetStatus();

  if (!fleet) return null;

  const atLimit = fleet.activeIngests >= fleet.maxConcurrent;
  const geminiAlert = fleet.lastGemini429At != null;
  const failAlert = fleet.lastFailStreakAlertAt != null;

  if (!atLimit && !geminiAlert && !failAlert && fleet.runningSessions === 0) {
    return null;
  }

  return (
    <div className="space-y-2" role="status">
      <div className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3 text-sm">
        <p>
          Мониторинг:{" "}
          <span className="font-semibold tabular-nums">
            {fleet.activeIngests} / {fleet.maxConcurrent}
          </span>{" "}
          камер · интервал снимков ~{Math.max(0.05, fleet.captureIntervalMs / 1000).toFixed(fleet.captureIntervalMs < 5000 ? 2 : 0)} с
        </p>
        {atLimit ? (
          <p className="mt-1 text-[var(--status-warning)]">
            Достигнут лимит одновременных камер. Остановите другую сессию перед запуском новой.
          </p>
        ) : null}
      </div>
      {geminiAlert ? (
        <p className="flex items-start gap-2 rounded-xl border border-[var(--status-warning)]/40 bg-[var(--status-warning-muted)] px-4 py-3 text-sm text-[var(--status-warning)]">
          <MdWarning className="mt-0.5 size-4 shrink-0" aria-hidden />
          Сейчас анализ временно недоступен. Подождите и запустите мониторинг снова.
        </p>
      ) : null}
      {failAlert ? (
        <p className="px-1 text-sm text-muted-foreground">
          На одной из камер не удаётся получить снимки. Остановите и запустите мониторинг снова.
        </p>
      ) : null}
    </div>
  );
}
