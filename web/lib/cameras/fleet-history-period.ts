export function fleetHistoryPeriodLabel(retentionDays: number): string {
  return retentionDays <= 0 ? "за весь период" : `за последние ${retentionDays} дн.`;
}
