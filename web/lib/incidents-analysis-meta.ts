import type { IncidentAnalysisStatus, IncidentRow } from "@/lib/incidents-types";

export function incidentAnalysisStatusBadge(incident: IncidentRow): {
  label: string;
  className: string;
} | null {
  if (incident.analysis_status === "processing") {
    return {
      label: "Обработка…",
      className: "border-none bg-amber-500/15 text-amber-800 dark:text-amber-200",
    };
  }
  if (incident.analysis_status === "failed") {
    return {
      label: "Ошибка",
      className: "border-none bg-destructive/15 text-destructive",
    };
  }
  return null;
}

export function isIncidentAnalyzing(incident: IncidentRow): boolean {
  return incident.analysis_status === "processing";
}

export function canRetryIncidentAnalysis(incident: IncidentRow): boolean {
  return incident.category === "pending" && incident.analysis_status !== "processing";
}

export function canStopIncidentAnalysis(incident: IncidentRow): boolean {
  return incident.analysis_status === "processing";
}

export function incidentAnalysisHint(incident: IncidentRow): string | null {
  if (incident.analysis_status === "processing") {
    return "ИИ анализирует кадры видео…";
  }
  if (incident.analysis_status === "failed" && incident.error_message) {
    return incident.error_message;
  }
  return null;
}

export type { IncidentAnalysisStatus };
