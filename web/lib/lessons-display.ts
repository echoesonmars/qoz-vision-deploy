import type { LessonLanguage } from "@/lib/lessons-types";

const LANGUAGE_LABELS: Record<LessonLanguage, string> = {
  ru: "RU",
  kk: "KK",
  en: "EN",
};

export function lessonLanguageLabel(lang: LessonLanguage | null): string | null {
  if (!lang) return null;
  return LANGUAGE_LABELS[lang];
}

export function lessonStatusLabel(
  status: string,
  sourceLiveSessionId?: string | null,
): string {
  if (sourceLiveSessionId) return "Live архив";
  if (status === "pending" || status === "processing") return "Анализ…";
  if (status === "failed") return "Ошибка";
  return "Готово";
}

export function isLessonAnalyzing(status: string): boolean {
  return status === "pending" || status === "processing";
}
