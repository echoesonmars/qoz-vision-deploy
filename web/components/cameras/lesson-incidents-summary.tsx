"use client";

import type { LessonIncidentSummary } from "@/lib/lessons-types";
import { cn } from "@/lib/utils";

type LessonIncidentsSummaryProps = {
  items: LessonIncidentSummary[];
};

function severityClass(severity: string): string {
  if (severity === "High") return "border-destructive/40 bg-destructive/5";
  if (severity === "Medium") return "border-[var(--status-warning)]/40 bg-[var(--status-warning)]/5";
  return "border-border/70 bg-muted/30";
}

export function LessonIncidentsSummary({ items }: LessonIncidentsSummaryProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Явных инцидентов на уроке не зафиксировано.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div
          key={`${item.type}-${item.count}`}
          className={cn("rounded-xl border p-4", severityClass(item.severity))}
        >
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold">{item.type}</h4>
            <span className="text-xs text-muted-foreground">
              ×{item.count} · {item.severity}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
