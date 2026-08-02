"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildCameraHlsUrl, getCameraStreamKey } from "@/lib/cameras/cameras-registry";
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import {
  startLiveMonitoring,
  stopLiveMonitoring,
} from "@/lib/cameras/live-monitor-client";

export type LiveSessionMutationError = {
  deviceId: string;
  message: string;
};

type UseLiveSessionMutationOptions = {
  onSuccess?: () => void | Promise<void>;
  isMonitoring?: (deviceId: string) => boolean;
};

export function useLiveSessionMutation(options: UseLiveSessionMutationOptions = {}) {
  const [loadingDeviceId, setLoadingDeviceId] = useState<string | null>(null);
  const [error, setError] = useState<LiveSessionMutationError | null>(null);
  const mounted = useRef(true);
  const onSuccessRef = useRef(options.onSuccess);
  const isMonitoringRef = useRef(options.isMonitoring);
  onSuccessRef.current = options.onSuccess;
  isMonitoringRef.current = options.isMonitoring;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const clearError = useCallback((deviceId?: string) => {
    setError((prev) => {
      if (!prev) return null;
      if (deviceId && prev.deviceId !== deviceId) return prev;
      return null;
    });
  }, []);

  const start = useCallback(async (camera: CameraRecord) => {
    const deviceId = getCameraStreamKey(camera);
    const hlsUrl = buildCameraHlsUrl(camera);
    if (!hlsUrl) {
      setError({ deviceId, message: "HLS URL недоступен" });
      return;
    }
    setLoadingDeviceId(deviceId);
    setError(null);
    try {
      await startLiveMonitoring({ deviceId, cameraId: camera.id, hlsUrl });
      await onSuccessRef.current?.();
    } catch (e) {
      if (!mounted.current) return;
      setError({
        deviceId,
        message: e instanceof Error ? e.message : "Не удалось запустить",
      });
    } finally {
      if (mounted.current) setLoadingDeviceId(null);
    }
  }, []);

  const stop = useCallback(async (deviceId: string) => {
    setLoadingDeviceId(deviceId);
    setError(null);
    try {
      await stopLiveMonitoring(deviceId);
      await onSuccessRef.current?.();
    } catch (e) {
      if (!mounted.current) return;
      setError({
        deviceId,
        message: e instanceof Error ? e.message : "Не удалось остановить",
      });
    } finally {
      if (mounted.current) setLoadingDeviceId(null);
    }
  }, []);

  const toggle = useCallback(
    async (camera: CameraRecord) => {
      const deviceId = getCameraStreamKey(camera);
      const monitoring = isMonitoringRef.current?.(deviceId) ?? false;
      if (monitoring) {
        await stop(deviceId);
      } else {
        await start(camera);
      }
    },
    [start, stop],
  );

  return {
    loadingDeviceId,
    error,
    clearError,
    start,
    stop,
    toggle,
  };
}
