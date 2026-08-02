"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  FleetSituationItem,
  FleetSituationsPageResponse,
} from "@/lib/cameras/live-analysis-types";
import type { IncidentCategory } from "@/lib/incidents-types";

const PAGE_SIZE = 40;

export function useFleetSituationCategory(category: IncidentCategory) {
  const [items, setItems] = useState<FleetSituationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [retentionDays, setRetentionDays] = useState(0);
  const [since, setSince] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const offsetRef = useRef(0);
  const sinceRef = useRef<string | null>(null);

  const fetchPage = useCallback(
    async (offset: number, append: boolean) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const params = new URLSearchParams({
          category,
          limit: String(PAGE_SIZE),
          offset: String(offset),
        });
        if (sinceRef.current) params.set("since", sinceRef.current);
        const res = await fetch(`/api/live/fleet/situations?${params.toString()}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as FleetSituationsPageResponse & { error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? res.statusText);
        }
        setItems((prev) => (append ? [...prev, ...data.incidents] : data.incidents));
        setTotal(data.total);
        setHasMore(data.hasMore);
        setRetentionDays(data.retentionDays);
        setSince(data.since);
        sinceRef.current = data.since;
        offsetRef.current = offset + data.incidents.length;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Не удалось загрузить список");
        if (!append) setItems([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category],
  );

  useEffect(() => {
    offsetRef.current = 0;
    sinceRef.current = null;
    void fetchPage(0, false);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    void fetchPage(offsetRef.current, true);
  }, [fetchPage, hasMore, loading, loadingMore]);

  const reload = useCallback(() => {
    offsetRef.current = 0;
    sinceRef.current = null;
    void fetchPage(0, false);
  }, [fetchPage]);

  const removeJournalIncident = useCallback((incidentId: string) => {
    setItems((prev) =>
      prev.filter((item) => {
        if (item.source !== "journal") return true;
        return item.incidentId !== incidentId;
      }),
    );
    setTotal((value) => Math.max(0, value - 1));
  }, []);

  return {
    items,
    total,
    retentionDays,
    since,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    reload,
    removeJournalIncident,
  };
}
