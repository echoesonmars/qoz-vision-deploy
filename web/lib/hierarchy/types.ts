import type { TodayMetric } from "@/lib/director/types";

export type HierarchySchoolType = "osh" | "gymnasium" | "lyceum";

export type HierarchyMetrics = {
  totalSchools: number;
  totalStudents: number;
  attendance: number;
  gpa: number;
  incidentsToday: number;
};

export type HierarchySchool = {
  id: string;
  name: string;
  type: HierarchySchoolType;
  students: number;
  attendance: number;
};

export type HierarchyDistrict = {
  id: string;
  name: string;
  metrics: HierarchyMetrics;
  schools: HierarchySchool[];
  isActive?: boolean;
};

export type HierarchyCity = {
  id: string;
  name: string;
  metrics: HierarchyMetrics;
  districts: HierarchyDistrict[];
  schools?: HierarchySchool[];
  isActive?: boolean;
};

export type HierarchyRegion = {
  id: string;
  name: string;
  metrics: HierarchyMetrics;
  cities: HierarchyCity[];
  isActive?: boolean;
};

export type ResolvedSchoolMeta = {
  schoolId: string;
  schoolName: string;
  districtId?: string;
  districtName?: string;
  cityId: string;
  cityName: string;
  regionId: string;
  regionName: string;
};

export type OverviewBreadcrumbItem = {
  label: string;
  href?: string;
};

export type OverviewLevel = "country" | "region" | "city" | "district";

export type OverviewTodaySnapshot = {
  level: OverviewLevel;
  entityName: string;
  metrics: TodayMetric[];
};
