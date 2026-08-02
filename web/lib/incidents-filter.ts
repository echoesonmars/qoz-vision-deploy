import { incidentMatchesCategoryFilter } from "@/lib/incidents-detected";
import type { IncidentCategory, IncidentRow } from "@/lib/incidents-types";

export type IncidentCategoryFilter = "all" | IncidentCategory;

export type IncidentsFilterState = {
  search: string;
  category: IncidentCategoryFilter;
  date: Date | undefined;
};

function toDateKey(value: Date | string): string {
  const dt = typeof value === "string" ? new Date(value) : value;
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function filterIncidents(
  rows: IncidentRow[],
  filters: IncidentsFilterState,
): IncidentRow[] {
  const q = filters.search.trim().toLowerCase();
  return rows.filter((row) => {
    if (!incidentMatchesCategoryFilter(row, filters.category)) {
      return false;
    }
    if (filters.date) {
      if (toDateKey(row.created_at) !== toDateKey(filters.date)) {
        return false;
      }
    }
    if (!q) return true;
    const haystack = [row.description, row.title, row.camera_label]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function hasActiveIncidentFilters(filters: IncidentsFilterState): boolean {
  return (
    filters.search.trim().length > 0 ||
    filters.category !== "all" ||
    filters.date !== undefined
  );
}
