"use client";

import { AnalyticsSectionAccordion } from "@/components/analytics/analytics-section-accordion";
import { AnalyticsHeatmapTable } from "@/components/analytics/charts/analytics-heatmap-table";
import { useAnalyticsFilters } from "@/components/analytics/analytics-filters-provider";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { useDirectorRole } from "@/lib/director/role-context";
import { getDefaultOpenSections } from "@/lib/analytics/role-presets";

export function AnalyticsPerformanceSection() {
  const { dataset, section } = useAnalyticsFilters();
  const { role } = useDirectorRole();
  const defaultOpen =
    section === "performance" || getDefaultOpenSections(role).includes("performance");
  const { performance } = dataset;

  return (
    <AnalyticsSectionAccordion
      sectionId="performance"
      title="Успеваемость перспективных учеников"
      description="26 учеников × 5 предметов, 2 четверть — heatmap оценок"
      defaultOpen={defaultOpen}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <DirectorKpiTile label="Учеников" value="26" />
          <DirectorKpiTile label="Алгебра" value={performance.subjectAverages.algebra.toFixed(2)} />
          <DirectorKpiTile label="Биология" value={performance.subjectAverages.biology.toFixed(2)} />
          <DirectorKpiTile
            label="Литература"
            value={performance.subjectAverages.literature.toFixed(2)}
          />
          <DirectorKpiTile label="Физика" value={performance.subjectAverages.physics.toFixed(2)} />
          <DirectorKpiTile
            label="Всего"
            value={performance.overallAverage.toFixed(2)}
            status="ok"
          />
        </div>
        <AnalyticsHeatmapTable data={performance} />
      </div>
    </AnalyticsSectionAccordion>
  );
}
