import { notFound } from "next/navigation";
import {
  AttendanceCell,
  OverviewEntityTable,
} from "@/components/overview/overview-entity-table";
import { OverviewCitySchools } from "@/components/overview/overview-city-schools";
import { OverviewEmptySchools } from "@/components/overview/overview-empty-schools";
import { OverviewPageShell } from "@/components/overview/overview-page-shell";
import { OverviewTodaySection } from "@/components/overview/overview-today-section";
import { buildCityBreadcrumbs, getCity } from "@/lib/hierarchy/resolvers";
import { buildCityToday } from "@/lib/hierarchy/overview-today";
import { OVERVIEW_PATHS } from "@/lib/hierarchy/paths";
import type { HierarchyDistrict } from "@/lib/hierarchy/types";

type PageProps = {
  params: Promise<{ regionId: string; cityId: string }>;
};

function districtRowHref(
  regionId: string,
  cityId: string,
  district: HierarchyDistrict,
): string | null {
  if (district.isActive === false) {
    return null;
  }
  return OVERVIEW_PATHS.district(regionId, cityId, district.id);
}

export default async function OverviewCityPage({ params }: PageProps) {
  const { regionId, cityId } = await params;
  const result = getCity(regionId, cityId);
  if (!result) notFound();

  const { region, city } = result;
  const today = buildCityToday(regionId, cityId);
  if (!today) notFound();

  const citySchools = city.schools ?? [];
  const hasDistricts = city.districts.length > 0;
  const hasCitySchools = citySchools.length > 0;

  return (
    <OverviewPageShell
      breadcrumbs={buildCityBreadcrumbs(region, city)}
      title={city.name}
      description={
        hasDistricts
          ? `${city.districts.length} районов · ${region.name}`
          : hasCitySchools
            ? `${citySchools.length} школ · ${region.name}`
            : `Нет подключённых школ · ${region.name}`
      }
      backHref={OVERVIEW_PATHS.region(region.id)}
      backLabel="К городам области"
    >
      <OverviewTodaySection
        level={today.level}
        entityName={today.entityName}
        metrics={today.metrics}
      />
      {hasDistricts ? (
        <OverviewEntityTable
          id="city-districts"
          kicker="Районы"
          title="Районы города"
          rows={city.districts}
          getRowKey={(district) => district.id}
          getRowHref={(district) => districtRowHref(region.id, city.id, district)}
          columns={[
            { key: "name", header: "Район", render: (district) => district.name },
            {
              key: "schools",
              header: "Школ",
              className: "tabular-nums",
              render: (district) => district.metrics.totalSchools,
            },
            {
              key: "students",
              header: "Учеников",
              className: "tabular-nums",
              render: (district) => district.metrics.totalStudents.toLocaleString("ru-RU"),
            },
            {
              key: "attendance",
              header: "Посещаемость",
              render: (district) => <AttendanceCell value={district.metrics.attendance} />,
            },
            {
              key: "gpa",
              header: "GPA",
              className: "tabular-nums",
              render: (district) => district.metrics.gpa.toFixed(1),
            },
            {
              key: "incidents",
              header: "Инциденты",
              className: "tabular-nums",
              render: (district) => district.metrics.incidentsToday,
            },
          ]}
        />
      ) : null}
      {!hasDistricts && hasCitySchools ? (
        <OverviewCitySchools region={region} city={city} schools={citySchools} />
      ) : null}
      {!hasDistricts && !hasCitySchools ? (
        <OverviewEmptySchools
          id="city-schools-empty"
          title="Школы не подключены"
          description="В этом городе пока нет школ в пилотной программе."
        />
      ) : null}
    </OverviewPageShell>
  );
}
