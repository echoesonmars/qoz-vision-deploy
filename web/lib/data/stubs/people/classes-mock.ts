export type ClassHierarchyNode = {
  id: string;
  title: string;
  headTeacher: string;
  studentCount: number;
  monitor: string;
  children?: { id: string; label: string }[];
};

export const classHierarchyRoots: ClassHierarchyNode[] = [
  {
    id: "p10",
    title: "Параллель 10",
    headTeacher: "Куратор И.П.",
    studentCount: 112,
    monitor: "—",
    children: [
      { id: "10a", label: "10«А» — Староста: Алимбеков Д." },
      { id: "10b", label: "10«Б» — Староста: Уразова М." },
      { id: "10v", label: "10«В»" },
      { id: "10g", label: "10«Г»" },
    ],
  },
  {
    id: "p11",
    title: "Параллель 11",
    headTeacher: "Куратор Л.Н.",
    studentCount: 98,
    monitor: "—",
    children: [
      { id: "11a", label: "11«А»" },
      { id: "11b", label: "11«Б»" },
    ],
  },
];

export type ClassPerformanceRow = {
  id: string;
  classLabel: string;
  avgScore: number;
  blindSpot?: string;
};

export const classPerformanceRows: ClassPerformanceRow[] = [
  { id: "cp1", classLabel: "10«А»", avgScore: 4.1 },
  {
    id: "cp2",
    classLabel: "10«Б»",
    avgScore: 3.6,
    blindSpot: "Тригонометрия на срезе Sozley",
  },
  { id: "cp3", classLabel: "10«В»", avgScore: 3.9 },
];

export type ClassCameraBinding = {
  id: string;
  room: string;
  cameraId: string;
  group: string;
  slot: string;
};

export const classCameraBindings: ClassCameraBinding[] = [
  { id: "cb1", room: "301", cameraId: "Qoz-W-12", group: "10«А»", slot: "Пн 08:30–09:15" },
  { id: "cb2", room: "301", cameraId: "Qoz-W-12", group: "10«Б»", slot: "Вт 10:20–11:05" },
  { id: "cb3", room: "214", cameraId: "Qoz-W-07", group: "11«А»", slot: "Ср 09:20–10:05" },
];

export type ClassLedgerRow = {
  id: string;
  student: string;
  quarterGrade: string;
  absentDays: number;
  lateCount: number;
};

export const classLedgerRows: ClassLedgerRow[] = [
  { id: "lg1", student: "Алимбеков Д.", quarterGrade: "4.6", absentDays: 1, lateCount: 0 },
  { id: "lg2", student: "Уразова М.", quarterGrade: "3.9", absentDays: 2, lateCount: 3 },
  { id: "lg3", student: "Ким А.", quarterGrade: "3.2", absentDays: 4, lateCount: 1 },
];
