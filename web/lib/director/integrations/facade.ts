import type { DirectorPeriod, IntegrationMeta } from "@/lib/director/types";
import { integrationsRepo } from "@/lib/data/registry";
import {
  mockCasperAggregates,
  mockJournalAttendance,
  mockNctForecasts,
  mockPkModules,
  mockSkudEvents,
} from "@/lib/data/stubs/integrations/index";

export function getIntegrationMeta(): IntegrationMeta[] {
  return integrationsRepo.getIntegrationMeta();
}

export function getIntegrationLabel(source: IntegrationMeta["source"]): string {
  const row = integrationsRepo.getIntegrationMeta().find((item) => item.source === source);
  return row?.label ?? source;
}

export function formatSourceBadge(source: IntegrationMeta["source"]): string {
  const row = integrationsRepo.getIntegrationMeta().find((item) => item.source === source);
  if (!row) return "";
  return row.label;
}

export async function fetchCamerasOnlinePercent(): Promise<number | null> {
  return integrationsRepo.fetchCamerasOnlinePercent();
}

export function getPeriodRefreshHint(period: DirectorPeriod): string {
  if (period === "today") return "Обновление real-time";
  if (period === "week") return "Оперативный горизонт";
  if (period === "quarter") return "Синхронизация журнала";
  return "Годовой срез";
}

export function getIntegrationSnapshot() {
  return {
    journal: mockJournalAttendance,
    casper: mockCasperAggregates,
    skud: mockSkudEvents,
    nct: mockNctForecasts,
    pk: mockPkModules,
  };
}
