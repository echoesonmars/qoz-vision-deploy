import type {
  IAnalyticsRepository,
  ICamerasAnalyticsRepository,
  IChecksRepository,
  IDirectorDashboardRepository,
  IDirectorDetailRepository,
  IExportsRepository,
  IForecastsRepository,
  IHierarchyRepository,
  IIntegrationsRepository,
  IKnowledgeMapRepository,
  IPeopleRepository,
  ISettingsRepository,
  ISummaryRepository,
} from "@/lib/data/contracts";

function notImplemented(domain: string): never {
  throw new Error(`${domain} API repository is not implemented. Switch to mock in lib/data/registry.ts.`);
}

export class ApiDirectorDashboardRepository implements IDirectorDashboardRepository {
  parsePeriod = () => notImplemented("DirectorDashboard");
  getDashboard = async () => notImplemented("DirectorDashboard");
}

export class ApiDirectorDetailRepository implements IDirectorDetailRepository {
  getClassDetail = () => notImplemented("DirectorDetail");
  getStudentDetail = () => notImplemented("DirectorDetail");
  getTeacherDetail = () => notImplemented("DirectorDetail");
  getRoomDetail = () => notImplemented("DirectorDetail");
  getTopicDetail = () => notImplemented("DirectorDetail");
  getSecurityEvent = () => notImplemented("DirectorDetail");
  getAttendanceByClass = () => notImplemented("DirectorDetail");
  getRiskGroupStudents = () => notImplemented("DirectorDetail");
  getModoRisk9b = () => notImplemented("DirectorDetail");
  getEntForecast = () => notImplemented("DirectorDetail");
  getModoForecast = () => notImplemented("DirectorDetail");
  getBenchmarkRows = () => notImplemented("DirectorDetail");
  getBenchmarksBlock = () => notImplemented("DirectorDetail");
  getDirectorTasks = () => notImplemented("DirectorDetail");
  getDecliningClasses = () => notImplemented("DirectorDetail");
  getRooms = () => notImplemented("DirectorDetail");
  getMonitoringZones = () => notImplemented("DirectorDetail");
  getMapIncidentPins = () => notImplemented("DirectorDetail");
  getActivityFeed = () => notImplemented("DirectorDetail");
  getPeriodLabels = () => notImplemented("DirectorDetail");
  getDefaultPeriod = () => notImplemented("DirectorDetail");
  getDirectorPeriods = () => notImplemented("DirectorDetail");
  getPeriodScale = () => notImplemented("DirectorDetail");
  getSecurityAuditLog = () => notImplemented("DirectorDetail");
  getAttendanceThreshold = () => notImplemented("DirectorDetail");
  getRoutineOperationsTotal = () => notImplemented("DirectorDetail");
  getRoomStatusLabels = () => notImplemented("DirectorDetail");
  getSortedAlerts = () => notImplemented("DirectorDetail");
}

export class ApiPeopleRepository implements IPeopleRepository {
  readonly stubs = notImplemented("People") as never;
  readonly students = notImplemented("People") as never;
  readonly teachers = notImplemented("People") as never;
  readonly parents = notImplemented("People") as never;
  readonly classes = notImplemented("People") as never;
}

export class ApiChecksRepository implements IChecksRepository {
  readonly bank = notImplemented("Checks") as never;
  readonly archive = notImplemented("Checks") as never;
  readonly status = notImplemented("Checks") as never;
}

export class ApiAnalyticsRepository implements IAnalyticsRepository {
  getDataset = () => notImplemented("Analytics");
  getFilterOptions = () => notImplemented("Analytics");
  getDefaultFilters = () => notImplemented("Analytics");
}

export class ApiHierarchyRepository implements IHierarchyRepository {
  listRegions = () => notImplemented("Hierarchy");
  listCities = () => notImplemented("Hierarchy");
  getRegion = () => notImplemented("Hierarchy");
  getCity = () => notImplemented("Hierarchy");
  getDistrict = () => notImplemented("Hierarchy");
  getSchool = () => notImplemented("Hierarchy");
  resolveSchoolMeta = () => notImplemented("Hierarchy");
  resolveSchoolForDashboard = () => notImplemented("Hierarchy");
  buildCountryToday = () => notImplemented("Hierarchy");
  buildRegionToday = () => notImplemented("Hierarchy");
  buildCityToday = () => notImplemented("Hierarchy");
  buildDistrictToday = () => notImplemented("Hierarchy");
  buildCountryBreadcrumbs = () => notImplemented("Hierarchy");
  buildRegionBreadcrumbs = () => notImplemented("Hierarchy");
  buildCityBreadcrumbs = () => notImplemented("Hierarchy");
  buildDistrictBreadcrumbs = () => notImplemented("Hierarchy");
  buildSchoolDashboardBreadcrumbs = () => notImplemented("Hierarchy");
  getDefaultSchoolBackHref = () => notImplemented("Hierarchy");
  getDefaultSchoolId = () => notImplemented("Hierarchy");
}

export class ApiExportsRepository implements IExportsRepository {
  buildBundle = () => notImplemented("Exports");
  getOptions = () => notImplemented("Exports");
}

export class ApiKnowledgeMapRepository implements IKnowledgeMapRepository {
  readonly data = notImplemented("KnowledgeMap") as never;
}

export class ApiForecastsRepository implements IForecastsRepository {
  readonly dashboard = notImplemented("Forecasts") as never;
  readonly director = notImplemented("Forecasts") as never;
}

export class ApiIntegrationsRepository implements IIntegrationsRepository {
  fetchCamerasOnlinePercent = async () => notImplemented("Integrations");
  getIntegrationMeta = () => notImplemented("Integrations");
}

export class ApiCamerasAnalyticsRepository implements ICamerasAnalyticsRepository {
  getEngagementHistoryWeek = () => notImplemented("CamerasAnalytics");
}

export class ApiSummaryRepository implements ISummaryRepository {
  readonly data = notImplemented("Summary") as never;
}

export class ApiSettingsRepository implements ISettingsRepository {
  getAuditRows = () => notImplemented("Settings");
}
