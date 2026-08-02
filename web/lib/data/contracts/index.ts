import type { AnalyticsDataset, AnalyticsFilters } from "@/lib/analytics/types";
import type { DirectorDashboardData, DirectorPeriod } from "@/lib/director/types";
import type { ExportBundle, ExportFilters, ExportRecipientType } from "@/lib/exports/export-types";
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

export interface IDirectorDashboardRepository {
  parsePeriod(value: string | null | undefined): DirectorPeriod;
  getDashboard(period: DirectorPeriod, schoolId?: string | null): Promise<DirectorDashboardData>;
}

export interface IDirectorDetailRepository {
  getClassDetail(classId: string): ReturnType<
    typeof import("@/lib/data/stubs/director/class-details").getClassDetail
  >;
  getStudentDetail(studentId: string): ReturnType<
    typeof import("@/lib/data/stubs/director/student-details").getStudentDetail
  >;
  getTeacherDetail(teacherId: string): ReturnType<
    typeof import("@/lib/data/stubs/director/teacher-details").getTeacherDetail
  >;
  getRoomDetail(roomId: string): ReturnType<
    typeof import("@/lib/data/stubs/director/room-details").getRoomDetail
  >;
  getTopicDetail(topicId: string): ReturnType<
    typeof import("@/lib/data/stubs/director/topic-details").getTopicDetail
  >;
  getSecurityEvent(eventId: string): ReturnType<
    typeof import("@/lib/data/stubs/director/security-events").getSecurityEvent
  >;
  getAttendanceByClass(period: DirectorPeriod): ReturnType<
    typeof import("@/lib/data/stubs/director/attendance").getAttendanceByClass
  >;
  getRiskGroupStudents(period: DirectorPeriod): ReturnType<
    typeof import("@/lib/data/stubs/director/risk-group").getRiskGroupStudents
  >;
  getModoRisk9b(): typeof import("@/lib/data/stubs/director/modo-risk-9b").modoRisk9b;
  getEntForecast(): typeof import("@/lib/data/stubs/director/forecasts").entForecastMock;
  getModoForecast(): typeof import("@/lib/data/stubs/director/forecasts").modoForecastMock;
  getBenchmarkRows(): typeof import("@/lib/data/stubs/director/benchmarks").benchmarkExtendedRows;
  getBenchmarksBlock(period: DirectorPeriod): ReturnType<
    typeof import("@/lib/data/stubs/director/benchmarks").buildBenchmarksBlock
  >;
  getDirectorTasks(period: DirectorPeriod): ReturnType<
    typeof import("@/lib/data/stubs/director/director-tasks").buildDirectorTasks
  >;
  getDecliningClasses(period: DirectorPeriod): ReturnType<
    typeof import("@/lib/data/stubs/director/academic-quality").buildAcademicQualityBlock
  >;
  getRooms(): typeof import("@/lib/data/stubs/director/infrastructure").mockRooms;
  getMonitoringZones(): typeof import("@/lib/data/stubs/director/security-events").mockMonitoringZones;
  getMapIncidentPins(): typeof import("@/lib/data/stubs/director/zones").mockMapIncidentPins;
  getActivityFeed(): typeof import("@/lib/data/stubs/director/activity").directorActivityFeed;
  getPeriodLabels(): typeof import("@/lib/data/stubs/director/periods").DIRECTOR_PERIOD_LABELS;
  getDefaultPeriod(): typeof import("@/lib/data/stubs/director/periods").DEFAULT_DIRECTOR_PERIOD;
  getDirectorPeriods(): typeof import("@/lib/data/stubs/director/periods").DIRECTOR_PERIODS;
  getPeriodScale(period: DirectorPeriod): ReturnType<
    typeof import("@/lib/data/stubs/director/periods").getPeriodScale
  >;
  getSecurityAuditLog(): typeof import("@/lib/data/stubs/director/security-events").mockSecurityAuditLog;
  getAttendanceThreshold(): number;
  getRoutineOperationsTotal(): number;
  getRoomStatusLabels(): typeof import("@/lib/data/stubs/director/room-details").ROOM_STATUS_LABELS;
  getSortedAlerts(period: DirectorPeriod): ReturnType<
    typeof import("@/lib/data/stubs/director/alerts").buildDirectorAlerts
  >;
}

