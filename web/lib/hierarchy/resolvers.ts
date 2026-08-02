import { hierarchyRepo } from "@/lib/data/registry";
import type {
  HierarchyCity,
  HierarchyDistrict,
  HierarchyRegion,
  HierarchySchool,
  OverviewBreadcrumbItem,
  OverviewTodaySnapshot,
  ResolvedSchoolMeta,
} from "@/lib/hierarchy/types";
import type { School } from "@/lib/director/types";

export const listRegions = hierarchyRepo.listRegions.bind(hierarchyRepo);
export const listCities = hierarchyRepo.listCities.bind(hierarchyRepo);

export function getRegion(regionId: string): HierarchyRegion | undefined {
  return hierarchyRepo.getRegion(regionId);
}

export function getCity(
  regionId: string,
  cityId: string,
): { region: HierarchyRegion; city: HierarchyCity } | undefined {
  return hierarchyRepo.getCity(regionId, cityId);
}

export function getCityById(cityId: string): HierarchyCity | undefined {
  return listCities().find((city) => city.id === cityId);
}

export function getDistrict(
  regionId: string,
  cityId: string,
  districtId: string,
):
  | { region: HierarchyRegion; city: HierarchyCity; district: HierarchyDistrict }
  | undefined {
  return hierarchyRepo.getDistrict(regionId, cityId, districtId);
}

export function getSchool(
  regionId: string,
  cityId: string,
  districtId: string,
  schoolId: string,
):
  | {
      region: HierarchyRegion;
      city: HierarchyCity;
      district: HierarchyDistrict;
      school: HierarchySchool;
    }
  | undefined {
  return hierarchyRepo.getSchool(regionId, cityId, districtId, schoolId);
}

export function resolveSchoolMeta(schoolId: string | null | undefined): ResolvedSchoolMeta | null {
  return hierarchyRepo.resolveSchoolMeta(schoolId);
}

export function resolveSchoolForDashboard(schoolId: string | null | undefined): School {
  return hierarchyRepo.resolveSchoolForDashboard(schoolId);
}

export function buildCountryBreadcrumbs(): OverviewBreadcrumbItem[] {
  return hierarchyRepo.buildCountryBreadcrumbs();
}

export function buildRegionBreadcrumbs(region: HierarchyRegion): OverviewBreadcrumbItem[] {
  return hierarchyRepo.buildRegionBreadcrumbs(region);
}

export function buildCityBreadcrumbs(
  region: HierarchyRegion,
  city: HierarchyCity,
): OverviewBreadcrumbItem[] {
  return hierarchyRepo.buildCityBreadcrumbs(region, city);
}

export function buildDistrictBreadcrumbs(
  region: HierarchyRegion,
  city: HierarchyCity,
  district: HierarchyDistrict,
): OverviewBreadcrumbItem[] {
  return hierarchyRepo.buildDistrictBreadcrumbs(region, city, district);
}

export function buildSchoolDashboardBreadcrumbs(
  meta: ResolvedSchoolMeta,
): OverviewBreadcrumbItem[] {
  return hierarchyRepo.buildSchoolDashboardBreadcrumbs(meta);
}

export function getDefaultSchoolBackHref(meta: ResolvedSchoolMeta | null): string {
  return hierarchyRepo.getDefaultSchoolBackHref(meta);
}

export function getDefaultSchoolId(): string {
  return hierarchyRepo.getDefaultSchoolId();
}

export function buildCountryToday(): OverviewTodaySnapshot {
  return hierarchyRepo.buildCountryToday();
}

export function buildRegionToday(regionId: string): OverviewTodaySnapshot | null {
  return hierarchyRepo.buildRegionToday(regionId);
}

export function buildCityToday(regionId: string, cityId: string): OverviewTodaySnapshot | null {
  return hierarchyRepo.buildCityToday(regionId, cityId);
}

export function buildDistrictToday(
  regionId: string,
  cityId: string,
  districtId: string,
): OverviewTodaySnapshot | null {
  return hierarchyRepo.buildDistrictToday(regionId, cityId, districtId);
}

export type SelectableSchool = {
  id: string;
  name: string;
};

export function listSelectableSchools(): SelectableSchool[] {
  const schools: SelectableSchool[] = [];
  const seen = new Set<string>();

  for (const region of hierarchyRepo.listRegions()) {
    for (const city of region.cities) {
      if (city.schools) {
        for (const school of city.schools) {
          if (seen.has(school.id)) continue;
          seen.add(school.id);
          schools.push({ id: school.id, name: school.name });
        }
      }
      for (const district of city.districts) {
        for (const school of district.schools) {
          if (seen.has(school.id)) continue;
          seen.add(school.id);
          schools.push({ id: school.id, name: school.name });
        }
      }
    }
  }

  return schools;
}
