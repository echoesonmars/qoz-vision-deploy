import { admIncidentPreviewToneClass } from "@/lib/brand/ui-classes";
import { getIncidentCategoryMeta } from "@/lib/incident-categories";
import type { IncidentRow } from "@/lib/incidents-types";

export function buildIncidentDisplayNumbers(
  incidents: IncidentRow[],
): Record<string, number> {
  const sorted = [...incidents].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const map: Record<string, number> = {};
  sorted.forEach((row, index) => {
    map[row.id] = sorted.length - index;
  });
  return map;
}

export function incidentPreviewTone(category: IncidentRow["category"]): string {
  if (category === "pending") return "from-primary/30 via-primary/10 to-muted";
  const meta = getIncidentCategoryMeta(category);
  if (meta) return meta.previewTone;
  if (category === "intruder") return admIncidentPreviewToneClass;
  return admIncidentPreviewToneClass;
}
