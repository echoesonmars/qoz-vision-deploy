export function getAttendanceStatus(
  pct: number,
): "ok" | "warning" | "critical" {
  if (pct >= 88) return "ok";
  if (pct >= 85) return "warning";
  return "critical";
}
