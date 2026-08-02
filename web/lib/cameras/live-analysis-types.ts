import type { LiveCategoryStats } from "@/lib/cameras/live-session-events";

export type LiveSessionStatus = "running" | "stopped" | "error";

export type LiveRecordingUploadStatus = "pending" | "uploading" | "ready" | "failed";

export type LiveMonitorSession = {
  id: string;
  deviceId: string;
  cameraId: string | null;
  hlsUrl: string;
  status: LiveSessionStatus;
  startedAt: string;
  stoppedAt: string | null;
  frameCount: number;
  lastFrameAt: string | null;
  errorMessage: string | null;
  needsRestart: boolean;
  lastIngestError?: string | null;
  recordingStoragePath: string | null;
  recordingDurationSec: number | null;
  recordingBytes: number | null;
  recordingUploadStatus: LiveRecordingUploadStatus | null;
  recordingUploadedAt: string | null;
};

export type LiveAnalysisPayload = {
  analytics_meta: {
    target_language: string;
    overall_engagement_score: number;
  };
  classroom_visual_behavior: {
    students_count_detected: number;
    active_phone_users: number;
    sleeping_count: number;
    general_focus_description: string;
  };
  detected_incidents: {
    type: string;
    confidence: "high" | "medium" | "low";
    location_context?: string;
    description: string;
    timestamp_marker?: string;
  }[];
};

export type LiveAnalysisSnapshot = {
  id: string;
  sessionId: string;
  deviceId: string;
  capturedAt: string;
  payload: LiveAnalysisPayload;
  engagementScore: number | null;
  incidentCount: number;
  sessionOffsetSec: number | null;
};

export type LiveIncidentMoment = {
  id: string;
  snapshotId: string;
  sessionId: string;
  deviceId: string;
  capturedAt: string;
  type: string;
  confidence: string;
  locationContext: string | null;
  description: string;
  timestampMarker: string | null;
  evidenceStoragePath: string | null;
  evidenceUrl: string | null;
};

export type LiveSessionResponse = {
  session: LiveMonitorSession | null;
  isMonitoring: boolean;
};

export type LiveDashboardResponse = {
  session: LiveMonitorSession | null;
  isMonitoring: boolean;
  snapshots: LiveAnalysisSnapshot[];
  incidents: LiveIncidentMoment[];
  latest: LiveAnalysisSnapshot | null;
};

export type LiveSessionsListResponse = {
  sessions: LiveMonitorSession[];
};

export type LiveFeedResponse = {
  snapshots: LiveAnalysisSnapshot[];
};

export type LiveIncidentsResponse = {
  incidents: LiveIncidentMoment[];
};

export type FleetIncidentMoment = LiveIncidentMoment & {
  source?: "live";
  sessionStatus: string | null;
};

export type FleetSituationJournalItem = {
  source: "journal";
  incidentId: string;
  category: string;
  title: string | null;
  cameraLabel: string | null;
  description: string | null;
  confidence: number | null;
  createdAt: string;
  storagePath: string;
};

export type FleetSituationLiveItem = LiveIncidentMoment & {
  source: "live";
  sessionStatus: string | null;
};

export type FleetSituationItem = FleetSituationLiveItem | FleetSituationJournalItem;

export function isFleetSituationLiveItem(
  item: FleetSituationItem,
): item is FleetSituationLiveItem {
  if (item.source === "journal") return false;
  return "deviceId" in item && "sessionId" in item;
}

export function isFleetSituationJournalItem(
  item: FleetSituationItem,
): item is FleetSituationJournalItem {
  return item.source === "journal";
}

export type FleetSituationSummaryResponse = {
  stats: LiveCategoryStats[];
  retentionDays: number;
  since: string;
};

export type FleetSituationsPageResponse = {
  incidents: FleetSituationItem[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  since: string;
  retentionDays: number;
};
