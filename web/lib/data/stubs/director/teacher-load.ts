import type { DirectorPeriod, TeacherLoadBlock } from "@/lib/director/types";

export const ROUTINE_OPERATIONS_TOTAL = 18;

export function buildTeacherLoadBlock(period: DirectorPeriod): TeacherLoadBlock {
  const factor =
    period === "today" ? 1 : period === "week" ? 1 : period === "quarter" ? 0.95 : 0.9;
  return {
    aiAssistantPercent: Math.round(76 * factor),
    avgLessonPrepMinutes: Math.round(28 * factor),
    avgGradingMinutes: Math.round(34 * factor),
    automatedProcesses: period === "year" ? 11 : 9,
    automatedProcessesTarget: 12,
    hoursSavedPerWeek: Number((4.2 * factor).toFixed(1)),
    recommendations: [],
  };
}
