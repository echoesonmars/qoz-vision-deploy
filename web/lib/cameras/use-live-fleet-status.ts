"use client";

import { useCallback, useEffect, useState } from "react";
import type { LiveFleetStatus } from "@/lib/cameras/live-fleet-types";

export function useLiveFleetStatus(pollMs = 15_000) {
  const [fleet, setFleet] = useState<LiveFleetStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/live/fleet", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as LiveFleetStatus;
      setFleet(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "fleet status error");
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), pollMs);
    return () => clearInterval(id);
  }, [refresh, pollMs]);

  return { fleet, error, refresh };
}
