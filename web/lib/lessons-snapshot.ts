import type { LessonRow } from "@/lib/lessons-types";

export function lessonsSnapshot(rows: LessonRow[]): string {
  return rows
    .map(
      (r) =>
        `${r.id}:${r.status}:${r.detected_language ?? ""}:${r.analysis?.lesson_overview.overall_engagement_score ?? ""}`,
    )
    .join("|");
}
