export const OVERVIEW_PATHS = {
  country: "/overview",
  region: (regionId: string) => `/overview/${regionId}`,
  city: (regionId: string, cityId: string) => `/overview/${regionId}/${cityId}`,
  district: (regionId: string, cityId: string, districtId: string) =>
    `/overview/${regionId}/${cityId}/${districtId}`,
  schoolDashboard: (schoolId: string, backHref?: string) => {
    const params = new URLSearchParams({ school: schoolId });
    if (backHref) {
      params.set("back", backHref);
    }
    return `/dashboard?${params.toString()}`;
  },
} as const;
