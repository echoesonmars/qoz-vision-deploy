"use client";

import type { LiveMonitorSession } from "@/lib/cameras/live-analysis-types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";

type LiveSessionHistorySelectProps = {
  sessions: LiveMonitorSession[];
  selectedSessionId: string | null;
  onSelectSessionId: (id: string | null) => void;
};

function sessionLabel(s: LiveMonitorSession): string {
  const start = format(new Date(s.startedAt), "dd MMM HH:mm", { locale: ru });
  const status =
    s.status === "running"
      ? " · live"
      : s.recordingUploadStatus === "ready"
        ? " · запись"
        : "";
  return `${start}${status}`;
}

export function LiveSessionHistorySelect({
  sessions,
  selectedSessionId,
  onSelectSessionId,
}: LiveSessionHistorySelectProps) {
  if (sessions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelectSessionId(null)}
        className={cn(
          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
          selectedSessionId === null
            ? "border-primary bg-primary/10 text-primary"
            : "border-border/70 hover:border-primary/40",
        )}
      >
        Текущая
      </button>
      {sessions.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelectSessionId(s.id)}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
            selectedSessionId === s.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/70 hover:border-primary/40",
          )}
        >
          {sessionLabel(s)}
        </button>
      ))}
    </div>
  );
}
