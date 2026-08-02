import {
  getIncidentCategoryMeta,
  incidentCategoryLabel,
} from "@/lib/incident-categories";
import type { IncidentCategory } from "@/lib/incidents-types";

export function incidentCategoryBadge(category: IncidentCategory): {
  label: string;
  className: string;
} {
  if (category === "pending") {
    return {
      label: "Анализ…",
      className: "border-none bg-primary/10 text-primary",
    };
  }
  const meta = getIncidentCategoryMeta(category);
  if (meta) {
    return { label: meta.label, className: meta.badgeClassName };
  }
  if (category === "intruder") {
    return {
      label: "Посторонний",
      className: "border-none bg-muted text-muted-foreground",
    };
  }
  return {
    label: incidentCategoryLabel(category),
    className: "border-none bg-muted text-muted-foreground",
  };
}
