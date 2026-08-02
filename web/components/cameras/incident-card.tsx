"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IncidentCardActions } from "@/components/cameras/incident-card-actions";
import { IncidentCardPreview } from "@/components/cameras/incident-card-preview";
import { IncidentCategoryBadges } from "@/components/cameras/incident-category-badges";
import { incidentAnalysisHint } from "@/lib/incidents-analysis-meta";
import { incidentDetectedCategories } from "@/lib/incidents-detected";
import type { IncidentRow } from "@/lib/incidents-types";
import { cn } from "@/lib/utils";

type IncidentCardProps = {
  incident: IncidentRow;
  displayNumber: number;
  actionBusy: boolean;
  onOpen: () => void;
  onRetry: () => void;
  onStop: () => void;
  onDelete: () => void;
};

export function IncidentCard({
  incident,
  displayNumber,
  actionBusy,
  onOpen,
  onRetry,
  onStop,
  onDelete,
}: IncidentCardProps) {
  const hits = incidentDetectedCategories(incident);
  const confidenceLabel =
    hits.length > 1
      ? hits.map((h) => `${Math.round(h.confidence)}%`).join(" · ")
      : incident.confidence != null
        ? `${Math.round(incident.confidence)}%`
        : "—";
  const analysisHint = incidentAnalysisHint(incident);
  const descriptionText =
    analysisHint ??
    incident.description ??
    "Описание появится после анализа";

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden py-0 transition-all hover:shadow-md">
      <IncidentCardPreview
        incidentId={incident.id}
        category={incident.category}
        processing={incident.analysis_status === "processing"}
      />
      <CardContent className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-tight">Инцидент #{displayNumber}</h3>
          <IncidentCategoryBadges incident={incident} />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Точность:{" "}
          <span className="font-semibold text-foreground">{confidenceLabel}</span>
        </p>
        <p
          className={cn(
            "line-clamp-3 min-h-[4.5rem] text-sm leading-relaxed",
            incident.analysis_status === "failed"
              ? "text-destructive"
              : "text-muted-foreground",
          )}
        >
          {descriptionText}
        </p>
      </CardContent>
      <CardFooter className="mt-auto shrink-0 flex-col gap-3 border-t border-border/60 bg-transparent px-4 pb-4 pt-3">
        <IncidentCardActions
          incident={incident}
          busy={actionBusy}
          onRetry={onRetry}
          onStop={onStop}
          onDelete={onDelete}
        />
        <Button
          type="button"
          variant="default"
          className="h-10 w-full"
          onClick={onOpen}
        >
          Описание
        </Button>
      </CardFooter>
    </Card>
  );
}
