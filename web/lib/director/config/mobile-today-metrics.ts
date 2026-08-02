import type { TodayMetricKey } from "@/lib/director/types";

export type MobileTodayMetricConfig = {
  key: TodayMetricKey;
  note: string;
};

export const MOBILE_TODAY_METRICS_PLACEHOLDER: MobileTodayMetricConfig[] = [
  {
    key: "attendance",
    note: "Кандидат — согласовать на этапе дизайна",
  },
  {
    key: "risk_group",
    note: "Кандидат — согласовать на этапе дизайна",
  },
  {
    key: "security_incidents",
    note: "Кандидат — согласовать на этапе дизайна",
  },
  {
    key: "director_tasks",
    note: "Кандидат — согласовать на этапе дизайна",
  },
];

export const MOBILE_TODAY_METRIC_KEYS = MOBILE_TODAY_METRICS_PLACEHOLDER.map(
  (item) => item.key,
);
