"use client";

import { formatOffset } from "@/lib/cameras/format-live-time";
import type { LiveTimelineMarker } from "@/lib/cameras/live-session-events";
import { incidentCategoryLabel } from "@/lib/incident-categories";
import { liveCategoryMarkerTone } from "@/lib/incident-category-icons";
import { cn } from "@/lib/utils";

type LiveSessionTimelineTrackProps = {
  markers: LiveTimelineMarker[];
  durationSec: number;
  selectedMarkerId: string | null;
  onSelectMarker: (id: string) => void;
};

export function LiveSessionTimelineTrack({
  markers,
  durationSec,
  selectedMarkerId,
  onSelectMarker,
}: LiveSessionTimelineTrackProps) {
  const total = Math.max(durationSec, 1);

  return (
    <div className="relative h-10 w-full rounded-lg bg-muted/80">
      <div
        className="absolute top-1/2 right-2 left-2 h-0.5 -translate-y-1/2 rounded-full bg-border"
        aria-hidden
      />
      {markers.map((marker) => {
        const leftPct = Math.min(Math.max((marker.offsetSec / total) * 100, 0), 100);
        const active = selectedMarkerId === marker.id;
        return (
          <button
            key={marker.id}
            type="button"
            title={`${formatOffset(marker.offsetSec)} — ${incidentCategoryLabel(marker.category)}`}
            onClick={() => onSelectMarker(marker.id)}
            className={cn(
              "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm transition-transform hover:scale-125",
              liveCategoryMarkerTone(marker.category),
              active ? "scale-125 ring-2 ring-foreground/30" : "",
            )}
            style={{ left: `calc(${leftPct}% + 8px)` }}
          />
        );
      })}
    </div>
  );
}
