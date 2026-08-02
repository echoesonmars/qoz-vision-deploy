export type LessonLanguage = "kk" | "ru" | "en";

export type LessonStatus = "pending" | "processing" | "ready" | "failed";

export type LessonTimelineEventType =
  | "Interaction"
  | "Infraction"
  | "Engagement Drop"
  | "Phase";

export type LessonOverview = {
  duration: string;
  overall_engagement_score: number;
  pedagogical_style: string;
  presentation_sync: string;
};

export type LessonTimePhase = {
  phase: string;
  start_time: string;
  end_time: string;
  description: string;
};

export type LessonIncidentSummary = {
  type: string;
  count: number;
  severity: string;
  description: string;
};

export type LessonTimelineEvent = {
  timestamp: string;
  event_type: LessonTimelineEventType | string;
  description: string;
};

export type LessonAnalysisReport = {
  detected_language: LessonLanguage;
  lesson_overview: LessonOverview;
  time_management: LessonTimePhase[];
  incidents_summary: LessonIncidentSummary[];
  timeline: LessonTimelineEvent[];
};

export type LessonRow = {
  id: string;
  status: LessonStatus;
  storage_path: string;
  title: string | null;
  detected_language: LessonLanguage | null;
  analysis: LessonAnalysisReport | null;
  error_message: string | null;
  created_at: string;
  source_live_session_id: string | null;
  source_live_device_id: string | null;
};

export function isLessonAnalysisReport(value: unknown): value is LessonAnalysisReport {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.detected_language === "string" &&
    typeof v.lesson_overview === "object" &&
    v.lesson_overview !== null &&
    Array.isArray(v.timeline)
  );
}
