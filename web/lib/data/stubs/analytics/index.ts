import type { AnalyticsDataset, AnalyticsFilters } from "@/lib/analytics/types";
import { analyticsKpiHub } from "@/lib/data/stubs/analytics/kpi-hub";
import { smartClassData } from "@/lib/data/stubs/analytics/smart-class";
import { classroomActionsData } from "@/lib/data/stubs/analytics/classroom-actions";
import { classroomEmotionsData } from "@/lib/data/stubs/analytics/classroom-emotions";
import { performanceHeatmapData } from "@/lib/data/stubs/analytics/performance-heatmap";
import { platformMetricsData } from "@/lib/data/stubs/analytics/platform-metrics";
import { safetyAntibullyingData } from "@/lib/data/stubs/analytics/safety-antibullying";
import { analyticsFilterOptions } from "@/lib/data/stubs/analytics/filters";

export { analyticsFilterOptions, analyticsKpiHub };

export function getAnalyticsDataset(filters?: AnalyticsFilters): AnalyticsDataset {
  void filters;
  return {
    kpi: analyticsKpiHub,
    smartClass: smartClassData,
    actions: classroomActionsData,
    emotions: classroomEmotionsData,
    performance: performanceHeatmapData,
    platform: platformMetricsData,
    safety: safetyAntibullyingData,
  };
}
