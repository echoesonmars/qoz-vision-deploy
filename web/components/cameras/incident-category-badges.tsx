"use client";

import { Badge } from "@/components/ui/badge";
import { incidentAnalysisStatusBadge } from "@/lib/incidents-analysis-meta";
import { incidentCategoryBadge } from "@/lib/incidents-category-meta";
import { incidentDetectedCategories } from "@/lib/incidents-detected";
import type { IncidentRow } from "@/lib/incidents-types";
import { cn } from "@/lib/utils";

type IncidentCategoryBadgesProps = {
  incident: IncidentRow;
  className?: string;
};

export function IncidentCategoryBadges({ incident, className }: IncidentCategoryBadgesProps) {
  const statusBadge = incidentAnalysisStatusBadge(incident);
  const hits = incidentDetectedCategories(incident);

  if (statusBadge && incident.category === "pending") {
    return (
      <Badge className={cn("shrink-0 font-medium", statusBadge.className, className)}>
        {statusBadge.label}
      </Badge>
    );
  }

  if (hits.length === 0) {
    const { label, className: badgeClassName } = incidentCategoryBadge(incident.category);
    return (
      <Badge className={cn("shrink-0 font-medium", badgeClassName, className)}>{label}</Badge>
    );
  }

  return (
    <div className={cn("flex max-w-[65%] flex-wrap justify-end gap-1.5", className)}>
      {hits.map((hit) => {
        const { label, className: badgeClassName } = incidentCategoryBadge(hit.category);
        return (
          <Badge
            key={hit.category}
            className={cn("shrink-0 font-medium", badgeClassName)}
            title={`${label}: ${Math.round(hit.confidence)}%`}
          >
            {label}
          </Badge>
        );
      })}
    </div>
  );
}
