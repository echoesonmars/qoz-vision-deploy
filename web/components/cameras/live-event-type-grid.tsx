"use client";

import Link from "next/link";
import { incidentCategoryBadge } from "@/lib/incidents-category-meta";
import { incidentCategoryIcon } from "@/lib/incident-category-icons";
import { formatLiveClock, formatOffset } from "@/lib/cameras/format-live-time";
import type { LiveCategoryStats } from "@/lib/cameras/live-session-events";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import type { IncidentCategory } from "@/lib/incidents-types";
import { cn } from "@/lib/utils";

type LiveEventTypeGridProps = {
  stats: LiveCategoryStats[];
  selectedCategory?: IncidentCategory | null;
  onSelectCategory?: (category: IncidentCategory | null) => void;
};

function cardClassName(active: boolean) {
  return cn(
    "group/card relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-all duration-200",
    "border-border/70 bg-card shadow-sm ring-1 ring-border/40",
    "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 hover:ring-primary/25",
    active ? "border-primary ring-primary/30 bg-primary/5" : "",
  );
}

function EventTypeCardContent({
  row,
  active,
}: {
  row: LiveCategoryStats;
  active: boolean;
}) {
  const { label, className: badgeClass } = incidentCategoryBadge(row.category);
  const Icon = incidentCategoryIcon(row.category);

  return (
    <>
      <span
        className={cn(
          "absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20",
          "opacity-0 transition-all duration-200 group-hover/card:scale-105 group-hover/card:opacity-100",
          active ? "scale-105 opacity-100" : "",
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground pr-10">
        {label}
      </p>
      <p className="text-2xl font-semibold tabular-nums text-primary">{row.count}</p>
      <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
        <span className="font-mono tabular-nums">
          {row.lastOffsetSec != null ? `+${formatOffset(row.lastOffsetSec)}` : "—"}
        </span>
        <span className="font-mono tabular-nums">
          {row.lastAt ? formatLiveClock(row.lastAt) : "—"}
        </span>
      </div>
      <span className={cn("mt-1 w-fit rounded-md px-2 py-0.5 text-[10px]", badgeClass)}>
        {row.count > 0 ? "зафиксировано" : "ожидание"}
      </span>
    </>
  );
}

export function LiveEventTypeGrid({
  stats,
  selectedCategory = null,
  onSelectCategory,
}: LiveEventTypeGridProps) {
  const filterMode = onSelectCategory != null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {stats.map((row) => {
        const active = selectedCategory === row.category;

        if (filterMode) {
          return (
            <button
              key={row.category}
              type="button"
              onClick={() => onSelectCategory(active ? null : row.category)}
              className={cardClassName(active)}
            >
              <EventTypeCardContent row={row} active={active} />
            </button>
          );
        }

        return (
          <Link
            key={row.category}
            href={DIRECTOR_PATHS.camerasSituationCategory(row.category)}
            className={cardClassName(false)}
          >
            <EventTypeCardContent row={row} active={false} />
          </Link>
        );
      })}
    </div>
  );
}
