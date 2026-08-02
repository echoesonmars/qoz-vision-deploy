import type {
  SafetyAntibullyingData,
  SafetyDailyRow,
  SafetyLocationRow,
} from "@/lib/analytics/types";

const typeTotals: Record<string, number> = {
  "bullying-1": 6,
  "bullying-2": 1,
  "bullying-3": 12,
  "fight-2": 3,
  "fight-3": 146,
  "fight-5": 13,
  laying: 5,
  normal: 106,
  playing: 169,
};

const byType = Object.entries(typeTotals).map(([key, value]) => ({
  key,
  label: key,
  value,
}));

const locations: SafetyLocationRow[] = [
  {
    locationId: "akt-zal",
    label: "Акт_зал",
    incidents: 165,
    videoCount: 420,
    byType: { "fight-3": 37, normal: 33, playing: 91, "fight-5": 4 },
  },
  {
    locationId: "sportzal-2",
    label: "Спортзал_2",
    incidents: 120,
    videoCount: 310,
    byType: { "fight-3": 29, normal: 25, playing: 54, "bullying-3": 12 },
  },
  {
    locationId: "2-et-3-blok",
    label: "2_эт_3_блок",
    incidents: 90,
    videoCount: 185,
    byType: { "fight-3": 42, normal: 28, playing: 12, "bullying-1": 8 },
  },
  {
    locationId: "kovorking-3",
    label: "Коворкинг_3_эт",
    incidents: 30,
    videoCount: 95,
    byType: { "fight-3": 18, normal: 10, playing: 2 },
  },
];

const byLocation = locations.map((l) => ({
  key: l.locationId,
  label: l.label,
  value: l.incidents,
}));

function cellStatus(count: number): "ok" | "warning" | "critical" {
  if (count >= 40) return "critical";
  if (count >= 15) return "warning";
  return "ok";
}

const matrix = locations.flatMap((loc) =>
  Object.entries(loc.byType).map(([incidentType, count]) => ({
    locationId: loc.locationId,
    incidentType,
    count,
    status: cellStatus(count),
  })),
);

const byDay: SafetyDailyRow[] = [
  { date: "2026-01-19", label: "19 янв", playing: 8, normal: 5, "fight-3": 12 },
  { date: "2026-01-20", label: "20 янв", playing: 6, normal: 4, "fight-3": 10, "bullying-3": 2 },
  { date: "2026-01-21", label: "21 янв", playing: 10, normal: 6, "fight-3": 15 },
  { date: "2026-01-22", label: "22 янв", playing: 7, normal: 5, "fight-3": 11, laying: 1 },
  { date: "2026-01-23", label: "23 янв", playing: 9, normal: 4, "fight-3": 14, "fight-5": 2 },
  { date: "2026-01-24", label: "24 янв", playing: 5, normal: 3, "fight-3": 8 },
  { date: "2026-01-25", label: "25 янв", playing: 4, normal: 2, "fight-3": 6 },
  { date: "2026-01-26", label: "26 янв", playing: 8, normal: 5, "fight-3": 12, "bullying-1": 1 },
  { date: "2026-01-27", label: "27 янв", playing: 11, normal: 6, "fight-3": 16 },
  { date: "2026-01-28", label: "28 янв", playing: 9, normal: 5, "fight-3": 13, "bullying-3": 3 },
  { date: "2026-01-29", label: "29 янв", playing: 7, normal: 4, "fight-3": 10 },
  { date: "2026-01-30", label: "30 янв", playing: 6, normal: 3, "fight-3": 9 },
  { date: "2026-01-31", label: "31 янв", playing: 5, normal: 2, "fight-3": 7 },
  { date: "2026-02-01", label: "1 фев", playing: 12, normal: 7, "fight-3": 18, "fight-5": 3 },
  { date: "2026-02-02", label: "2 фев", playing: 10, normal: 6, "fight-3": 15 },
  { date: "2026-02-03", label: "3 фев", playing: 8, normal: 5, "fight-3": 12 },
  { date: "2026-02-04", label: "4 фев", playing: 7, normal: 4, "fight-3": 11 },
  { date: "2026-02-05", label: "5 фев", playing: 9, normal: 5, "fight-3": 14 },
  { date: "2026-02-06", label: "6 фев", playing: 11, normal: 6, "fight-3": 17 },
  { date: "2026-02-07", label: "7 фев", playing: 13, normal: 8, "fight-3": 20, "bullying-3": 4 },
  { date: "2026-02-08", label: "8 фев", playing: 14, normal: 9, "fight-3": 22, "fight-5": 2 },
  { date: "2026-02-09", label: "9 фев", playing: 10, normal: 6, "fight-3": 16 },
  { date: "2026-02-10", label: "10 фев", playing: 8, normal: 5, "fight-3": 13 },
  { date: "2026-02-11", label: "11 фев", playing: 7, normal: 4, "fight-3": 11 },
  { date: "2026-02-12", label: "12 фев", playing: 6, normal: 3, "fight-3": 9 },
  { date: "2026-02-13", label: "13 фев", playing: 5, normal: 3, "fight-3": 8 },
  { date: "2026-02-14", label: "14 фев", playing: 4, normal: 2, "fight-3": 6 },
  { date: "2026-02-15", label: "15 фев", playing: 12, normal: 7, "fight-3": 19 },
  { date: "2026-02-16", label: "16 фев", playing: 9, normal: 5, "fight-3": 14 },
  { date: "2026-02-17", label: "17 фев", playing: 8, normal: 4, "fight-3": 12 },
  { date: "2026-02-18", label: "18 фев", playing: 7, normal: 4, "fight-3": 10 },
  { date: "2026-02-19", label: "19 фев", playing: 6, normal: 3, "fight-3": 9 },
  { date: "2026-02-20", label: "20 фев", playing: 5, normal: 3, "fight-3": 8 },
  { date: "2026-02-21", label: "21 фев", playing: 4, normal: 2, "fight-3": 7 },
  { date: "2026-02-22", label: "22 фев", playing: 6, normal: 3, "fight-3": 10 },
  { date: "2026-02-23", label: "23 фев", playing: 5, normal: 3, "fight-3": 8 },
  { date: "2026-02-24", label: "24 фев", playing: 4, normal: 2, "fight-3": 7 },
  { date: "2026-02-25", label: "25 фев", playing: 3, normal: 2, "fight-3": 6 },
  { date: "2026-02-26", label: "26 фев", playing: 4, normal: 2, "fight-3": 7 },
  { date: "2026-02-27", label: "27 фев", playing: 5, normal: 3, "fight-3": 8 },
  { date: "2026-02-28", label: "28 фев", playing: 6, normal: 3, "fight-3": 9 },
  { date: "2026-03-01", label: "1 мар", playing: 7, normal: 4, "fight-3": 11, "bullying-2": 1 },
];

export const safetyAntibullyingData: SafetyAntibullyingData = {
  byDay,
  byType,
  byLocation,
  locations,
  matrix,
  typeTotals,
};
