"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CameraInfrastructureResponse } from "@/lib/cameras/infrastructure-types";
import {
  buildInfrastructureFleet,
  buildInfrastructureStatsFromSummary,
  buildInfrastructureSummary,
} from "@/lib/cameras/infrastructure-fleet";
import { useCameras } from "@/lib/cameras/cameras-context";
import { getPublicBackendBase } from "@/lib/cameras/cameras-registry";

export function useInfrastructureStatus(pollMs = 15_000) {
  const { cameras } = useCameras();
  const [api, setApi] = useState<CameraInfrastructureResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const base = getPublicBackendBase();
    try {
      const res = await fetch(`${base}/api/cameras/infrastructure`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as CameraInfrastructureResponse;
      setApi(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), pollMs);
    return () => clearInterval(id);
  }, [refresh, pollMs]);

  const summary = useMemo(
    () => buildInfrastructureSummary(api, cameras),
    [api, cameras],
  );
  const fleet = useMemo(() => buildInfrastructureFleet(api, cameras), [api, cameras]);
  const stats = useMemo(() => buildInfrastructureStatsFromSummary(summary), [summary]);

  return { api, summary, fleet, stats, loading, error, refresh };
}
