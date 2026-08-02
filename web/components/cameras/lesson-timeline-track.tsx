"use client";

import type { LessonTimelineEvent } from "@/lib/lessons-types";
import { parseMmSs } from "@/lib/lesson-time";
import { timelineEventTone } from "@/lib/lesson-timeline-styles";
import { cn } from "@/lib/utils";

type LessonTimelineTrackProps = {
  events: LessonTimelineEvent[];
  lessonDuration: string;
  currentSeconds: number;
  onSeek: (seconds: number) => void;
};

export function LessonTimelineTrack({
  events,
  lessonDuration,
  currentSeconds,
  onSeek,
}: LessonTimelineTrackProps) {
  const total = Math.max(parseMmSs(lessonDuration), 1);

  return (
    <div className="relative h-10 w-full rounded-lg bg-muted/80">
      <div
        className="absolute top-1/2 right-2 left-2 h-0.5 -translate-y-1/2 rounded-full bg-border"
        aria-hidden
      />
      {events.map((event) => {
        const at = parseMmSs(event.timestamp);
        const leftPct = Math.min(Math.max((at / total) * 100, 0), 100);
        return (
          <button
            key={`${event.timestamp}-${event.event_type}-${event.description.slice(0, 24)}`}
            type="button"
            title={`${event.timestamp} — ${event.event_type}`}
            onClick={() => onSeek(at)}
            className={cn(
              "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm transition-transform hover:scale-125",
              timelineEventTone(event.event_type),
              Math.abs(currentSeconds - at) < 3 ? "scale-125 ring-2 ring-foreground/30" : "",
            )}
            style={{ left: `calc(${leftPct}% + 8px)` }}
          />
        );
      })}
    </div>
  );
}
