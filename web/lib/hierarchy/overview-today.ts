import { ATTENDANCE_THRESHOLD_PERCENT } from "@/lib/data/stubs/director/attendance";
import { RISK_GROUP_WEEKLY_GROWTH_ALERT_THRESHOLD } from "@/lib/data/stubs/director/risk-group";
import { formatCountWithShare } from "@/lib/director/format-metric-value";
import type { TodayMetric } from "@/lib/director/types";
import { DIRECTOR_SCHOOL_CLASS_COUNT, DIRECTOR_SCHOOL_ROOM_COUNT } from "@/lib/director/school-scale";
import { aggregateMetrics } from "@/lib/hierarchy/aggregate-metrics";
import { KAZAKHSTAN_REGIONS } from "@/lib/data/stubs/hierarchy/regions";
import type {
  HierarchyCity,
  HierarchyDistrict,
  HierarchyMetrics,
  HierarchyRegion,
  OverviewLevel,
  OverviewTodaySnapshot,
} from "@/lib/hierarchy/types";

function getRegion(regionId: string): HierarchyRegion | undefined {
  return KAZAKHSTAN_REGIONS.find((region) => region.id === regionId);
}

function getCity(
  regionId: string,
  cityId: string,
): { region: HierarchyRegion; city: HierarchyCity } | undefined {
  const region = getRegion(regionId);
  if (!region) return undefined;
  const city = region.cities.find((item) => item.id === cityId);
  if (!city) return undefined;
  return { region, city };
}

function getDistrict(
  regionId: string,
  cityId: string,
  districtId: string,
):
  | { region: HierarchyRegion; city: HierarchyCity; district: HierarchyDistrict }
  | undefined {
  const result = getCity(regionId, cityId);
  if (!result) return undefined;
  const district = result.city.districts.find((item) => item.id === districtId);
  if (!district) return undefined;
  return { region: result.region, city: result.city, district };
}

type DerivedTodayCounts = {
  riskGroup: number;
  riskGroupWeeklyGrowth: number;
  securityIncidents: number;
  decliningClasses: number;
  techIssues: number;
  directorTasks: number;
};

function deriveCounts(metrics: HierarchyMetrics): DerivedTodayCounts {
  const riskGroupWeeklyGrowth = metrics.totalSchools % 12;
  return {
    riskGroup: Math.round(metrics.totalStudents * 0.009),
    riskGroupWeeklyGrowth,
    securityIncidents: metrics.incidentsToday,
    decliningClasses: Math.round(metrics.totalSchools * 0.014),
    techIssues: Math.max(0, Math.round(metrics.totalSchools * 0.006)),
    directorTasks: Math.max(1, Math.round(metrics.totalSchools * 0.022)),
  };
}

function buildTodayMetrics(metrics: HierarchyMetrics): TodayMetric[] {
  const derived = deriveCounts(metrics);
  const attendanceOk = metrics.attendance >= ATTENDANCE_THRESHOLD_PERCENT;
  const riskAlert = derived.riskGroupWeeklyGrowth > RISK_GROUP_WEEKLY_GROWTH_ALERT_THRESHOLD;
  const incidents = derived.securityIncidents;

  return [
    {
      key: "attendance",
      label: "Посещаемость",
      value: `${metrics.attendance}%`,
      context: attendanceOk
        ? "В норме (≥85%)"
        : `Ниже порога ${ATTENDANCE_THRESHOLD_PERCENT}%`,
      status: attendanceOk ? "ok" : "warning",
      source: "journal",
    },
    {
      key: "risk_group",
      label: "Группа риска",
      value: formatCountWithShare(derived.riskGroup, metrics.totalStudents),
      context: riskAlert
        ? `+${derived.riskGroupWeeklyGrowth}% за неделю — требует внимания`
        : `Рост +${derived.riskGroupWeeklyGrowth}% за неделю`,
      status: riskAlert ? "critical" : "warning",
      source: "nct",
    },
    {
      key: "security_incidents",
      label: "Инциденты безопасности",
      value: incidents,
      context: incidents === 0 ? "Норма: 0 инцидентов" : "Требуют обработки",
      status: incidents === 0 ? "ok" : "critical",
      source: "qoz_vision",
    },
    {
      key: "declining_classes",
      label: "Снижение успеваемости",
      value: formatCountWithShare(derived.decliningClasses, DIRECTOR_SCHOOL_CLASS_COUNT, 0),
      context:
        derived.decliningClasses === 0
          ? "Классов со снижением нет"
          : `${derived.decliningClasses} класса за 2+ цикла`,
      status: derived.decliningClasses === 0 ? "ok" : "warning",
      source: "journal",
    },
    {
      key: "tech_issues",
      label: "Тех. проблемы",
      value: formatCountWithShare(derived.techIssues, DIRECTOR_SCHOOL_ROOM_COUNT, 0),
      context:
        derived.techIssues === 0
          ? "Инфраструктура в норме"
          : `${derived.techIssues} каб. требуют внимания`,
      status: derived.techIssues === 0 ? "ok" : "warning",
      source: "qoz_vision",
    },
    {
      key: "director_tasks",
      label: "Задачи директору",
      value: derived.directorTasks,
      context: `${derived.directorTasks} в очереди действий`,
      status: derived.directorTasks > 4 ? "warning" : "ok",
      source: "casper",
    },
  ];
}

function buildSnapshot(
  level: OverviewLevel,
  entityName: string,
  metrics: HierarchyMetrics,
): OverviewTodaySnapshot {
  return {
    level,
    entityName,
    metrics: buildTodayMetrics(metrics),
  };
}

export function buildCountryToday(): OverviewTodaySnapshot {
  const metrics = aggregateMetrics(KAZAKHSTAN_REGIONS);
  return buildSnapshot("country", "Казахстан", metrics);
}

export function buildRegionToday(regionId: string): OverviewTodaySnapshot | null {
  const region = getRegion(regionId);
  if (!region) return null;
  return buildSnapshot("region", region.name, region.metrics);
}

export function buildCityToday(
  regionId: string,
  cityId: string,
): OverviewTodaySnapshot | null {
  const result = getCity(regionId, cityId);
  if (!result) return null;
  return buildSnapshot("city", result.city.name, result.city.metrics);
}

export function buildDistrictToday(
  regionId: string,
  cityId: string,
  districtId: string,
): OverviewTodaySnapshot | null {
  const result = getDistrict(regionId, cityId, districtId);
  if (!result) return null;
  return buildSnapshot("district", result.district.name, result.district.metrics);
}
