import type { IncidentRow } from "@/lib/incidents-types";

export function incidentsSnapshot(rows: IncidentRow[]): string {
  return rows
    .map(
      (r) =>
        `${r.id}:${r.category}:${r.analysis_status}:${r.error_message ?? ""}:${r.confidence ?? ""}:${r.description ?? ""}:${r.created_at}`,
    )
    .join("|");
}
