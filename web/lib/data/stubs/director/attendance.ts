import type { DirectorPeriod } from "@/lib/director/types";
import { getPeriodScale } from "@/lib/data/stubs/director/periods";
import { DIRECTOR_PATHS } from "@/lib/director/paths";

export const ATTENDANCE_THRESHOLD_PERCENT = 85;

export function getAttendanceByClass(period: DirectorPeriod) {
  const base = getPeriodScale(period).attendance;
  const drift = period === "today" ? 0 : period === "week" ? -1 : -2;
  return [
    { classId: "8a", label: "8 «А»", percent: base + 4 + drift },
    { classId: "9b", label: "9 «Б»", percent: base - 6 + drift },
    { classId: "10a", label: "10 «А»", percent: base + 1 + drift },
    { classId: "11a", label: "11 «А»", percent: base - 3 + drift },
  ];
}

export function buildAttendanceMetric(period: DirectorPeriod) {
  const percent = getPeriodScale(period).attendance;
  const ok = percent >= ATTENDANCE_THRESHOLD_PERCENT;
  return {
    key: "attendance" as const,
    label: "Посещаемость",
    value: `${percent}%`,
    context: ok
      ? "В норме (≥85%)"
      : `Ниже порога ${ATTENDANCE_THRESHOLD_PERCENT}%`,
    status: ok ? ("ok" as const) : ("warning" as const),
    href: DIRECTOR_PATHS.attendance,
    source: "journal" as const,
  };
}
