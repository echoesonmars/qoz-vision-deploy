import type { RoomReadinessStatus } from "@/lib/director/types";

export function getRoomDetail(roomId: string) {
  const rooms: Record<
    string,
    {
      number: string;
      floor: number;
      readiness: RoomReadinessStatus;
      equipment: { name: string; ok: boolean }[];
      tickets: { id: string; title: string; status: string; date: string }[];
      schedule: { slot: string; subject: string; teacher: string }[];
      cameraHref: string;
    }
  > = {
    "304": {
      number: "304",
      floor: 3,
      readiness: "critical",
      equipment: [
        { name: "Wi-Fi", ok: false },
        { name: "Панель", ok: true },
        { name: "Камера", ok: true },
        { name: "Микрофон", ok: false },
      ],
      tickets: [
        { id: "t1", title: "Нет стабильного Wi-Fi", status: "open", date: "05.06.2026" },
      ],
      schedule: [
        { slot: "2 урок", subject: "Физика", teacher: "Касымова А. С." },
        { slot: "4 урок", subject: "Алгебра", teacher: "Садыков М. Р." },
      ],
      cameraHref: "/dashboard/cameras/live",
    },
    "201": {
      number: "201",
      floor: 2,
      readiness: "repair",
      equipment: [
        { name: "Wi-Fi", ok: true },
        { name: "Панель", ok: false },
        { name: "Камера", ok: true },
        { name: "Микрофон", ok: true },
      ],
      tickets: [
        { id: "t2", title: "Проектор не включается", status: "in_progress", date: "03.06.2026" },
      ],
      schedule: [{ slot: "3 урок", subject: "Химия", teacher: "Ахметова Н. К." }],
      cameraHref: "/dashboard/cameras/live",
    },
    "105": {
      number: "105",
      floor: 1,
      readiness: "ready",
      equipment: [
        { name: "Wi-Fi", ok: true },
        { name: "Панель", ok: true },
        { name: "Камера", ok: true },
        { name: "Микрофон", ok: true },
      ],
      tickets: [],
      schedule: [{ slot: "1 урок", subject: "Математика", teacher: "Садыков М. Р." }],
      cameraHref: "/dashboard/cameras/live",
    },
    "102": {
      number: "102",
      floor: 1,
      readiness: "needs_equipment",
      equipment: [
        { name: "Wi-Fi", ok: true },
        { name: "Панель", ok: true },
        { name: "Камера", ok: false },
        { name: "Микрофон", ok: false },
      ],
      tickets: [],
      schedule: [],
      cameraHref: "/dashboard/cameras/all",
    },
  };
  return rooms[roomId] ?? null;
}

export const ROOM_STATUS_LABELS: Record<RoomReadinessStatus, string> = {
  ready: "Готов",
  needs_equipment: "Требуется дооснащение",
  repair: "Ремонт",
  critical: "Критично",
};
