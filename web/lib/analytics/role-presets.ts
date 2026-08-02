import type { DirectorRole } from "@/lib/director/types";
import type { AnalyticsLessonView, AnalyticsSection } from "@/lib/analytics/types";

export const ANALYTICS_SECTION_LABELS: Record<AnalyticsSection, string> = {
  "smart-class": "Smart Class",
  lesson: "Анализ урока",
  performance: "Успеваемость",
  safety: "Безопасность",
  platform: "Платформа",
};

export function getDefaultOpenSections(role: DirectorRole): AnalyticsSection[] {
  switch (role) {
    case "director":
    case "deputy":
      return ["smart-class", "lesson", "safety", "platform"];
    case "methodist":
      return ["smart-class", "lesson", "performance"];
    case "psychologist":
      return ["lesson", "safety"];
    case "teacher":
      return ["lesson", "performance"];
    case "uo":
      return ["platform"];
    default:
      return ["smart-class", "platform"];
  }
}

export function getDefaultLessonView(role: DirectorRole): AnalyticsLessonView {
  if (role === "psychologist") return "emotions";
  return "actions";
}

export function getVisibleAnalyticsSections(role: DirectorRole): AnalyticsSection[] {
  switch (role) {
    case "uo":
      return ["platform"];
    case "psychologist":
      return ["lesson", "safety"];
    case "teacher":
      return ["lesson", "performance"];
    case "methodist":
      return ["smart-class", "lesson", "performance"];
    default:
      return ["smart-class", "lesson", "performance", "safety", "platform"];
  }
}
