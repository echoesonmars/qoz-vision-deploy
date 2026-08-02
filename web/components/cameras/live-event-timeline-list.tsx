"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatOffset } from "@/lib/cameras/format-live-time";
import type { LiveTimelineMarker } from "@/lib/cameras/live-session-events";
import { incidentCategoryBadge } from "@/lib/incidents-category-meta";
import { cn } from "@/lib/utils";

type LiveEventTimelineListProps = {
  markers: LiveTimelineMarker[];
  selectedMarkerId: string | null;
  onSelectMarker: (id: string) => void;
};

export function LiveEventTimelineList({
  markers,
  selectedMarkerId,
  onSelectMarker,
}: LiveEventTimelineListProps) {
  if (markers.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Событий в текущей сессии пока нет.
      </p>
    );
  }

  return (
    <ScrollArea className="h-72 pr-3">
      <ul className="flex flex-col gap-2">
        {markers.map((marker) => {
          const { label, className: badgeClass } = incidentCategoryBadge(marker.category);
          const active = selectedMarkerId === marker.id;
          return (
            <li key={marker.id}>
              <button
                type="button"
                onClick={() => onSelectMarker(marker.id)}
                className={cn(
                  "w-full rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/40",
                )}
              >
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold tabular-nums text-primary">
                    +{formatOffset(marker.offsetSec)}
                  </span>
                  <Badge className={cn("border-none text-[10px]", badgeClass)}>{label}</Badge>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {marker.confidence}
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">{marker.description}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
