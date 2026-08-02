import type { FastifyBaseLogger } from "fastify";

export const LIVE_RETENTION_DAYS = 0;

export function getLiveRetentionCutoff(sinceIso?: string | null): Date {
  if (sinceIso) {
    const parsed = Date.parse(sinceIso);
    if (Number.isFinite(parsed)) return new Date(parsed);
  }
  return new Date(0);
}

export async function pruneOldLiveData(): Promise<{
  snapshots: number;
  incidents: number;
  sessions: number;
}> {
  return { snapshots: 0, incidents: 0, sessions: 0 };
}

export function startRetentionScheduler(_log: FastifyBaseLogger): void {
  /* live data retention disabled — snapshots/sessions are kept indefinitely */
}
