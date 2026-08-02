import type { AnalyticsSection } from "@/lib/analytics/types";
import { getVisibleAnalyticsSections } from "@/lib/analytics/role-presets";
import type { DirectorRole } from "@/lib/director/types";

export type DirectorSectionId =
  | "today"
  | "attention"
  | "quality"
  | "sozley"
  | "lessons"
  | "security"
  | "teachers"
  | "infrastructure"
  | "extras";

export function canViewSection(role: DirectorRole, section: DirectorSectionId): boolean {
  if (role === "uo") {
    return section === "extras" || section === "today";
  }
  if (role === "psychologist") {
    return section === "today" || section === "attention" || section === "security";
  }
  if (role === "teacher") {
    return section !== "teachers";
  }
  if (role === "methodist") {
    return section !== "teachers";
  }
  return true;
}

export function canViewTeacherRecommendations(role: DirectorRole): boolean {
  return role === "director" || role === "deputy";
}

export function canViewPii(role: DirectorRole): boolean {
  return role !== "uo";
}

export function canViewAnalyticsSection(
  role: DirectorRole,
  section: AnalyticsSection,
): boolean {
  return getVisibleAnalyticsSections(role).includes(section);
}

export const PERMISSION_MATRIX: {
  section: string;
  director: boolean;
  deputy: boolean;
  methodist: boolean;
  teacher: boolean;
  psychologist: boolean;
  uo: boolean;
}[] = [
  { section: "Сегодня в школе", director: true, deputy: true, methodist: true, teacher: true, psychologist: true, uo: true },
  { section: "Требует внимания", director: true, deputy: true, methodist: true, teacher: true, psychologist: true, uo: false },
  { section: "Качество обучения", director: true, deputy: true, methodist: true, teacher: true, psychologist: false, uo: false },
  { section: "Sozley", director: true, deputy: true, methodist: true, teacher: true, psychologist: false, uo: false },
  { section: "Видеоаналитика", director: true, deputy: true, methodist: true, teacher: true, psychologist: false, uo: false },
  { section: "Безопасность", director: true, deputy: true, methodist: true, teacher: true, psychologist: true, uo: false },
  { section: "Нагрузка педагогов", director: true, deputy: true, methodist: false, teacher: false, psychologist: false, uo: false },
  { section: "Инфраструктура", director: true, deputy: true, methodist: true, teacher: false, psychologist: false, uo: false },
  { section: "Бенчмарки / УО", director: true, deputy: true, methodist: true, teacher: false, psychologist: false, uo: true },
];
