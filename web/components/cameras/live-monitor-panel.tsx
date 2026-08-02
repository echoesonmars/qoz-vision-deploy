"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LiveAnalysisSummary } from "@/components/cameras/live-analysis-summary";
import { LiveEngagementTimelineTrack } from "@/components/cameras/live-engagement-timeline-track";
import { LiveEventTimelineList } from "@/components/cameras/live-event-timeline-list";
import { LiveEventTypeGrid } from "@/components/cameras/live-event-type-grid";
import { LiveExportTimelineActions } from "@/components/cameras/live-export-timeline-actions";
import { LiveIncidentMoments } from "@/components/cameras/live-incident-moments";
import { LiveCaptureIntervalControl } from "@/components/cameras/live-capture-interval-control";
import { LiveFleetBanner } from "@/components/cameras/live-fleet-banner";
import { LiveMonitorControls } from "@/components/cameras/live-monitor-controls";
import { LiveSnapshotDebugLog } from "@/components/cameras/live-snapshot-debug-log";
import { LiveSessionHistorySelect } from "@/components/cameras/live-session-history-select";
import { LiveSessionRecordingPlayer } from "@/components/cameras/live-session-recording-player";
import { LiveSessionTimelineSection } from "@/components/cameras/live-session-timeline-section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checksCardHeader, checksCardInteractive, summaryKicker } from "@/components/dashboard/summary-card-shell";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import { buildLiveArchiveTitle } from "@/lib/live-archive-title";
import {
  buildCameraHlsUrl,
  getCameraDisplayLabel,
  getCameraStreamKey,
} from "@/lib/cameras/cameras-registry";
import { buildEngagementMarkers } from "@/lib/cameras/live-engagement-markers";
import {
  buildLiveCategoryStats,
  buildLiveTimelineMarkers,
  sessionDurationSec,
} from "@/lib/cameras/live-session-events";
import { useLiveMonitor } from "@/lib/cameras/use-live-monitor";
import type { IncidentCategory } from "@/lib/incidents-types";
import { MdList, MdSchool } from "react-icons/md";
import { cn } from "@/lib/utils";

type LiveMonitorPanelProps = {
  camera: CameraRecord | null;
  initialSessionId?: string | null;
  readOnly?: boolean;
};

