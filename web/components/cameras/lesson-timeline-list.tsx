"use client";

import type { LessonTimelineEvent } from "@/lib/lessons-types";
import { parseMmSs } from "@/lib/lesson-time";
import { timelineEventRowClass } from "@/lib/lesson-timeline-styles";
import { Badge } from "@/components/ui/badge";

type LessonTimelineListProps = {
  events: LessonTimelineEvent[];
  activeTimestamp: string | null;
  onSeek: (seconds: number) => void;
};

export function LessonTimelineList({
  events,
  activeTimestamp,
  onSeek,
}: LessonTimelineListProps) {
  const sorted = [...events].sort(
    (a, b) => parseMmSs(a.timestamp) - parseMmSs(b.timestamp),
  );

  return (
    <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
      {sorted.map((event) => (
        <li key={`${event.timestamp}-${event.event_type}-${event.description}`}>
          <button
            type="button"
            onClick={() => onSeek(parseMmSs(event.timestamp))}
            className={timelineEventRowClass(event, activeTimestamp === event.timestamp)}
          >
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold tabular-nums">
                {event.timestamp}
              </span>
              <Badge variant="secondary" className="text-[10px]">
                {event.event_type}
              </Badge>
            </div>
            <p className="text-muted-foreground">{event.description}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
