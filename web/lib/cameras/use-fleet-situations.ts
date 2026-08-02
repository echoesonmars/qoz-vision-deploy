"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  FleetSituationSummaryResponse,
} from "@/lib/cameras/live-analysis-types";
import type { LiveCategoryStats } from "@/lib/cameras/live-session-events";

const POLL_MS = 20_000;

export function useFleetSituations() {
  const [stats, setStats] = useState<LiveCategoryStats[]>([]);
  const [retentionDays, setRetentionDays] = useState(0);
  const [since, setSince] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch("/api/live/fleet/situations/summary", { cache: "no-store" });
      const data = (await res.json()) as FleetSituationSummaryResponse & {
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        throw new Error(data.error ?? data.message ?? res.statusText);
      }
      setStats(data.stats);
      setRetentionDays(data.retentionDays);
      setSince(data.since);
      setSummaryError(null);
    } catch (e) {
      setSummaryError(e instanceof Error ? e.message : "Не удалось загрузить сводку");
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSummary();
    const timer = setInterval(() => void fetchSummary(), POLL_MS);
    return () => clearInterval(timer);
  }, [fetchSummary]);

  return {
    stats,
    retentionDays,
    since,
    summaryLoading,
    summaryError,
    refreshSummary: fetchSummary,
  };
}
