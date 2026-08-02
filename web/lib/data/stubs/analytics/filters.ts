import type { AnalyticsFilterOptions } from "@/lib/analytics/types";

export const CLASS_8B_STUDENTS = [
  { id: "s8b-01", name: "Абдуллаев А.", position: 1 },
  { id: "s8b-02", name: "Бекенова М.", position: 2 },
  { id: "s8b-03", name: "Волков И.", position: 3 },
  { id: "s8b-04", name: "Газиева К.", position: 4 },
  { id: "s8b-05", name: "Даулетов Р.", position: 5 },
  { id: "s8b-06", name: "Ермекова С.", position: 6 },
  { id: "s8b-07", name: "Жумабаев Т.", position: 7 },
  { id: "s8b-08", name: "Ибрагимова Л.", position: 8 },
  { id: "s8b-09", name: "Касымов Н.", position: 9 },
  { id: "s8b-10", name: "Муратова А.", position: 10 },
  { id: "s8b-11", name: "Нурланов Б.", position: 11 },
  { id: "s8b-12", name: "Омарова Д.", position: 12 },
  { id: "s8b-13", name: "Петров Е.", position: 13 },
  { id: "s8b-14", name: "Рахимова Ф.", position: 14 },
  { id: "s8b-15", name: "Садыков Г.", position: 15 },
  { id: "s8b-16", name: "Тлеуберген Х.", position: 16 },
  { id: "s8b-17", name: "Усенова Ц.", position: 17 },
  { id: "s8b-18", name: "Хасенов Ч.", position: 18 },
] as const;

export const analyticsFilterOptions: AnalyticsFilterOptions = {
  dates: [
    { value: "2026-02-08", label: "8 февраля 2026" },
    { value: "2026-02-07", label: "7 февраля 2026" },
    { value: "2026-02-01", label: "1 февраля 2026" },
    { value: "2026-01-21", label: "21 января 2026" },
  ],
  rooms: [
    { value: "422", label: "Кабинет 422" },
    { value: "301", label: "Кабинет 301" },
    { value: "204", label: "Кабинет 204" },
  ],
  lessons: [
    { value: "6", label: "Урок №6" },
    { value: "3", label: "Урок №3" },
    { value: "1", label: "Урок №1" },
  ],
  classes: [
    { value: "8b", label: "8 «Б»" },
    { value: "9b", label: "9 «Б»" },
    { value: "10a", label: "10 «А»" },
  ],
  students: CLASS_8B_STUDENTS.map((s) => ({
    value: s.id,
    label: `${s.position}. ${s.name}`,
    classId: "8b",
  })),
  locations: [
    { value: "akt-zal", label: "Акт_зал" },
    { value: "sportzal-2", label: "Спортзал_2" },
    { value: "2-et-3-blok", label: "2_эт_3_блок" },
    { value: "kovorking-3", label: "Коворкинг_3_эт" },
  ],
};

export const DEFAULT_ANALYTICS_FILTERS = {
  date: "2026-02-08",
  room: "422",
  lesson: "6",
  classId: "8b",
} as const;
