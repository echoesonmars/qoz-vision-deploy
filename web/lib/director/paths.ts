export const DIRECTOR_NO_SIDEBAR_PREFIXES = [
  "/dashboard",
  "/overview",
  "/checks",
  "/people",
] as const;

export function isDirectorShellPath(pathname: string): boolean {
  return DIRECTOR_NO_SIDEBAR_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export const DIRECTOR_PATHS = {
  home: "/dashboard",
  overview: "/overview",
  legacySummary: "/dashboard/legacy-summary",
  attendance: "/dashboard/director/attendance",
  riskGroup: "/dashboard/director/risk-group",
  tasks: "/dashboard/director/tasks",
  alerts: "/dashboard/director/alerts",
  camerasEngagement: "/dashboard/cameras/engagement",
  camerasSituationCategory: (category: string) =>
    `/dashboard/cameras/engagement/situations/${category}`,
  camerasIncidents: "/dashboard/cameras/engagement?tab=incidents",
  camerasAll: "/dashboard/cameras/all",
  camerasLive: "/dashboard/cameras/live",
  sozleyStatus: "/checks/status",
  knowledgeMap: "/dashboard/knowledge-map",
  forecasts: "/dashboard/forecasts",
  managementMap: "/dashboard/management/map",
  exports: "/dashboard/analytics/exports",
  schoolSettings: "/dashboard/settings/school",
  benchmarks: "/dashboard/director/benchmarks",
  rooms: "/dashboard/director/rooms",
  uoOverview: "/dashboard/director/uo-overview",
  permissions: "/dashboard/settings/permissions",
  privacy: "/dashboard/settings/privacy",
  dataRights: "/dashboard/settings/data-rights",
} as const;

export const DIRECTOR_DRILLDOWN_ROUTES = {
  dashboard: [
    "/dashboard",
    "/dashboard/director/*",
    "/dashboard/cameras/*",
    "/dashboard/forecasts",
    "/dashboard/knowledge-map",
    "/dashboard/management/*",
    "/dashboard/analytics/exports",
    "/dashboard/settings/*",
    "/dashboard/legacy-summary",
  ],
  checks: ["/checks", "/checks/*"],
  people: ["/people", "/people/*"],
} as const;
