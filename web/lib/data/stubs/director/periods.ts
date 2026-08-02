import type { DirectorPeriod } from "@/lib/director/types";

export const DIRECTOR_PERIOD_LABELS: Record<DirectorPeriod, string> = {
  today: "Сегодня",
  week: "Неделя",
  quarter: "Четверть",
  year: "Год",
};

export const DIRECTOR_PERIODS: DirectorPeriod[] = [
  "today",
  "week",
  "quarter",
  "year",
];

export const DEFAULT_DIRECTOR_PERIOD: DirectorPeriod = "week";

type PeriodScale = {
  attendance: number;
  riskGroup: number;
  riskGroupWeeklyGrowth: number;
  securityIncidents: number;
  decliningClasses: number;
  techIssues: number;
  directorTasks: number;
  avgSorSoch: number;
  dynamicsDelta: number;
  studentsWithGaps: number;
};

const periodScales: Record<DirectorPeriod, PeriodScale> = {
  today: {
    attendance: 87,
    riskGroup: 148,
    riskGroupWeeklyGrowth: 4,
    securityIncidents: 1,
    decliningClasses: 2,
    techIssues: 1,
    directorTasks: 3,
    avgSorSoch: 3.72,
    dynamicsDelta: 0.1,
    studentsWithGaps: 312,
  },
  week: {
    attendance: 86,
    riskGroup: 152,
    riskGroupWeeklyGrowth: 12,
    securityIncidents: 4,
    decliningClasses: 3,
    techIssues: 2,
    directorTasks: 5,
    avgSorSoch: 3.68,
    dynamicsDelta: -0.4,
    studentsWithGaps: 318,
  },
  quarter: {
    attendance: 84,
    riskGroup: 158,
    riskGroupWeeklyGrowth: 8,
    securityIncidents: 18,
    decliningClasses: 5,
    techIssues: 4,
    directorTasks: 7,
    avgSorSoch: 3.61,
    dynamicsDelta: -1.2,
    studentsWithGaps: 325,
  },
  year: {
    attendance: 85,
    riskGroup: 165,
    riskGroupWeeklyGrowth: 6,
    securityIncidents: 52,
    decliningClasses: 6,
    techIssues: 6,
    directorTasks: 9,
    avgSorSoch: 3.58,
    dynamicsDelta: -0.8,
    studentsWithGaps: 332,
  },
};

export function getPeriodScale(period: DirectorPeriod): PeriodScale {
  return periodScales[period];
}
