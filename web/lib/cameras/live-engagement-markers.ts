import type { LiveAnalysisSnapshot } from "@/lib/cameras/live-analysis-types";

export type EngagementMarker = {
  id: string;
  offsetSec: number;
  score: number;
  dropFrom: number;
  capturedAt: string;
};

const DEFAULT_DROP_THRESHOLD = 15;

export function buildEngagementMarkers(
  snapshots: LiveAnalysisSnapshot[],
  dropThreshold = DEFAULT_DROP_THRESHOLD,
): EngagementMarker[] {
  const sorted = [...snapshots]
    .filter((s) => s.sessionOffsetSec != null)
    .sort((a, b) => (a.sessionOffsetSec ?? 0) - (b.sessionOffsetSec ?? 0));
  const markers: EngagementMarker[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]!;
    const cur = sorted[i]!;
    const prevScore =
      prev.engagementScore ?? prev.payload.analytics_meta.overall_engagement_score;
    const curScore =
      cur.engagementScore ?? cur.payload.analytics_meta.overall_engagement_score;
    const drop = prevScore - curScore;
    if (drop >= dropThreshold) {
      markers.push({
        id: cur.id,
        offsetSec: cur.sessionOffsetSec ?? 0,
        score: Math.round(curScore),
        dropFrom: Math.round(prevScore),
        capturedAt: cur.capturedAt,
      });
    }
  }
  return markers;
}

export function buildEngagementTrackPoints(
  snapshots: LiveAnalysisSnapshot[],
): { offsetSec: number; score: number; id: string }[] {
  return [...snapshots]
    .filter((s) => s.sessionOffsetSec != null)
    .sort((a, b) => (a.sessionOffsetSec ?? 0) - (b.sessionOffsetSec ?? 0))
    .map((s) => ({
      id: s.id,
      offsetSec: s.sessionOffsetSec ?? 0,
      score: Math.round(
        s.engagementScore ?? s.payload.analytics_meta.overall_engagement_score,
      ),
    }));
}
