"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LiveMonitorSession } from "@/lib/cameras/live-analysis-types";
import {
  fetchLiveSession,
  startLiveMonitoring,
  stopLiveMonitoring,
} from "@/lib/cameras/live-monitor-client";

export function useLiveMonitorActions(
  deviceId: string | null,
  hlsUrl: string | null,
  cameraId: string | null,
) {
  const [session, setSession] = useState<LiveMonitorSession | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    if (!deviceId) return;
    try {
      const sess = await fetchLiveSession(deviceId);
      if (!mounted.current) return;
      setSession(sess.session);
      setIsMonitoring(sess.isMonitoring);
      setError(null);
    } catch (e) {
      if (!mounted.current) return;
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    }
  }, [deviceId]);

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
      return;
    }
    void refresh();
  }, [deviceId, refresh]);

  const start = useCallback(async () => {
    if (!deviceId || !hlsUrl || !cameraId) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await startLiveMonitoring({ deviceId, cameraId, hlsUrl });
      setSession(res.session);
      setIsMonitoring(res.isMonitoring);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось запустить");
    } finally {
      setActionLoading(false);
    }
  }, [deviceId, hlsUrl, cameraId]);

  const stop = useCallback(async () => {
    if (!deviceId) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await stopLiveMonitoring(deviceId);
      setSession(res.session);
      setIsMonitoring(false);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось остановить");
    } finally {
      setActionLoading(false);
    }
  }, [deviceId]);

  return {
    session,
    isMonitoring,
    actionLoading,
    error,
    start,
    stop,
    refresh,
  };
}
