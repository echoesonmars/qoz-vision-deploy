"use client";

import { AnalyticsSectionAccordion } from "@/components/analytics/analytics-section-accordion";
import { AnalyticsPlatformBarCharts } from "@/components/analytics/charts/analytics-platform-bar-charts";
import { useAnalyticsFilters } from "@/components/analytics/analytics-filters-provider";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { useDirectorRole } from "@/lib/director/role-context";
import { getDefaultOpenSections } from "@/lib/analytics/role-presets";

export function AnalyticsPlatformSection() {
  const { dataset, section } = useAnalyticsFilters();
  const { role } = useDirectorRole();
  const defaultOpen =
    section === "platform" || getDefaultOpenSections(role).includes("platform");
  const { platform } = dataset;

  return (
    <AnalyticsSectionAccordion
      sectionId="platform"
      title="Платформенные метрики"
      description="Объём обработки video_path и количество снятых уроков"
      defaultOpen={defaultOpen}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DirectorKpiTile
            label="Video path (итого)"
            value={`${(platform.totalVideoPaths / 1_000_000).toFixed(2)} млн`}
            status="ok"
          />
          <DirectorKpiTile
            label="Уроков снято"
            value={String(platform.totalLessons)}
            status="ok"
          />
        </div>
        <AnalyticsPlatformBarCharts data={platform} />
      </div>
    </AnalyticsSectionAccordion>
  );
}
