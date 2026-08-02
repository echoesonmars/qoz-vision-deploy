"use client";

import { Button } from "@/components/ui/button";
import {
  downloadTextFile,
  exportTimelineCsv,
  exportTimelineJson,
} from "@/lib/cameras/export-live-timeline";
import type { EngagementMarker } from "@/lib/cameras/live-engagement-markers";
import type { LiveTimelineMarker } from "@/lib/cameras/live-session-events";
import { MdDownload } from "react-icons/md";

type LiveExportTimelineActionsProps = {
  sessionId: string;
  deviceId: string;
  incidentMarkers: LiveTimelineMarker[];
  engagementDrops: EngagementMarker[];
};

export function LiveExportTimelineActions({
  sessionId,
  deviceId,
  incidentMarkers,
  engagementDrops,
}: LiveExportTimelineActionsProps) {
  const base = `${deviceId}-${sessionId.slice(0, 8)}`;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          const json = exportTimelineJson({
            sessionId,
            deviceId,
            incidentMarkers,
            engagementDrops,
          });
          downloadTextFile(`${base}-timeline.json`, json, "application/json");
        }}
      >
        <MdDownload className="size-4" aria-hidden />
        JSON
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          const csv = exportTimelineCsv({ incidentMarkers, engagementDrops });
          downloadTextFile(`${base}-timeline.csv`, csv, "text/csv");
        }}
      >
        <MdDownload className="size-4" aria-hidden />
        CSV
      </Button>
    </div>
  );
}
