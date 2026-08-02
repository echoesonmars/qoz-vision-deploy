export const ANALYTICS_SECTIONS = [
  "smart-class",
  "lesson",
  "performance",
  "safety",
  "platform",
] as const;

export type AnalyticsSection = (typeof ANALYTICS_SECTIONS)[number];

export type AnalyticsLessonView = "actions" | "emotions";

export type AnalyticsFilters = {
  date?: string;
  room?: string;
  lesson?: string;
  classId?: string;
  studentId?: string;
  studentName?: string;
  location?: string;
  view?: AnalyticsLessonView;
  subject?: string;
};

export type DashboardTab = "summary" | "analytics";

export type SmartClassCriterion = {
  id: string;
  label: string;
  waves: number[];
};

export type SmartClassData = {
  criteria: SmartClassCriterion[];
  waveLabels: string[];
};

export type ActionType =
  | "writes"
  | "reads"
  | "sits"
  | "phone"
  | "listens"
  | "speaks"
  | "eats"
  | "stands"
  | "other";

export type EmotionType =
  | "calm"
  | "focused"
  | "anxious"
  | "sad"
  | "happy";

export type StudentActionRow = {
  studentId: string;
  studentName: string;
  shares: Record<ActionType, number>;
};

export type StudentEmotionRow = {
  studentId: string;
  studentName: string;
  shares: Record<EmotionType, number>;
};

export type TimelinePoint = {
  minute: number;
  [key: string]: number;
};

export type DurationBar = {
  key: string;
  label: string;
  value: number;
};

export type DonutSlice = {
  key: string;
  label: string;
  value: number;
};

export type ClassroomActionsData = {
  timeline: TimelinePoint[];
  byStudent: StudentActionRow[];
  byDuration: DurationBar[];
  donut: DonutSlice[];
};

export type EmotionDailyBar = {
  date: string;
  label: string;
  calm: number;
  focused: number;
  anxious: number;
  sad: number;
  happy: number;
};

export type EmotionSummaryRow = {
  room: string;
  calm: number;
  focused: number;
  anxious: number;
  sad: number;
  happy: number;
  total: number;
};

export type ClassroomEmotionsData = {
  timeline: TimelinePoint[];
  byStudent: StudentEmotionRow[];
  byDuration: DurationBar[];
  donut: DonutSlice[];
  byDay: EmotionDailyBar[];
  summaryTable: EmotionSummaryRow[];
};

export type PerformanceSubject =
  | "algebra"
  | "biology"
  | "literature"
  | "physics"
  | "chemistry";

export type PerformanceStudentRow = {
  studentId: string;
  name: string;
  grades: Record<PerformanceSubject, number>;
  average: number;
};

export type PerformanceHeatmapData = {
  students: PerformanceStudentRow[];
  subjectAverages: Record<PerformanceSubject, number>;
  overallAverage: number;
  subjectLabels: Record<PerformanceSubject, string>;
};

export type PlatformDailyRow = {
  date: string;
  label: string;
  videoPathThousands: number;
  lessons: number;
};

export type PlatformMetricsData = {
  daily: PlatformDailyRow[];
  totalVideoPaths: number;
  totalLessons: number;
};

export type SafetyDailyRow = {
  date: string;
  label: string;
} & Record<string, string | number>;

export type SafetyLocationRow = {
  locationId: string;
  label: string;
  incidents: number;
  videoCount: number;
  byType: Record<string, number>;
};

export type SafetyMatrixCell = {
  locationId: string;
  incidentType: string;
  count: number;
  status: "ok" | "warning" | "critical";
};

export type SafetyAntibullyingData = {
  byDay: SafetyDailyRow[];
  byType: DonutSlice[];
  byLocation: DonutSlice[];
  locations: SafetyLocationRow[];
  matrix: SafetyMatrixCell[];
  typeTotals: Record<string, number>;
};

export type AnalyticsKpiHub = {
  totalStudents: number;
  totalLessons: number;
  totalVideoPaths: number;
  totalIncidents: number;
  smartClassGrowthPercent: number;
  analyzedStudents: number;
};

export type AnalyticsDataset = {
  kpi: AnalyticsKpiHub;
  smartClass: SmartClassData;
  actions: ClassroomActionsData;
  emotions: ClassroomEmotionsData;
  performance: PerformanceHeatmapData;
  platform: PlatformMetricsData;
  safety: SafetyAntibullyingData;
};

export type AnalyticsFilterOptions = {
  dates: { value: string; label: string }[];
  rooms: { value: string; label: string }[];
  lessons: { value: string; label: string }[];
  classes: { value: string; label: string }[];
  students: { value: string; label: string; classId: string }[];
  locations: { value: string; label: string }[];
};
