export type DirectorPeriod = "today" | "week" | "quarter" | "year";

export type AlertPriority = "critical" | "attention" | "info";

export type SecurityWorkflowStatus =
  | "new"
  | "reviewing"
  | "forwarded"
  | "closed";

export type RoomReadinessStatus =
  | "ready"
  | "needs_equipment"
  | "repair"
  | "critical";

export type TeacherRecommendationCategory =
  | "mentor_candidate"
  | "method_support"
  | "pk_module"
  | "overload";

export type DirectorRole =
  | "director"
  | "deputy"
  | "methodist"
  | "teacher"
  | "psychologist"
  | "uo";

export type IntegrationSource =
  | "journal"
  | "casper"
  | "skud"
  | "goso"
  | "nct"
  | "pk"
  | "qoz_vision";

export type School = {
  id: string;
  name: string;
  district: string;
  directorName: string;
  studentCount?: number;
};

export type Parallel = {
  id: string;
  grade: number;
  label: string;
};

export type SchoolClass = {
  id: string;
  parallelId: string;
  label: string;
  homeroomTeacher: string;
  studentCount: number;
};

export type Student = {
  id: string;
  classId: string;
  fullName: string;
};

export type Teacher = {
  id: string;
  fullName: string;
  subject: string;
  classes: string;
  experienceYears: number;
};

export type Room = {
  id: string;
  number: string;
  floor: number;
  wifiStatus: "stable" | "unstable" | "offline";
  equipment: string;
  readiness: RoomReadinessStatus;
};

export type RepairTicket = {
  id: string;
  roomId: string;
  title: string;
  status: "open" | "in_progress" | "closed";
};

export type MonitoringZone = {
  id: string;
  name: string;
  allowed: boolean;
};

export type SecurityEvent = {
  id: string;
  type: SecuritySignalType;
  zoneId: string;
  zoneName: string;
  description: string;
  occurredAt: string;
  workflowStatus: SecurityWorkflowStatus;
  source: IntegrationSource;
};

export type SecuritySignalType =
  | "conflict"
  | "bullying"
  | "crowd"
  | "intruder"
  | "left_item"
  | "fall_injury";

export type GosoConcept = {
  id: string;
  code: string;
  title: string;
  subject: string;
  errorPercent: number;
  classLabel: string;
};

export type TeacherRecommendation = {
  id: string;
  category: TeacherRecommendationCategory;
  teacherId: string;
  teacherName: string;
  subject: string;
  classes: string;
  experienceYears: number;
  reason: string;
  action: string;
  responsible: string;
};

export type DirectorTask = {
  id: string;
  title: string;
  dueLabel: string;
  priority: AlertPriority;
  href?: string;
};

export type DirectorAlert = {
  id: string;
  priority: AlertPriority;
  title: string;
  context: string;
  actionLabel: string;
  responsible: string;
  href: string;
  reactionDeadline: string;
};

export type TodayMetricKey =
  | "attendance"
  | "risk_group"
  | "security_incidents"
  | "declining_classes"
  | "tech_issues"
  | "director_tasks";

export type TodayMetric = {
  key: TodayMetricKey;
  label: string;
  value: string | number;
  context: string;
  status: "ok" | "warning" | "critical";
  href?: string;
  source: IntegrationSource;
};

export type AcademicQualityBlock = {
  avgSorSoch: number;
  dynamicsDelta: number;
  studentsWithGaps: number;
  entForecastPercent: number;
  modoForecastPercent: number;
  topErrorTopics: GosoConcept[];
  decliningClasses: {
    classLabel: string;
    subject: string;
    deltaPercent: number;
    classId: string;
  }[];
};

export type LessonFormatShare = {
  frontal: number;
  pair: number;
  group: number;
  individual: number;
};

export type LessonMethodRecommendation = {
  id: string;
  classLabel: string;
  subject: string;
  lessonDate: string;
  signal: string;
  recommendation: string;
  responsible: string;
};

export type LessonAnalyticsBlock = {
  engagementPercent: number;
  studentActivityPercent: number;
  analyzedLessonsRatio: number;
  interactiveFormatsRatio: number;
  formatShares: LessonFormatShare;
  engagementByParallel: { parallel: number; percent: number }[];
  recommendations: LessonMethodRecommendation[];
  pilotEnabled: boolean;
};

export type SecurityBlock = {
  signalCounts: Record<SecuritySignalType, number>;
  recentEvents: SecurityEvent[];
  totalOpen: number;
};

export type TeacherLoadBlock = {
  aiAssistantPercent: number;
  avgLessonPrepMinutes: number;
  avgGradingMinutes: number;
  automatedProcesses: number;
  automatedProcessesTarget: number;
  hoursSavedPerWeek: number;
  recommendations: TeacherRecommendation[];
};

export type InfrastructureBlock = {
  wifiCoveragePercent: number;
  aiClassroomReadyPercent: number;
  openRepairTickets: number;
  camerasOnlinePercent: number;
  internetSpeedMbps: number;
  rooms: Room[];
};

export type BenchmarkSchool = {
  id: string;
  name: string;
  attendance: number;
  sorSoch: number;
  entPass: number;
  incidents: number;
};

export type BenchmarksBlock = {
  schoolRank: number;
  totalSchools: number;
  districtAvgAttendance: number;
  attendancePercentile?: number;
  schools: BenchmarkSchool[];
};

export type BenchmarkSchoolExtended = BenchmarkSchool & {
  infrastructure?: number;
  cityRank?: number;
};

export type IntegrationMeta = {
  source: IntegrationSource;
  label: string;
  mock: boolean;
  refreshLabel: string;
};

export type DirectorDashboardData = {
  school: School;
  period: DirectorPeriod;
  lastUpdatedAt: string;
  todayMetrics: TodayMetric[];
  alerts: DirectorAlert[];
  tasks: DirectorTask[];
  academicQuality: AcademicQualityBlock;
  lessonAnalytics: LessonAnalyticsBlock;
  security: SecurityBlock;
  teacherLoad: TeacherLoadBlock;
  infrastructure: InfrastructureBlock;
  benchmarks: BenchmarksBlock;
  integrations: IntegrationMeta[];
};
