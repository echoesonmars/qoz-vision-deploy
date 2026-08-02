import { normalizeLiveIncidentType } from "@/lib/cameras/live-incident-normalize";
import type {
  LiveAnalysisSnapshot,
  LiveIncidentMoment,
  LiveMonitorSession,
} from "@/lib/cameras/live-analysis-types";
import { INCIDENT_CATEGORIES } from "@/lib/incidents-types";
import type { IncidentCategory } from "@/lib/incidents-types";

export type LiveTimelineMarker = {
  id: string;
  category: IncidentCategory;
  offsetSec: number;
  capturedAt: string;
  description: string;
  confidence: string;
};

export type LiveCategoryStats = {
  category: IncidentCategory;
  count: number;
  lastAt: string | null;
  lastOffsetSec: number | null;
};

function parseMarkerOffset(marker: string | null): number | null {
  if (!marker) return null;
  const trimmed = marker.trim();
  const mmss = /^(\d{1,3}):(\d{2})(?::(\d{2}))?$/.exec(trimmed);
  if (mmss) {
    const h = mmss[3] != null;
    const a = Number(mmss[1]);
    const b = Number(mmss[2]);
    const c = mmss[3] != null ? Number(mmss[3]) : 0;
    return h ? a * 3600 + b * 60 + c : a * 60 + b;
  }
  const n = Number(trimmed);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
}

function snapshotById(
  snapshots: LiveAnalysisSnapshot[],
): Map<string, LiveAnalysisSnapshot> {
  return new Map(snapshots.map((s) => [s.id, s]));
}

function offsetFromCaptured(
  capturedAt: string,
  sessionStartedAt: string,
): number | null {
  const start = Date.parse(sessionStartedAt);
  const at = Date.parse(capturedAt);
  if (!Number.isFinite(start) || !Number.isFinite(at)) return null;
  const sec = Math.floor((at - start) / 1000);
  return sec >= 0 ? sec : null;
}

export function incidentOffsetSec(
  incident: LiveIncidentMoment,
  snapshots: LiveAnalysisSnapshot[],
  session: LiveMonitorSession | null,
): number {
  const snapMap = snapshotById(snapshots);
  const snap = snapMap.get(incident.snapshotId);
  if (snap?.sessionOffsetSec != null && snap.sessionOffsetSec >= 0) {
    return snap.sessionOffsetSec;
  }
  const fromMarker = parseMarkerOffset(incident.timestampMarker);
  if (fromMarker != null) return fromMarker;
  if (session?.startedAt) {
    const fromCapture = offsetFromCaptured(incident.capturedAt, session.startedAt);
    if (fromCapture != null) return fromCapture;
  }
  return 0;
}

export function sessionDurationSec(
  session: LiveMonitorSession | null,
  snapshots: LiveAnalysisSnapshot[],
): number {
  const maxSnap = snapshots.reduce(
    (max, s) =>
      s.sessionOffsetSec != null && s.sessionOffsetSec > max ? s.sessionOffsetSec : max,
    0,
  );
  if (!session) return Math.max(maxSnap, 1);
  if (session.status === "running" && session.startedAt) {
    const elapsed = offsetFromCaptured(new Date().toISOString(), session.startedAt);
    const live = elapsed ?? 0;
    return Math.max(maxSnap, live, 1);
  }
  return Math.max(maxSnap, 1);
}

export function buildLiveTimelineMarkers(
  incidents: LiveIncidentMoment[],
  snapshots: LiveAnalysisSnapshot[],
  session: LiveMonitorSession | null,
): LiveTimelineMarker[] {
  return incidents
    .map((inc) => ({
      id: inc.id,
      category: normalizeLiveIncidentType(inc.type),
      offsetSec: incidentOffsetSec(inc, snapshots, session),
      capturedAt: inc.capturedAt,
      description: inc.description,
      confidence: inc.confidence,
    }))
    .sort((a, b) => a.offsetSec - b.offsetSec);
}

export function buildLiveCategoryStats(
  incidents: LiveIncidentMoment[],
  snapshots: LiveAnalysisSnapshot[],
  session: LiveMonitorSession | null,
): LiveCategoryStats[] {
  const buckets = new Map<
    IncidentCategory,
    { count: number; lastAt: string | null; lastOffsetSec: number | null }
  >();

  for (const cat of INCIDENT_CATEGORIES) {
    buckets.set(cat, { count: 0, lastAt: null, lastOffsetSec: null });
  }

  for (const inc of incidents) {
    const category = normalizeLiveIncidentType(inc.type);
    if (!buckets.has(category)) {
      buckets.set(category, { count: 0, lastAt: null, lastOffsetSec: null });
    }
    const bucket = buckets.get(category)!;
    bucket.count += 1;
    const offset = incidentOffsetSec(inc, snapshots, session);
    const prev = bucket.lastAt ? Date.parse(bucket.lastAt) : 0;
    const next = Date.parse(inc.capturedAt);
    if (!bucket.lastAt || (Number.isFinite(next) && next >= prev)) {
      bucket.lastAt = inc.capturedAt;
      bucket.lastOffsetSec = offset;
    }
  }

  return INCIDENT_CATEGORIES.map((category) => {
    const b = buckets.get(category)!;
    return {
      category,
      count: b.count,
      lastAt: b.lastAt,
      lastOffsetSec: b.lastOffsetSec,
    };
  });
}
