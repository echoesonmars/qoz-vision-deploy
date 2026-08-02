import { OverviewRegionGrid } from "@/components/overview/overview-region-grid";
import { OverviewPageShell } from "@/components/overview/overview-page-shell";
import { OverviewTodaySection } from "@/components/overview/overview-today-section";
import { buildCountryBreadcrumbs } from "@/lib/hierarchy/resolvers";
import { buildCountryToday } from "@/lib/hierarchy/overview-today";
import { listRegions } from "@/lib/hierarchy/data/regions";

export default function OverviewCountryPage() {
  const regions = listRegions();
  const today = buildCountryToday();

  return (
    <OverviewPageShell
      breadcrumbs={buildCountryBreadcrumbs()}
      title="Образование — Республика Казахстан"
      description="Выберите область для просмотра агрегированных показателей"
    >
      <OverviewTodaySection
        level={today.level}
        entityName={today.entityName}
        metrics={today.metrics}
      />
      <OverviewRegionGrid regions={regions} />
    </OverviewPageShell>
  );
}
