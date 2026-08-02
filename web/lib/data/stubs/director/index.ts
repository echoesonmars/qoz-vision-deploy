export { mockSchool } from "@/lib/data/stubs/director/school";
export {
  DIRECTOR_PERIOD_LABELS,
  DIRECTOR_PERIODS,
  DEFAULT_DIRECTOR_PERIOD,
  getPeriodScale,
} from "@/lib/data/stubs/director/periods";
export {
  buildAttendanceMetric,
  getAttendanceByClass,
  ATTENDANCE_THRESHOLD_PERCENT,
} from "@/lib/data/stubs/director/attendance";
export {
  buildRiskGroupMetric,
  getRiskGroupStudents,
  RISK_GROUP_WEEKLY_GROWTH_ALERT_THRESHOLD,
} from "@/lib/data/stubs/director/risk-group";
export { buildAcademicQualityBlock } from "@/lib/data/stubs/director/academic-quality";
export { buildDirectorAlerts, sortAlertsByPriority } from "@/lib/data/stubs/director/alerts";
export { buildDirectorTasks, buildDirectorTasksMetric } from "@/lib/data/stubs/director/director-tasks";
export { buildTeacherLoadBlock, ROUTINE_OPERATIONS_TOTAL } from "@/lib/data/stubs/director/teacher-load";
export { mockTeacherRecommendations } from "@/lib/data/stubs/director/teacher-recommendations";
export {
  buildInfrastructureBlock,
  buildTechIssuesMetric,
  mockRooms,
} from "@/lib/data/stubs/director/infrastructure";
export { buildLessonAnalyticsBlock } from "@/lib/data/stubs/director/lesson-analytics";
export {
  buildSecurityBlock,
  buildSecurityIncidentsMetric,
  buildDecliningClassesMetric,
  mockMonitoringZones,
} from "@/lib/data/stubs/director/security-events";
export { buildBenchmarksBlock } from "@/lib/data/stubs/director/benchmarks";
export { mockIntegrationMeta } from "@/lib/data/stubs/director/integrations";
