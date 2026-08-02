import type { DirectorDashboardData, DirectorPeriod } from "@/lib/director/types";
import type { IDirectorDashboardRepository } from "@/lib/data/contracts";
import type { IHierarchyRepository } from "@/lib/data/contracts";
import type { IIntegrationsRepository } from "@/lib/data/contracts";
import {
  buildAcademicQualityBlock,
  buildAttendanceMetric,
  buildBenchmarksBlock,
  buildDecliningClassesMetric,
  buildDirectorAlerts,
  buildDirectorTasks,
  buildDirectorTasksMetric,
  buildInfrastructureBlock,
  buildLessonAnalyticsBlock,
  buildRiskGroupMetric,
  buildSecurityBlock,
  buildSecurityIncidentsMetric,
  buildTechIssuesMetric,
  buildTeacherLoadBlock,
  mockIntegrationMeta,
  mockTeacherRecommendations,
  sortAlertsByPriority,
} from "@/lib/data/stubs/director/index";

export class MockDirectorDashboardRepository implements IDirectorDashboardRepository {
  constructor(
    private readonly hierarchyRepo: IHierarchyRepository,
    private readonly integrationsRepo: IIntegrationsRepository,
  ) {}

  parsePeriod(value: string | null | undefined): DirectorPeriod {
    if (value === "today" || value === "week" || value === "quarter" || value === "year") {
      return value;
    }
    return "week";
  }

  async getDashboard(
    period: DirectorPeriod,
    schoolId?: string | null,
  ): Promise<DirectorDashboardData> {
    const camerasOnlinePercent = await this.integrationsRepo.fetchCamerasOnlinePercent();
    const teacherLoad = buildTeacherLoadBlock(period);
    teacherLoad.recommendations = mockTeacherRecommendations.slice(0, 4);
    const schoolOverride = this.hierarchyRepo.resolveSchoolForDashboard(schoolId);

    return {
      school: schoolOverride,
      period,
      lastUpdatedAt: new Date().toISOString(),
      todayMetrics: [
        buildAttendanceMetric(period),
        buildRiskGroupMetric(period),
        buildSecurityIncidentsMetric(period),
        buildDecliningClassesMetric(period),
        buildTechIssuesMetric(period),
        buildDirectorTasksMetric(period),
      ],
      alerts: sortAlertsByPriority(buildDirectorAlerts(period)),
      tasks: buildDirectorTasks(period),
      academicQuality: buildAcademicQualityBlock(period),
      lessonAnalytics: buildLessonAnalyticsBlock(period),
      security: buildSecurityBlock(period),
      teacherLoad,
      infrastructure: buildInfrastructureBlock(period, camerasOnlinePercent ?? undefined),
      benchmarks: buildBenchmarksBlock(period),
      integrations: mockIntegrationMeta,
    };
  }
}
