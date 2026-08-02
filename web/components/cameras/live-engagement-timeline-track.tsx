"use client";

import { formatOffset } from "@/lib/cameras/format-live-time";
import type { EngagementMarker } from "@/lib/cameras/live-engagement-markers";
import { buildEngagementTrackPoints } from "@/lib/cameras/live-engagement-markers";
import type { LiveAnalysisSnapshot } from "@/lib/cameras/live-analysis-types";
import { cn } from "@/lib/utils";

type LiveEngagementTimelineTrackProps = {
  snapshots: LiveAnalysisSnapshot[];
  engagementDrops: EngagementMarker[];
  durationSec: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function LiveEngagementTimelineTrack({
  snapshots,
  engagementDrops,
  durationSec,
  selectedId,
  onSelect,
}: LiveEngagementTimelineTrackProps) {
  const total = Math.max(durationSec, 1);
  const points = buildEngagementTrackPoints(snapshots);

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        Вовлечённость по снимкам
      </p>
      <div className="relative h-10 w-full rounded-lg bg-muted/80">
            <div
          className="absolute top-1/2 right-2 left-2 h-0.5 -translate-y-1/2 rounded-full bg-border"
          aria-hidden
        />
        {points.map((pt) => {
          const leftPct = Math.min(Math.max((pt.offsetSec / total) * 100, 0), 100);
          const isDrop = engagementDrops.some((d) => d.id === pt.id);
          return (
            <button
              key={pt.id}
              type="button"
              title={`${formatOffset(pt.offsetSec)} — ${pt.score}%`}
              onClick={() => onSelect(pt.id)}
              className={cn(
                "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border shadow-sm transition-transform hover:scale-125",
                isDrop
                  ? "border-[var(--status-warning)] bg-[var(--status-warning)]"
                  : "border-primary bg-primary",
                selectedId === pt.id ? "scale-125 ring-2 ring-foreground/30" : "",
              )}
              style={{ left: `calc(${leftPct}% + 8px)` }}
            />
          );
        })}
      </div>
    </div>
  );
}
