"use client";

import { LiveTrackButton } from "@/components/cameras/live-track-button";
import { formatSessionStarted } from "@/lib/cameras/format-live-time";
import type { LiveMonitorSession } from "@/lib/cameras/live-analysis-types";
import { MdSensors } from "react-icons/md";

type LiveMonitorControlsProps = {
  session: LiveMonitorSession | null;
  isMonitoring: boolean;
  actionLoading: boolean;
  disabled: boolean;
  error?: string | null;
  onStart: () => void;
  onStop: () => void;
};

export function LiveMonitorControls({
  session,
  isMonitoring,
  actionLoading,
  disabled,
  error,
  onStart,
  onStop,
}: LiveMonitorControlsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex size-2.5 rounded-full ${isMonitoring ? "animate-pulse bg-primary" : "bg-muted-foreground/40"}`}
            aria-hidden
          />
          <p className="text-sm font-medium text-foreground">
            {isMonitoring ? "Мониторинг на сервере" : "Мониторинг выключен"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LiveTrackButton
            isMonitoring={isMonitoring}
            loading={actionLoading}
            disabled={disabled}
            onClick={isMonitoring ? onStop : onStart}
          />
        </div>
      </div>
      {error ? <p className="text-destructive text-xs leading-snug">{error}</p> : null}
      {session ? (
        <div className="text-muted-foreground space-y-1 text-xs leading-relaxed">
          <p className="flex items-center gap-1.5">
            <MdSensors className="text-primary size-3.5 shrink-0" aria-hidden />
            Снимков:{" "}
            <span className="text-foreground font-medium tabular-nums">{session.frameCount}</span>
            {session.lastFrameAt ? (
              <>
                {" "}
                · обновлено{" "}
                <span className="text-foreground tabular-nums">
                  {formatSessionStarted(session.lastFrameAt)}
                </span>
              </>
            ) : null}
          </p>
          {session.startedAt ? <p>Сессия с {formatSessionStarted(session.startedAt)}</p> : null}
          {session.needsRestart ? (
            <p className="text-destructive">Сервер перезапускался — нажмите «Отслеживать» снова.</p>
          ) : null}
          {isMonitoring && session.frameCount === 0 ? (
            <p className="text-muted-foreground">Ожидание первого снимка…</p>
          ) : null}
          <p>
            {isMonitoring
              ? "Вкладку можно закрыть — обработка продолжается на сервере."
              : "После запуска вкладку можно закрыть до нажатия «Остановить»."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
