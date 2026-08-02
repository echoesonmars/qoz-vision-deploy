"use client";

import type { LessonTimePhase } from "@/lib/lessons-types";
import { parseMmSs } from "@/lib/lesson-time";
import { cn } from "@/lib/utils";

type LessonPhaseBarProps = {
  phases: LessonTimePhase[];
  lessonDuration: string;
  currentSeconds: number;
  onSeek: (seconds: number) => void;
};

const PHASE_COLORS = [
  "bg-sky-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-fuchsia-600",
  "bg-rose-600",
  "bg-[var(--status-warning)]",
];

export function LessonPhaseBar({
  phases,
  lessonDuration,
  currentSeconds,
  onSeek,
}: LessonPhaseBarProps) {
  const total = Math.max(parseMmSs(lessonDuration), 1);

  return (
    <div className="space-y-2">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {phases.map((phase, index) => {
          const start = parseMmSs(phase.start_time);
          const end = parseMmSs(phase.end_time);
          const widthPct = Math.max(((end - start) / total) * 100, 2);
          return (
            <button
              key={`${phase.phase}-${phase.start_time}`}
              type="button"
              title={`${phase.phase}: ${phase.start_time}–${phase.end_time}`}
              onClick={() => onSeek(start)}
              className={cn(
                "h-full min-w-[4px] transition-opacity hover:opacity-90",
                PHASE_COLORS[index % PHASE_COLORS.length],
                currentSeconds >= start && currentSeconds <= end ? "ring-2 ring-white/80" : "",
              )}
              style={{ width: `${widthPct}%` }}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {phases.map((phase, index) => (
          <span key={`${phase.phase}-legend`} className="inline-flex items-center gap-1.5">
            <span
              className={cn("size-2 rounded-full", PHASE_COLORS[index % PHASE_COLORS.length])}
              aria-hidden
            />
            {phase.phase}
          </span>
        ))}
      </div>
    </div>
  );
}
