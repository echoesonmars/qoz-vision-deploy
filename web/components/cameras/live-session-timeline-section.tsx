"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LiveSessionTimelineTrack } from "@/components/cameras/live-session-timeline-track";
import { checksCardHeader, checksCardInteractive, summaryKicker } from "@/components/dashboard/summary-card-shell";
import { formatOffset } from "@/lib/cameras/format-live-time";
import type { LiveTimelineMarker } from "@/lib/cameras/live-session-events";
import { MdTimeline } from "react-icons/md";
import { cn } from "@/lib/utils";

type LiveSessionTimelineSectionProps = {
  markers: LiveTimelineMarker[];
  durationSec: number;
  selectedMarkerId: string | null;
  onSelectMarker: (id: string) => void;
  isMonitoring: boolean;
};

export function LiveSessionTimelineSection({
  markers,
  durationSec,
  selectedMarkerId,
  onSelectMarker,
  isMonitoring,
}: LiveSessionTimelineSectionProps) {
  return (
    <Card className={cn(checksCardInteractive, "flex flex-col")}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdTimeline className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Таймлайн сессии
        </p>
        <CardTitle className="text-lg font-semibold">События на шкале времени</CardTitle>
        <CardDescription>
          {isMonitoring
            ? "Маркеры по offset от старта мониторинга"
            : "Запустите отслеживание, чтобы строить таймлайн"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <LiveSessionTimelineTrack
          markers={markers}
          durationSec={durationSec}
          selectedMarkerId={selectedMarkerId}
          onSelectMarker={onSelectMarker}
        />
        <p className="text-muted-foreground text-xs tabular-nums">
          Длительность сессии: {formatOffset(durationSec)}
          {markers.length > 0 ? ` · событий: ${markers.length}` : null}
        </p>
      </CardContent>
    </Card>
  );
}
