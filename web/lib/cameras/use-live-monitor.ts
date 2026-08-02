"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  LiveAnalysisSnapshot,
  LiveDashboardResponse,
  LiveIncidentMoment,
  LiveMonitorSession,
} from "@/lib/cameras/live-analysis-types";
import {
  exportLiveSessionAsLesson,
  fetchLiveDashboard,
  fetchLiveSessionList,
  startLiveMonitoring,
  stopLiveMonitoring,
} from "@/lib/cameras/live-monitor-client";

function applyDashboard(
  dash: LiveDashboardResponse,
  setters: {
    setSession: (s: LiveMonitorSession | null) => void;
    setIsMonitoring: (v: boolean) => void;
    setSnapshots: (s: LiveAnalysisSnapshot[]) => void;
    setIncidents: (i: LiveIncidentMoment[]) => void;
  },
) {
  setters.setSession(dash.session);
  setters.setIsMonitoring(dash.isMonitoring);
  setters.setSnapshots(dash.snapshots);
  setters.setIncidents(dash.incidents);
}

export function useLiveMonitor(
  deviceId: string | null,
  hlsUrl: string | null,
  cameraId: string | null,
  selectedSessionId: string | null = null,
  archiveOnly = false,
) {
  const [session, setSession] = useState<LiveMonitorSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<LiveMonitorSession[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [snapshots, setSnapshots] = useState<LiveAnalysisSnapshot[]>([]);
  const [incidents, setIncidents] = useState<LiveIncidentMoment[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(
    async (sessionIdOverride?: string | null | undefined) => {
      if (!deviceId) return;
      const sessionId =
        sessionIdOverride !== undefined ? sessionIdOverride : selectedSessionId;
      try {
        const [dash, list] = await Promise.all([
          fetchLiveDashboard(deviceId, {
            sessionId,
            snapshotLimit: 120,
            incidentLimit: 80,
          }),
          fetchLiveSessionList(deviceId, 20),
        ]);
        if (!mounted.current) return;
        applyDashboard(dash, { setSession, setIsMonitoring, setSnapshots, setIncidents });
        setSessionHistory(list.sessions);
        setError(null);
      } catch (e) {
        if (!mounted.current) return;
        setError(e instanceof Error ? e.message : "Ошибка загрузки");
      }
    },
    [deviceId, selectedSessionId],
  );

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!deviceId) {
      setSession(null);
      setIsMonitoring(false);
      setSnapshots([]);
      setIncidents([]);
      setSessionHistory([]);
      return;
    }
    setLoading(true);
    void refresh().finally(() => {
      if (mounted.current) setLoading(false);
    });
  }, [deviceId, refresh]);

  useEffect(() => {
    if (archiveOnly || !deviceId || isMonitoring) return;
    const id = setInterval(() => void refresh(), 8_000);
    return () => clearInterval(id);
  }, [deviceId, refresh, isMonitoring, archiveOnly]);

  useEffect(() => {
    if (archiveOnly || !deviceId || !isMonitoring) return;

    let es: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let retryAttempt = 0;
    let cancelled = false;

    const buildStreamUrl = () => {
      const params = new URLSearchParams({ deviceId });
      const streamSessionId =
        session?.status === "running" ? session.id : selectedSessionId;
      if (streamSessionId) params.set("sessionId", streamSessionId);
      return `/api/live/dashboard/stream?${params.toString()}`;
    };

    const connect = () => {
      if (cancelled) return;
      es?.close();
      es = new EventSource(buildStreamUrl());
      es.onmessage = (ev) => {
        retryAttempt = 0;
        try {
          const dash = JSON.parse(ev.data) as LiveDashboardResponse;
          if (!mounted.current) return;
          applyDashboard(dash, { setSession, setIsMonitoring, setSnapshots, setIncidents });
        } catch {
          /* ignore malformed */
        }
      };
      es.onerror = () => {
        es?.close();
        es = null;
        if (cancelled) return;
        const delayMs = Math.min(30_000, 1000 * 2 ** retryAttempt);
        retryAttempt += 1;
        retryTimer = setTimeout(connect, delayMs);
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      es?.close();
    };
  }, [deviceId, isMonitoring, selectedSessionId, session?.id, session?.status, archiveOnly]);

  const start = useCallback(async () => {
    if (!deviceId || !hlsUrl || !cameraId) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await startLiveMonitoring({ deviceId, cameraId, hlsUrl });
      setSession(res.session);
      setIsMonitoring(res.isMonitoring);
      setActionLoading(false);
      void refresh(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось запустить");
      setActionLoading(false);
    }
  }, [deviceId, hlsUrl, cameraId, refresh]);

  const stop = useCallback(async () => {
    if (!deviceId) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await stopLiveMonitoring(deviceId);
      setSession(res.session);
      setIsMonitoring(false);
      setActionLoading(false);
      void refresh(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось остановить");
      setActionLoading(false);
    }
  }, [deviceId, refresh]);

  const exportAsLesson = useCallback(
    async (title?: string) => {
      const sid = session?.id ?? selectedSessionId;
      if (!sid) return null;
      setExportLoading(true);
      setError(null);
      try {
        const res = await exportLiveSessionAsLesson(sid, title);
        return res.lessonId;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Не удалось создать урок");
        return null;
      } finally {
        setExportLoading(false);
      }
    },
    [session?.id, selectedSessionId],
  );

  const latest = snapshots[0] ?? null;

  return {
    session,
    sessionHistory,
    isMonitoring,
    snapshots,
    incidents,
    latest,
    loading,
    actionLoading,
    exportLoading,
    error,
    start,
    stop,
    refresh,
    exportAsLesson,
  };
}
