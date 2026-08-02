import type { DirectorPeriod, LessonAnalyticsBlock } from "@/lib/director/types";

export function buildLessonAnalyticsBlock(
  period: DirectorPeriod,
): LessonAnalyticsBlock {
  const analyzed =
    period === "today" ? 0.42 : period === "week" ? 0.58 : period === "quarter" ? 0.64 : 0.71;
  return {
    engagementPercent: 78,
    studentActivityPercent: 34,
    analyzedLessonsRatio: analyzed,
    interactiveFormatsRatio: 0.46,
    formatShares: {
      frontal: 42,
      pair: 18,
      group: 24,
      individual: 16,
    },
    engagementByParallel: [
      { parallel: 5, percent: 74 },
      { parallel: 6, percent: 76 },
      { parallel: 7, percent: 79 },
      { parallel: 8, percent: 77 },
      { parallel: 9, percent: 72 },
      { parallel: 10, percent: 80 },
      { parallel: 11, percent: 75 },
    ],
    recommendations: [
      {
        id: "lr-1",
        classLabel: "8 «А»",
        subject: "Математика",
        lessonDate: "28.05.2026",
        signal: "Вовлечённость снизилась во второй половине урока",
        recommendation:
          "Добавить практическое задание после объяснения темы",
        responsible: "Методист",
      },
      {
        id: "lr-2",
        classLabel: "10 «Б»",
        subject: "Физика",
        lessonDate: "27.05.2026",
        signal: "Доля фронтальной работы 68%",
        recommendation: "Ввести парную работу на этапе закрепления",
        responsible: "Завуч по УВР",
      },
      {
        id: "lr-3",
        classLabel: "7 «В»",
        subject: "Биология",
        lessonDate: "26.05.2026",
        signal: "Активность учеников ниже среднего по школе",
        recommendation: "Использовать опрос с мгновенной обратной связью",
        responsible: "Методист",
      },
    ],
    pilotEnabled: true,
  };
}
