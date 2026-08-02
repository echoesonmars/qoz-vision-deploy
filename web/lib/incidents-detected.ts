import type { IncidentCategory, IncidentCategoryHit, IncidentRow } from "@/lib/incidents-types";

export function incidentDetectedCategories(row: IncidentRow): IncidentCategoryHit[] {
  if (row.detected_categories && row.detected_categories.length > 0) {
    return row.detected_categories;
  }
  if (row.category === "pending" || row.category === "intruder") {
    return [];
  }
  return [
    {
      category: row.category,
      confidence: row.confidence ?? 0,
      description: row.description ?? "",
    },
  ];
}

export function incidentMatchesCategoryFilter(
  row: IncidentRow,
  filter: "all" | IncidentCategory,
): boolean {
  if (filter === "all") {
    return true;
  }
  return incidentDetectedCategories(row).some((c) => c.category === filter);
}
