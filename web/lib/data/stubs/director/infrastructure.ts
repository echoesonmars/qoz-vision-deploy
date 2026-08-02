import type { DirectorPeriod, InfrastructureBlock, Room } from "@/lib/director/types";
import { formatCountWithShare } from "@/lib/director/format-metric-value";
import { getPeriodScale } from "@/lib/data/stubs/director/periods";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import { DIRECTOR_SCHOOL_ROOM_COUNT } from "@/lib/director/school-scale";

export const mockRooms: Room[] = [
  {
    id: "304",
    number: "304",
    floor: 3,
    wifiStatus: "offline",
    equipment: "Панель, камера, микрофон",
    readiness: "critical",
  },
  {
    id: "201",
    number: "201",
    floor: 2,
    wifiStatus: "stable",
    equipment: "Панель, проектор",
    readiness: "repair",
  },
  {
    id: "105",
    number: "105",
    floor: 1,
    wifiStatus: "stable",
    equipment: "Полный AI Classroom",
    readiness: "ready",
  },
  {
    id: "102",
    number: "102",
    floor: 1,
    wifiStatus: "unstable",
    equipment: "Wi-Fi, панель",
    readiness: "needs_equipment",
  },
];

export function buildInfrastructureBlock(
  period: DirectorPeriod,
  camerasOnlinePercent?: number,
): InfrastructureBlock {
  void period;
  return {
    wifiCoveragePercent: 93,
    aiClassroomReadyPercent: 71,
    openRepairTickets: getPeriodScale(period).techIssues + 1,
    camerasOnlinePercent: camerasOnlinePercent ?? 93,
    internetSpeedMbps: 54,
    rooms: mockRooms,
  };
}

export function buildTechIssuesMetric(period: DirectorPeriod) {
  const count = getPeriodScale(period).techIssues;
  return {
    key: "tech_issues" as const,
    label: "Тех. проблемы",
    value: formatCountWithShare(count, DIRECTOR_SCHOOL_ROOM_COUNT, 0),
    context: count === 0 ? "Все кабинеты в норме" : `${count} каб. требуют внимания`,
    status: count === 0 ? ("ok" as const) : ("warning" as const),
    href: `${DIRECTOR_PATHS.rooms}?filter=issues`,
    source: "qoz_vision" as const,
  };
}
