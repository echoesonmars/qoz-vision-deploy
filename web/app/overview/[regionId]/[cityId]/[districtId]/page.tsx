import { notFound } from "next/navigation";
import { OverviewDistrictSchools } from "@/components/overview/overview-district-schools";
import { OverviewPageShell } from "@/components/overview/overview-page-shell";
import { OverviewTodaySection } from "@/components/overview/overview-today-section";
import { buildDistrictBreadcrumbs, getDistrict } from "@/lib/hierarchy/resolvers";
import { buildDistrictToday } from "@/lib/hierarchy/overview-today";
import { OVERVIEW_PATHS } from "@/lib/hierarchy/paths";

type PageProps = {
  params: Promise<{ regionId: string; cityId: string; districtId: string }>;
};

export default async function OverviewDistrictPage({ params }: PageProps) {
  const { regionId, cityId, districtId } = await params;
  const result = getDistrict(regionId, cityId, districtId);
  if (!result) notFound();

  const { region, city, district } = result;
  const today = buildDistrictToday(regionId, cityId, districtId);
  if (!today) notFound();

  return (
    <OverviewPageShell
      breadcrumbs={buildDistrictBreadcrumbs(region, city, district)}
      title={district.name}
      description={`${district.schools.length} школ · ${city.name}`}
      backHref={OVERVIEW_PATHS.city(region.id, city.id)}
      backLabel="К районам города"
    >
      <OverviewTodaySection
        level={today.level}
        entityName={today.entityName}
        metrics={today.metrics}
      />
      <OverviewDistrictSchools region={region} city={city} district={district} />
    </OverviewPageShell>
  );
}