export function LiveMonitorPanel({
  camera,
  initialSessionId = null,
  readOnly = false,
}: LiveMonitorPanelProps) {
  const router = useRouter();
  const deviceId = camera ? getCameraStreamKey(camera) : null;
  const hlsUrl = camera ? buildCameraHlsUrl(camera) : null;
  const cameraId = camera?.id ?? null;

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(initialSessionId);
  const monitor = useLiveMonitor(deviceId, hlsUrl, cameraId, selectedSessionId, readOnly);
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const markers = useMemo(
    () =>
      buildLiveTimelineMarkers(
        monitor.incidents,
        monitor.snapshots,
        monitor.session,
      ),
    [monitor.incidents, monitor.snapshots, monitor.session],
  );

  const engagementDrops = useMemo(
    () => buildEngagementMarkers(monitor.snapshots),
    [monitor.snapshots],
  );

  const categoryStats = useMemo(
    () =>
      buildLiveCategoryStats(
        monitor.incidents,
        monitor.snapshots,
        monitor.session,
      ),
    [monitor.incidents, monitor.snapshots, monitor.session],
  );

  const durationSec = useMemo(
    () => sessionDurationSec(monitor.session, monitor.snapshots),
    [monitor.session, monitor.snapshots],
  );

  const visibleMarkers = useMemo(() => {
    if (!selectedCategory) return markers;
    return markers.filter((m) => m.category === selectedCategory);
  }, [markers, selectedCategory]);

  const handleSelectCategory = (category: IncidentCategory | null) => {
    setSelectedCategory(category);
    setSelectedMarkerId(null);
  };

  const handleSelectMarker = (markerId: string) => {
    setSelectedMarkerId(markerId);
    const marker = markers.find((m) => m.id === markerId);
    if (marker) setSelectedCategory(marker.category);
  };

  const canExportLesson =
    monitor.session?.recordingUploadStatus === "ready" && monitor.session.id;

  const handleExportLesson = async () => {
    if (!camera) return;
    const at = monitor.session?.startedAt
      ? new Date(monitor.session.startedAt)
      : new Date();
    const title = buildLiveArchiveTitle(getCameraStreamKey(camera), at);
    const lessonId = await monitor.exportAsLesson(title);
    if (lessonId) {
      router.push(`/dashboard/cameras/engagement/${lessonId}`);
    }
  };

  if (!camera) {
    return (
      <p className="text-muted-foreground rounded-xl border border-dashed border-border/60 p-6 text-sm">
        Выберите камеру, чтобы запустить серверный мониторинг и просмотреть аналитику.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {!readOnly ? <LiveFleetBanner /> : null}
      {!readOnly && monitor.session?.needsRestart ? (
        <p className="rounded-xl border border-[var(--status-warning)]/40 bg-[var(--status-warning-muted)] px-4 py-3 text-sm text-[var(--status-warning)]">
          Сессия прервана перезапуском сервера. Запустите отслеживание снова.
        </p>
      ) : null}
      {!readOnly ? (
        <>
          <LiveMonitorControls
            session={monitor.session}
            isMonitoring={monitor.isMonitoring}
            actionLoading={monitor.actionLoading}
            disabled={!hlsUrl}
            error={monitor.error}
            onStart={async () => {
              setSelectedSessionId(null);
              await monitor.start();
            }}
            onStop={monitor.stop}
          />
          <LiveCaptureIntervalControl />
          <section className="space-y-2">
            <h2 className="text-sm font-semibold">
              История сессий · {getCameraDisplayLabel(camera)}
            </h2>
            <LiveSessionHistorySelect
              sessions={monitor.sessionHistory}
              selectedSessionId={selectedSessionId}
              onSelectSessionId={setSelectedSessionId}
            />
          </section>
        </>
      ) : null}
      <LiveSessionRecordingPlayer session={monitor.session} />
      {!readOnly && canExportLesson ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={monitor.exportLoading}
            onClick={() => void handleExportLesson()}
          >
            <MdSchool className="size-4" aria-hidden />
            {monitor.exportLoading ? "Создание урока…" : "Сохранить как урок"}
          </Button>
          <p className="text-muted-foreground self-center text-xs">
            Дублировать в архив вручную (обычно создаётся автоматически после Stop)
          </p>
        </div>
      ) : null}
      <LiveAnalysisSummary
        payload={monitor.latest?.payload ?? null}
        loading={monitor.loading}
      />
      <LiveSessionTimelineSection
        markers={visibleMarkers}
        durationSec={durationSec}
        selectedMarkerId={selectedMarkerId}
        onSelectMarker={handleSelectMarker}
        isMonitoring={monitor.isMonitoring}
      />
      <LiveEngagementTimelineTrack
        snapshots={monitor.snapshots}
        engagementDrops={engagementDrops}
        durationSec={durationSec}
        selectedId={selectedMarkerId}
        onSelect={handleSelectMarker}
      />
      {monitor.session ? (
        <LiveExportTimelineActions
          sessionId={monitor.session.id}
          deviceId={monitor.session.deviceId}
          incidentMarkers={markers}
          engagementDrops={engagementDrops}
        />
      ) : null}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Типы событий</h2>
        <LiveEventTypeGrid
          stats={categoryStats}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </section>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className={cn(checksCardInteractive, "flex min-h-0 flex-col")}>
          <CardHeader className={checksCardHeader}>
            <p className={summaryKicker}>
              <MdList className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
              Хронология
            </p>
            <CardTitle className="text-lg font-semibold">Структурированный лог</CardTitle>
            <CardDescription>События по offset и категории</CardDescription>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 pt-0">
            <LiveEventTimelineList
              markers={visibleMarkers}
              selectedMarkerId={selectedMarkerId}
              onSelectMarker={handleSelectMarker}
            />
          </CardContent>
        </Card>
        <LiveIncidentMoments
          incidents={monitor.incidents}
          filterCategory={selectedCategory}
          highlightId={selectedMarkerId}
        />
      </div>
      <LiveSnapshotDebugLog snapshots={monitor.snapshots} />
    </div>
  );
}
