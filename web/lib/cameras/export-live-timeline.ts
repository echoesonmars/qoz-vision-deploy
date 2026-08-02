import type { LiveTimelineMarker } from "@/lib/cameras/live-session-events";
import type { EngagementMarker } from "@/lib/cameras/live-engagement-markers";

export function exportTimelineJson(input: {
  sessionId: string;
  deviceId: string;
  incidentMarkers: LiveTimelineMarker[];
  engagementDrops: EngagementMarker[];
}): string {
  return JSON.stringify(
    {
      sessionId: input.sessionId,
      deviceId: input.deviceId,
      exportedAt: new Date().toISOString(),
      incidents: input.incidentMarkers,
      engagementDrops: input.engagementDrops,
    },
    null,
    2,
  );
}

export function exportTimelineCsv(input: {
  incidentMarkers: LiveTimelineMarker[];
  engagementDrops: EngagementMarker[];
}): string {
  const lines = [
    "kind,offset_sec,category_or_score,description,confidence,captured_at",
  ];
  for (const m of input.incidentMarkers) {
    lines.push(
      [
        "incident",
        String(m.offsetSec),
        m.category,
        `"${m.description.replace(/"/g, '""')}"`,
        m.confidence,
        m.capturedAt,
      ].join(","),
    );
  }
  for (const e of input.engagementDrops) {
    lines.push(
      [
        "engagement_drop",
        String(e.offsetSec),
        String(e.score),
        `"drop from ${e.dropFrom}%"`,
        "",
        e.capturedAt,
      ].join(","),
    );
  }
  return lines.join("\n");
}

export function downloadTextFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
