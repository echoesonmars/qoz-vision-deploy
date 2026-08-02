"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LiveIncidentMomentCard } from "@/components/cameras/live-incident-moment-card";
import { checksCardHeader, checksCardInteractive, summaryKicker } from "@/components/dashboard/summary-card-shell";
import { normalizeLiveIncidentType } from "@/lib/cameras/live-incident-normalize";
import type { LiveIncidentMoment } from "@/lib/cameras/live-analysis-types";
import { incidentCategoryLabel } from "@/lib/incident-categories";
import type { IncidentCategory } from "@/lib/incidents-types";
import { MdWarning } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type LiveIncidentMomentsProps = {
  incidents: LiveIncidentMoment[];
  filterCategory?: IncidentCategory | null;
  highlightId?: string | null;
};

export function LiveIncidentMoments({
  incidents,
  filterCategory = null,
  highlightId = null,
}: LiveIncidentMomentsProps) {
  const filtered = useMemo(() => {
    if (!filterCategory) return incidents;
    return incidents.filter(
      (row) => normalizeLiveIncidentType(row.type) === filterCategory,
    );
  }, [incidents, filterCategory]);

  return (
    <Card className={cn(checksCardInteractive, "flex min-h-0 flex-col")}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdWarning className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Инциденты
        </p>
        <CardTitle className="text-lg font-semibold">Моменты и отрывки</CardTitle>
        <CardDescription>
          {filterCategory
            ? `Фильтр: ${incidentCategoryLabel(filterCategory)}`
            : "Зафиксированные события по снимкам анализа"}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 pt-0">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {filterCategory
              ? "Нет событий этого типа в сессии."
              : "Инцидентов в текущей сессии не зафиксировано."}
          </p>
        ) : (
          <ScrollArea className="h-72 pr-3">
            <ul className="flex flex-col gap-3">
              {filtered.map((row) => (
                <LiveIncidentMomentCard
                  key={row.id}
                  row={row}
                  active={highlightId === row.id}
                />
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
