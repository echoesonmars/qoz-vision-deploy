import type { IHierarchyRepository } from "@/lib/data/contracts";
import { mockSchool } from "@/lib/data/stubs/director/school";
import { KAZAKHSTAN_REGIONS, listAllCities } from "@/lib/data/stubs/hierarchy/regions";
import { OVERVIEW_PATHS } from "@/lib/hierarchy/paths";
import {
  buildCityToday,
  buildCountryToday,
  buildDistrictToday,
  buildRegionToday,
} from "@/lib/hierarchy/overview-today";
import type {
  HierarchyCity,
  HierarchyDistrict,
  HierarchyRegion,
  OverviewBreadcrumbItem,
  OverviewTodaySnapshot,
  ResolvedSchoolMeta,
} from "@/lib/hierarchy/types";
import type { School } from "@/lib/director/types";

export class MockHierarchyRepository implements IHierarchyRepository {
  listRegions(): HierarchyRegion[] {
    return KAZAKHSTAN_REGIONS;
  }

  listCities(): HierarchyCity[] {
    return listAllCities();
  }

  getRegion(regionId: string): HierarchyRegion | undefined {
    return KAZAKHSTAN_REGIONS.find((region) => region.id === regionId);
  }

  getCity(
    regionId: string,
    cityId: string,
  ): { region: HierarchyRegion; city: HierarchyCity } | undefined {
    const region = this.getRegion(regionId);
    if (!region) return undefined;
    const city = region.cities.find((item) => item.id === cityId);
    if (!city) return undefined;
    return { region, city };
  }

  getDistrict(
    regionId: string,
    cityId: string,
    districtId: string,
  ):
    | { region: HierarchyRegion; city: HierarchyCity; district: HierarchyDistrict }
    | undefined {
    const result = this.getCity(regionId, cityId);
    if (!result) return undefined;
    const district = result.city.districts.find((item) => item.id === districtId);
    if (!district) return undefined;
    return { region: result.region, city: result.city, district };
  }

  getSchool(
    regionId: string,
    cityId: string,
    districtId: string,
    schoolId: string,
  ) {
    const result = this.getDistrict(regionId, cityId, districtId);
    if (!result) return undefined;
    const school = result.district.schools.find((item) => item.id === schoolId);
    if (!school) return undefined;
    return { ...result, school };
  }

  resolveSchoolMeta(schoolId: string | null | undefined): ResolvedSchoolMeta | null {
    if (!schoolId) return null;

    for (const region of KAZAKHSTAN_REGIONS) {
      for (const city of region.cities) {
        if (city.schools) {
          const citySchool = city.schools.find((item) => item.id === schoolId);
          if (citySchool) {
            return {
              schoolId: citySchool.id,
              schoolName: citySchool.name,
              cityId: city.id,
              cityName: city.name,
              regionId: region.id,
              regionName: region.name,
            };
          }
        }

        for (const district of city.districts) {
          const school = district.schools.find((item) => item.id === schoolId);
          if (school) {
            return {
              schoolId: school.id,
              schoolName: school.name,
              districtId: district.id,
              districtName: district.name,
              cityId: city.id,
              cityName: city.name,
              regionId: region.id,
              regionName: region.name,
            };
          }
        }
      }
    }

    return null;
  }

  resolveSchoolForDashboard(schoolId: string | null | undefined): School {
    const meta = this.resolveSchoolMeta(schoolId);
    if (!meta) return mockSchool;

    return {
      id: meta.schoolId,
      name: meta.schoolName,
      district: meta.districtName ?? meta.cityName,
      directorName: mockSchool.directorName,
    };
  }

  buildCountryToday(): OverviewTodaySnapshot {
    return buildCountryToday();
  }

  buildRegionToday(regionId: string): OverviewTodaySnapshot | null {
    return buildRegionToday(regionId);
  }

  buildCityToday(regionId: string, cityId: string): OverviewTodaySnapshot | null {
    return buildCityToday(regionId, cityId);
  }

  buildDistrictToday(
    regionId: string,
    cityId: string,
    districtId: string,
  ): OverviewTodaySnapshot | null {
    return buildDistrictToday(regionId, cityId, districtId);
  }

  buildCountryBreadcrumbs(): OverviewBreadcrumbItem[] {
    return [{ label: "Казахстан" }];
  }

  buildRegionBreadcrumbs(region: HierarchyRegion): OverviewBreadcrumbItem[] {
    return [
      { label: "Казахстан", href: OVERVIEW_PATHS.country },
      { label: region.name },
    ];
  }

  buildCityBreadcrumbs(
    region: HierarchyRegion,
    city: HierarchyCity,
  ): OverviewBreadcrumbItem[] {
    return [
      { label: "Казахстан", href: OVERVIEW_PATHS.country },
      { label: region.name, href: OVERVIEW_PATHS.region(region.id) },
      { label: city.name },
    ];
  }

  buildDistrictBreadcrumbs(
    region: HierarchyRegion,
    city: HierarchyCity,
    district: HierarchyDistrict,
  ): OverviewBreadcrumbItem[] {
    return [
      { label: "Казахстан", href: OVERVIEW_PATHS.country },
      { label: region.name, href: OVERVIEW_PATHS.region(region.id) },
      { label: city.name, href: OVERVIEW_PATHS.city(region.id, city.id) },
      { label: district.name },
    ];
  }

  buildSchoolDashboardBreadcrumbs(meta: ResolvedSchoolMeta): OverviewBreadcrumbItem[] {
    const items: OverviewBreadcrumbItem[] = [
      { label: "Казахстан", href: OVERVIEW_PATHS.country },
      { label: meta.regionName, href: OVERVIEW_PATHS.region(meta.regionId) },
      { label: meta.cityName, href: OVERVIEW_PATHS.city(meta.regionId, meta.cityId) },
    ];

    if (meta.districtId && meta.districtName) {
      items.push({
        label: meta.districtName,
        href: OVERVIEW_PATHS.district(meta.regionId, meta.cityId, meta.districtId),
      });
    }

    items.push({ label: meta.schoolName });

    return items;
  }

  getDefaultSchoolBackHref(meta: ResolvedSchoolMeta | null): string {
    if (!meta) return OVERVIEW_PATHS.country;
    if (!meta.districtId) {
      return OVERVIEW_PATHS.city(meta.regionId, meta.cityId);
    }
    return OVERVIEW_PATHS.district(meta.regionId, meta.cityId, meta.districtId);
  }

  getDefaultSchoolId(): string {
    return mockSchool.id;
  }
}
