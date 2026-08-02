import { Badge } from "@/components/ui/badge";
import {
  AttendanceCell,
  OverviewEntityTable,
} from "@/components/overview/overview-entity-table";
import { getSchoolTypeLabel } from "@/lib/hierarchy/school-labels";
import { OVERVIEW_PATHS } from "@/lib/hierarchy/paths";
import type { HierarchyCity, HierarchyDistrict, HierarchyRegion } from "@/lib/hierarchy/types";

type OverviewDistrictSchoolsProps = {
  region: HierarchyRegion;
  city: HierarchyCity;
  district: HierarchyDistrict;
};

export function OverviewDistrictSchools({ region, city, district }: OverviewDistrictSchoolsProps) {
  const backHref = OVERVIEW_PATHS.district(region.id, city.id, district.id);

  return (
    <OverviewEntityTable
      id="district-schools"
      kicker="Школы"
      title="Список школ района"
      description="Выберите школу для перехода на экран директора"
      rows={district.schools}
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
