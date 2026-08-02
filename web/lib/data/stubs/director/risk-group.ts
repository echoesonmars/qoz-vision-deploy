import type { DirectorPeriod } from "@/lib/director/types";
import { formatCountWithShare } from "@/lib/director/format-metric-value";
import { getPeriodScale } from "@/lib/data/stubs/director/periods";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import { DIRECTOR_SCHOOL_STUDENT_COUNT } from "@/lib/director/school-scale";

export const RISK_GROUP_WEEKLY_GROWTH_ALERT_THRESHOLD = 10;

export function getRiskGroupStudents(period: DirectorPeriod) {
  void period;
  return [
    {
      id: "s1",
      fullName: "Алиев Д. К.",
      classLabel: "9 «Б»",
      modoForecast: 2.8,
      deltaMonth: -0.6,
      gaps: ["Алгебра", "Геометрия"],
      riskLevel: "high" as const,
    },
    {
      id: "s2",
      fullName: "Нурланова А. С.",
      classLabel: "11 «А»",
      modoForecast: 82,
      deltaMonth: -4,
      gaps: ["Физика"],
      riskLevel: "medium" as const,
    },
  ];
}

export function buildRiskGroupMetric(period: DirectorPeriod) {
  const scale = getPeriodScale(period);
  const growth = scale.riskGroupWeeklyGrowth;
  const alert = growth > RISK_GROUP_WEEKLY_GROWTH_ALERT_THRESHOLD;
  return {
    key: "risk_group" as const,
    label: "Группа риска",
    value: formatCountWithShare(scale.riskGroup, DIRECTOR_SCHOOL_STUDENT_COUNT),
    context: alert
      ? `+${growth}% за неделю — требует внимания`
      : `Рост +${growth}% за неделю`,
    status: alert ? ("critical" as const) : ("warning" as const),
    href: DIRECTOR_PATHS.riskGroup,
    source: "nct" as const,
  };
}
