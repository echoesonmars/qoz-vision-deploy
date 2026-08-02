export type ExportFilterOption = { value: string; label: string };

export const exportYears: ExportFilterOption[] = [
  { value: "2025-2026", label: "2025–2026" },
  { value: "2024-2025", label: "2024–2025" },
];

export const exportQuarters: ExportFilterOption[] = [
  { value: "q1", label: "I четверть" },
  { value: "q2", label: "II четверть" },
  { value: "q3", label: "III четверть" },
  { value: "q4", label: "IV четверть" },
];

export const exportTerritories: ExportFilterOption[] = [
  { value: "astana", label: "г. Астана, район Есиль" },
  { value: "almaty", label: "г. Алматы, Медеуский р-н" },
  { value: "shymkent", label: "г. Шымкент, Абайский р-н" },
];

export const exportParallels: ExportFilterOption[] = [
  { value: "8", label: "8 класс" },
  { value: "9", label: "9 класс" },
  { value: "10", label: "10 класс" },
  { value: "11", label: "11 класс" },
];

export type ExportSchoolNode = {
  id: string;
  name: string;
  city: string;
  students: number;
  attendancePercent: number;
  avgGpa: number;
};

export const exportSchoolNodes: ExportSchoolNode[] = [
  {
    id: "nis-astana",
    name: "НИШ ФМН г. Астана",
    city: "Астана",
    students: 842,
    attendancePercent: 94.8,
    avgGpa: 3.72,
  },
  {
    id: "nis-almaty",
    name: "НИШ хим-био г. Алматы",
    city: "Алматы",
    students: 756,
    attendancePercent: 93.1,
    avgGpa: 3.65,
  },
  {
    id: "nis-shymkent",
    name: "НИШ г. Шымкент",
    city: "Шымкент",
    students: 612,
    attendancePercent: 92.4,
    avgGpa: 3.58,
  },
];

export function labelForYear(value: string): string {
  return exportYears.find((y) => y.value === value)?.label ?? value;
}

export function labelForQuarter(value: string): string {
  return exportQuarters.find((q) => q.value === value)?.label ?? value;
}

export function labelForTerritory(value: string): string {
  return exportTerritories.find((t) => t.value === value)?.label ?? value;
}

export function labelForParallel(value: string): string {
  return exportParallels.find((p) => p.value === value)?.label ?? value;
}
