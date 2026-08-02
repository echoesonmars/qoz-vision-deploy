import type { ChartConfig } from "@/components/ui/chart";
import { ADM_CHART_CSS_VARS } from "@/lib/brand/chart-palette";

export const metricPrimaryConfig = {
  value: {
    label: "Значение",
    color: ADM_CHART_CSS_VARS[0],
  },
  muted: {
    label: "Остаток",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

export const metricAttendanceConfig = {
  v: {
    label: "Посещаемость",
    color: ADM_CHART_CSS_VARS[0],
  },
} satisfies ChartConfig;

export const metricEngagementRadarConfig = {
  focus: {
    label: "Фокус, %",
    color: ADM_CHART_CSS_VARS[0],
  },
} satisfies ChartConfig;

export const metricSozleyAreaConfig = {
  verified: {
    label: "Утверждено",
    color: ADM_CHART_CSS_VARS[0],
  },
  pending: {
    label: "В очереди",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;
