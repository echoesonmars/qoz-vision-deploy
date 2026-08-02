export type IncidentAnalysisStatus = "processing" | "failed" | "completed";

export type IncidentCategory =
  | "fight"
  | "weapon"
  | "fall"
  | "smoking"
  | "phone_usage"
  | "sleep"
  | "lost_property"
  | "crowd"
  | "wanted_person"
  | "fence_climbing"
  | "anpr"
  | "fire"
  | "smoke"
  | "intruder"
  | "pending";

export type IncidentCategoryHit = {
  category: Exclude<IncidentCategory, "pending" | "intruder">;
  confidence: number;
  description: string;
};

export type IncidentRow = {
  id: string;
  category: IncidentCategory;
  analysis_status: IncidentAnalysisStatus;
  error_message: string | null;
  storage_path: string;
  title: string | null;
  camera_label: string | null;
  description: string | null;
  confidence: number | null;
  detected_categories?: IncidentCategoryHit[];
  created_at: string;
};

export const INCIDENT_CATEGORIES = [
  "fight",
  "weapon",
  "fall",
  "smoking",
  "phone_usage",
  "sleep",
  "lost_property",
  "crowd",
  "wanted_person",
  "fence_climbing",
  "anpr",
  "fire",
  "smoke",
] as const satisfies readonly Exclude<IncidentCategory, "pending" | "intruder">[];

export type KnownIncidentCategory = (typeof INCIDENT_CATEGORIES)[number];

export function isKnownIncidentCategory(value: string): value is KnownIncidentCategory {
  return (INCIDENT_CATEGORIES as readonly string[]).includes(value);
}
