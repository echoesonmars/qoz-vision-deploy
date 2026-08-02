import type { DirectorPeriod, SecurityBlock, SecurityEvent } from "@/lib/director/types";
import { formatCountWithShare } from "@/lib/director/format-metric-value";
import { getPeriodScale } from "@/lib/data/stubs/director/periods";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import { DIRECTOR_SCHOOL_CLASS_COUNT } from "@/lib/director/school-scale";

export const mockMonitoringZones = [
  { id: "z-entrance", name: "Входная группа", allowed: true },
  { id: "z-corridor-2", name: "Коридор 2 этажа", allowed: true },
  { id: "z-canteen", name: "Столовая", allowed: true },
  { id: "z-yard", name: "Школьный двор", allowed: true },
  { id: "z-locker", name: "Раздевалка", allowed: false },
  { id: "z-toilet", name: "Туалет", allowed: false },
  { id: "z-psych", name: "Кабинет психолога", allowed: false },
];

const baseEvents: SecurityEvent[] = [
  {
    id: "sec-1",
    type: "intruder",
    zoneId: "z-entrance",
    zoneName: "Входная группа",
    description: "Лицо без сопровождения у турникета",
    occurredAt: "2026-06-05T10:42:00+06:00",
    workflowStatus: "new",
    source: "skud",
  },
  {
    id: "sec-2",
    type: "conflict",
    zoneId: "z-yard",
    zoneName: "Школьный двор",
    description: "Повышенный голос, резкие движения",
    occurredAt: "2026-06-05T09:55:00+06:00",
    workflowStatus: "reviewing",
    source: "qoz_vision",
  },
  {
    id: "sec-3",
    type: "crowd",
    zoneId: "z-corridor-2",
    zoneName: "Коридор 2 этажа",
    description: "Скопление >12 учеников более 4 мин",
    occurredAt: "2026-06-04T14:20:00+06:00",
    workflowStatus: "forwarded",
    source: "qoz_vision",
  },
  {
    id: "sec-4",
    type: "left_item",
    zoneId: "z-entrance",
    zoneName: "Входная группа",
    description: "Неподвижный предмет у прохода",
    occurredAt: "2026-06-04T11:10:00+06:00",
    workflowStatus: "closed",
    source: "qoz_vision",
  },
];

export function buildSecurityBlock(period: DirectorPeriod): SecurityBlock {
  const total = getPeriodScale(period).securityIncidents;
  return {
    signalCounts: {
      conflict: Math.max(1, Math.round(total * 0.25)),
      bullying: Math.max(0, Math.round(total * 0.1)),
      crowd: Math.max(1, Math.round(total * 0.3)),
      intruder: Math.max(1, Math.round(total * 0.2)),
      left_item: Math.max(0, Math.round(total * 0.1)),
      fall_injury: Math.max(0, Math.round(total * 0.05)),
    },
    recentEvents: baseEvents.slice(0, Math.min(4, Math.max(1, total))),
    totalOpen: total,
  };
}

export function getSecurityEvent(eventId: string): SecurityEvent | null {
  return baseEvents.find((e) => e.id === eventId) ?? null;
}

export const mockSecurityAuditLog: Record<
  string,
  { at: string; actor: string; action: string }[]
> = {
  "sec-1": [
    { at: "05.06 10:42", actor: "Система Qoz", action: "Сигнал зафиксирован" },
  ],
  "sec-2": [
    { at: "05.06 09:55", actor: "Система Qoz", action: "Сигнал зафиксирован" },
    { at: "05.06 10:05", actor: "Завуч Ибраева", action: "Взято на проверку" },
  ],
  "sec-3": [
    { at: "04.06 14:20", actor: "Система Qoz", action: "Сигнал зафиксирован" },
    { at: "04.06 14:35", actor: "Охрана", action: "Передано психологу" },
  ],
  "sec-4": [
    { at: "04.06 11:10", actor: "Система Qoz", action: "Сигнал зафиксирован" },
    { at: "04.06 11:40", actor: "Дежурный", action: "Закрыто — ложное срабатывание" },
  ],
};

export function buildSecurityIncidentsMetric(period: DirectorPeriod) {
  const count = getPeriodScale(period).securityIncidents;
  return {
    key: "security_incidents" as const,
    label: "Инциденты безопасности",
    value: count,
    context: count === 0 ? "Норма: 0 инцидентов" : "Требуют обработки",
    status: count === 0 ? ("ok" as const) : ("critical" as const),
    href: DIRECTOR_PATHS.camerasIncidents,
    source: "qoz_vision" as const,
  };
}

export function buildDecliningClassesMetric(period: DirectorPeriod) {
  const count = getPeriodScale(period).decliningClasses;
  return {
    key: "declining_classes" as const,
    label: "Снижение успеваемости",
    value: formatCountWithShare(count, DIRECTOR_SCHOOL_CLASS_COUNT, 0),
    context: count === 0 ? "Классов со снижением нет" : `${count} класса за 2+ цикла`,
    status: count === 0 ? ("ok" as const) : ("warning" as const),
    href: "/dashboard/director/declining-classes",
    source: "journal" as const,
  };
}
