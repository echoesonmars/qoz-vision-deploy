import { notFound } from "next/navigation";
import { OverviewCityGrid } from "@/components/overview/overview-city-grid";
import { OverviewPageShell } from "@/components/overview/overview-page-shell";
import { OverviewTodaySection } from "@/components/overview/overview-today-section";
import { buildRegionBreadcrumbs, getRegion } from "@/lib/hierarchy/resolvers";
import { buildRegionToday } from "@/lib/hierarchy/overview-today";
import { OVERVIEW_PATHS } from "@/lib/hierarchy/paths";

type PageProps = {
  params: Promise<{ regionId: string }>;
};

export default async function OverviewRegionPage({ params }: PageProps) {
  const { regionId } = await params;
  const region = getRegion(regionId);
  if (!region) notFound();

  const today = buildRegionToday(regionId);
  if (!today) notFound();

  return (
    <OverviewPageShell
      breadcrumbs={buildRegionBreadcrumbs(region)}
      title={region.name}
      description={`${region.cities.length} городов`}
      backHref={OVERVIEW_PATHS.country}
      backLabel="К списку областей"
    >
      <OverviewTodaySection
        level={today.level}
        entityName={today.entityName}
        metrics={today.metrics}
      />
      <OverviewCityGrid regionId={region.id} cities={region.cities} />
    </OverviewPageShell>
  );
}
