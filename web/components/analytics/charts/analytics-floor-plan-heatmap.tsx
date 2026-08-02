"use client";

import { Badge } from "@/components/ui/badge";
import { admHeatmapCellClass } from "@/lib/brand/ui-classes";
import type { SafetyLocationRow } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";
import { MdPlace } from "react-icons/md";

const FLOOR_ZONES: {
  floor: string;
  zones: { locationId: string; label: string; gridClass: string }[];
}[] = [
  {
    floor: "Этаж 3",
    zones: [
      { locationId: "kovorking-3", label: "Коворкинг", gridClass: "col-span-2" },
      { locationId: "2-et-3-blok", label: "3 блок", gridClass: "col-span-2" },
    ],
  },
  {
    floor: "Этаж 2",
    zones: [
      { locationId: "sportzal-2", label: "Спортзал", gridClass: "col-span-2" },
      { locationId: "2-et-3-blok", label: "Коридор 2эт", gridClass: "col-span-2" },
    ],
  },
  {
    floor: "Этаж 1",
    zones: [
      { locationId: "akt-zal", label: "Актовый зал", gridClass: "col-span-4" },
    ],
  },
];

function intensityClass(incidents: number): string {
  if (incidents >= 120) return "bg-destructive/40 ring-destructive/60";
  if (incidents >= 60) return "bg-[var(--status-warning)]/35 ring-[var(--status-warning)]/50";
  if (incidents >= 30) return "bg-[var(--status-warning)]/25 ring-[var(--status-warning)]/40";
  return admHeatmapCellClass;
}

type AnalyticsFloorPlanHeatmapProps = {
  locations: SafetyLocationRow[];
  selectedLocationId?: string;
  onSelectLocation: (locationId: string) => void;
};

export function AnalyticsFloorPlanHeatmap({
  locations,
  selectedLocationId,
  onSelectLocation,
}: AnalyticsFloorPlanHeatmapProps) {
  const byId = Object.fromEntries(locations.map((l) => [l.locationId, l]));

  return (
    <div className="flex flex-col gap-6">
      {FLOOR_ZONES.map((floor) => (
        <div key={floor.floor} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <MdPlace className="size-4 text-primary" aria-hidden />
            <span className="text-sm font-medium">{floor.floor}</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {floor.zones.map((zone) => {
              const loc = byId[zone.locationId];
              const incidents = loc?.incidents ?? 0;
              const selected = selectedLocationId === zone.locationId;
              return (
                <button
                  key={`${floor.floor}-${zone.locationId}`}
                  type="button"
                  onClick={() => onSelectLocation(zone.locationId)}
                  className={cn(
                    "flex min-h-20 flex-col items-start justify-between rounded-xl p-4 text-left ring-2 transition-all",
                    intensityClass(incidents),
                    selected && "ring-primary",
                    zone.gridClass,
                    "hover:opacity-90 focus-visible:outline-none focus-visible:ring-primary",
                  )}
                >
                  <span className="text-sm font-medium">{zone.label}</span>
                  <Badge variant="secondary" className="tabular-nums">
                    {incidents} инц.
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
