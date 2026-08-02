import { Badge } from "@/components/ui/badge";
import {
  AttendanceCell,
  OverviewEntityTable,
} from "@/components/overview/overview-entity-table";
import { getSchoolTypeLabel } from "@/lib/hierarchy/school-labels";
import { OVERVIEW_PATHS } from "@/lib/hierarchy/paths";
import type { HierarchyCity, HierarchyRegion, HierarchySchool } from "@/lib/hierarchy/types";

type OverviewCitySchoolsProps = {
  region: HierarchyRegion;
  city: HierarchyCity;
  schools: HierarchySchool[];
};

export function OverviewCitySchools({ region, city, schools }: OverviewCitySchoolsProps) {
  const backHref = OVERVIEW_PATHS.city(region.id, city.id);

  return (
    <OverviewEntityTable
      id="city-schools"
      kicker="Школы"
      title="Список школ города"
      description="Выберите школу для перехода на экран директора"
      rows={schools}
      getRowKey={(school) => school.id}
      getRowHref={(school) => OVERVIEW_PATHS.schoolDashboard(school.id, backHref)}
      columns={[
        {
          key: "name",
          header: "Школа",
          render: (school) => school.name,
        },
        {
          key: "type",
          header: "Тип",
          render: (school) => (
            <Badge variant="secondary">{getSchoolTypeLabel(school.type)}</Badge>
          ),
        },
        {
          key: "students",
          header: "Учеников",
          className: "tabular-nums",
          render: (school) => school.students.toLocaleString("ru-RU"),
        },
        {
          key: "attendance",
          header: "Посещаемость",
          render: (school) => <AttendanceCell value={school.attendance} />,
        },
      ]}
    />
  );
}
