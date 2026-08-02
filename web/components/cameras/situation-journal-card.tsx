"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IncidentCardActions } from "@/components/cameras/incident-card-actions";
import { IncidentCardPreview } from "@/components/cameras/incident-card-preview";
import type { FleetSituationJournalItem } from "@/lib/cameras/live-analysis-types";
import { incidentCategoryBadge } from "@/lib/incidents-category-meta";
import { incidentCategoryLabel } from "@/lib/incident-categories";
import type { IncidentCategory, IncidentRow } from "@/lib/incidents-types";
import { cn } from "@/lib/utils";

type SituationJournalCardProps = {
  item: FleetSituationJournalItem;
  incident: IncidentRow | null;
  actionBusy: boolean;
  onOpen: () => void;
  onDelete: () => void;
};

export function SituationJournalCard({
  item,
  incident,
  actionBusy,
  onOpen,
  onDelete,
}: SituationJournalCardProps) {
  const category = item.category as IncidentCategory;
  const { className: badgeClass } = incidentCategoryBadge(category);
  const confidenceLabel =
    item.confidence != null ? `${Math.round(item.confidence)}%` : "—";

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden py-0 transition-all hover:shadow-md">
      <button
        type="button"
        className="flex flex-1 cursor-pointer flex-col text-left"
        onClick={onOpen}
      >
        <IncidentCardPreview
          incidentId={item.incidentId}
          category={category}
          processing={incident?.analysis_status === "processing"}
        />
        <CardContent className="flex flex-1 flex-col gap-3 px-4 pt-4 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("border-none", badgeClass)}>
              {incidentCategoryLabel(category)}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Журнал
            </Badge>
            <span className="text-muted-foreground ml-auto text-xs tabular-nums">
              {confidenceLabel}
            </span>
          </div>
          <p className="text-foreground line-clamp-3 text-sm leading-relaxed">
            {item.description ?? "Запись из журнала инцидентов"}
          </p>
          <p className="text-muted-foreground text-xs">
            {item.cameraLabel ?? "Загруженная запись"} ·{" "}
            {new Date(item.createdAt).toLocaleString("ru-RU")}
          </p>
        </CardContent>
      </button>
      {incident ? (
        <CardFooter className="mt-auto flex-col gap-3 border-t border-border/60 px-4 pb-4 pt-3">
          <IncidentCardActions
            incident={incident}
            busy={actionBusy}
            onDelete={onDelete}
          />
          <Button type="button" variant="secondary" className="h-10 w-full" onClick={onOpen}>
            Описание
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
