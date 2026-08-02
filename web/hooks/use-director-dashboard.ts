"use client";

import { useCallback, useEffect, useState } from "react";
import type { DirectorDashboardData, DirectorPeriod } from "@/lib/director/types";

type UseDirectorDashboardResult = {
  data: DirectorDashboardData | null;
  loading: boolean;
  error: string | null;
  lastUpdatedAt: Date | null;
  refresh: () => Promise<void>;
};

export function useDirectorDashboard(
  period: DirectorPeriod,
  schoolId?: string | null,
): UseDirectorDashboardResult {
  const [data, setData] = useState<DirectorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({ period });
      if (schoolId) {
        query.set("schoolId", schoolId);
      }
      const res = await fetch(`/api/director/dashboard?${query.toString()}`, {
        cache: "no-store",
      });
      const json = (await res.json()) as DirectorDashboardData & { error?: string };
      if (!res.ok) {
        throw new Error(json.error ?? res.statusText);
      }
      setData(json);
      setLastUpdatedAt(new Date(json.lastUpdatedAt));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить дэшборд");
    } finally {
      setLoading(false);
    }
  }, [period, schoolId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    data,
    loading,
    error,
    lastUpdatedAt,
    refresh,
  };
}