export interface IPeopleRepository {
  readonly stubs: typeof import("@/lib/data/stubs/people/students-mock");
  readonly students: typeof import("@/lib/data/stubs/people/students-mock");
  readonly teachers: typeof import("@/lib/data/stubs/people/teachers-mock");
  readonly parents: typeof import("@/lib/data/stubs/people/parents-mock");
  readonly classes: typeof import("@/lib/data/stubs/people/classes-mock");
}

export interface IChecksRepository {
  readonly bank: typeof import("@/lib/data/stubs/checks/bank-mock");
  readonly archive: typeof import("@/lib/data/stubs/checks/archive-mock");
  readonly status: typeof import("@/lib/data/stubs/checks/status-mock");
}

export interface IAnalyticsRepository {
  getDataset(filters?: AnalyticsFilters): AnalyticsDataset;
  getFilterOptions(): typeof import("@/lib/data/stubs/analytics/filters").analyticsFilterOptions;
  getDefaultFilters(): typeof import("@/lib/data/stubs/analytics/filters").DEFAULT_ANALYTICS_FILTERS;
}

export interface IHierarchyRepository {
  listRegions(): HierarchyRegion[];
  listCities(): HierarchyCity[];
  getRegion(regionId: string): HierarchyRegion | undefined;
  getCity(
    regionId: string,
    cityId: string,
  ): { region: HierarchyRegion; city: HierarchyCity } | undefined;
  getDistrict(
    regionId: string,
    cityId: string,
    districtId: string,
  ):
    | { region: HierarchyRegion; city: HierarchyCity; district: HierarchyDistrict }
    | undefined;
  getSchool(
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
    | undefined;
  resolveSchoolMeta(schoolId: string | null | undefined): ResolvedSchoolMeta | null;
  resolveSchoolForDashboard(schoolId: string | null | undefined): School;
  buildCountryToday(): OverviewTodaySnapshot;
  buildRegionToday(regionId: string): OverviewTodaySnapshot | null;
  buildCityToday(regionId: string, cityId: string): OverviewTodaySnapshot | null;
  buildDistrictToday(
    regionId: string,
    cityId: string,
    districtId: string,
  ): OverviewTodaySnapshot | null;
  buildCountryBreadcrumbs(): OverviewBreadcrumbItem[];
  buildRegionBreadcrumbs(region: HierarchyRegion): OverviewBreadcrumbItem[];
  buildCityBreadcrumbs(region: HierarchyRegion, city: HierarchyCity): OverviewBreadcrumbItem[];
  buildDistrictBreadcrumbs(
    region: HierarchyRegion,
    city: HierarchyCity,
    district: HierarchyDistrict,
  ): OverviewBreadcrumbItem[];
  buildSchoolDashboardBreadcrumbs(meta: ResolvedSchoolMeta): OverviewBreadcrumbItem[];
  getDefaultSchoolBackHref(meta: ResolvedSchoolMeta | null): string;
  getDefaultSchoolId(): string;
}

export interface IExportsRepository {
  buildBundle(type: ExportRecipientType, filters: ExportFilters): ExportBundle;
  getOptions(): typeof import("@/lib/data/stubs/exports/export-options-mock");
}

export interface IKnowledgeMapRepository {
  readonly data: typeof import("@/lib/data/stubs/dashboard/knowledge-map-mock");
}

export interface IForecastsRepository {
  readonly dashboard: typeof import("@/lib/data/stubs/dashboard/forecasts-mock");
  readonly director: typeof import("@/lib/data/stubs/director/forecasts");
}

export interface IIntegrationsRepository {
  fetchCamerasOnlinePercent(): Promise<number | null>;
  getIntegrationMeta(): typeof import("@/lib/data/stubs/director/integrations").mockIntegrationMeta;
}

export interface ICamerasAnalyticsRepository {
  getEngagementHistoryWeek(): typeof import("@/lib/data/stubs/cameras/engagement-history-mock").engagementHistoryWeek;
}

export interface ISummaryRepository {
  readonly data: typeof import("@/lib/data/stubs/dashboard/summary-mock");
}

export interface ISettingsRepository {
  getAuditRows(): typeof import("@/lib/data/stubs/settings/audit").settingsAuditRows;
}
