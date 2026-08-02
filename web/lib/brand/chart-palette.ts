import { ADM_COLORS } from "@/lib/brand/tokens";

export const ADM_CHART_COLORS = {
  primary: ADM_COLORS.primary,
  secondary: "#2F80ED",
  tertiary: "#14B8A6",
  quaternary: "#7A5AF8",
  quinary: ADM_COLORS.statusWarning,
  accentCritical: ADM_COLORS.statusCritical,
} as const;

export type AdmChartColorKey = keyof typeof ADM_CHART_COLORS;

export const ADM_CHART_SERIES = [
  ADM_CHART_COLORS.primary,
  ADM_CHART_COLORS.secondary,
  ADM_CHART_COLORS.tertiary,
  ADM_CHART_COLORS.quaternary,
  ADM_CHART_COLORS.quinary,
  ADM_CHART_COLORS.accentCritical,
] as const;

export const ADM_CHART_CSS_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;
