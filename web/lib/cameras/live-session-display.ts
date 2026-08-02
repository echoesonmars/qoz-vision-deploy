export function isRecentLiveSession(
  startedAt: string | null | undefined,
  maxAgeMs = 2 * 60 * 60 * 1000,
): boolean {
  if (!startedAt) return false;
  const t = new Date(startedAt).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t <= maxAgeMs;
}
