export type TeacherDepartment = "stem" | "humanities";

export type TeacherRow = {
  id: string;
  name: string;
  department: TeacherDepartment;
  category: string;
  classes: string;
  yearsExp: number;
};

export const teachersDirectoryRows: TeacherRow[] = [
  {
    id: "t1",
    name: "Серикова А.М.",
    department: "stem",
    category: "первая",
    classes: "10«А» мат., 11«Б» алг.",
    yearsExp: 14,
  },
  {
    id: "t2",
    name: "Нурланов Е.К.",
    department: "humanities",
    category: "высшая",
    classes: "9«В» лит., 10«Г» рус.",
    yearsExp: 22,
  },
  {
    id: "t3",
    name: "Петров И.С.",
    department: "stem",
    category: "вторая",
    classes: "10«Б» физ., 11«А» мех.",
    yearsExp: 7,
  },
  {
    id: "t4",
    name: "Омарова Л.Т.",
    department: "stem",
    category: "первая",
    classes: "8«А» мат., 9«Б» геом.",
    yearsExp: 9,
  },
  {
    id: "t5",
    name: "Жумагулова Р.Н.",
    department: "humanities",
    category: "вторая",
    classes: "11«В» история",
    yearsExp: 5,
  },
];

export type TeacherKpi = {
  verificationHoursAvg: number;
  manualEditPercent: number;
  engagementIndex: number;
};

export const teacherKpiDemo: TeacherKpi = {
  verificationHoursAvg: 2.4,
  manualEditPercent: 11,
  engagementIndex: 0.78,
};

export type TeachingLoadSlot = {
  id: string;
  subject: string;
  classLabel: string;
  hoursPerWeek: number;
  overload: "ok" | "high" | "low";
};

export const teachingLoadSlots: TeachingLoadSlot[] = [
  { id: "l1", subject: "Алгебра", classLabel: "10«А»", hoursPerWeek: 4, overload: "ok" },
  { id: "l2", subject: "Геометрия", classLabel: "10«А»", hoursPerWeek: 2, overload: "high" },
  { id: "l3", subject: "Подготовка ЕНТ", classLabel: "11«Б»", hoursPerWeek: 3, overload: "low" },
];

export type CopilotStat = {
  id: string;
  label: string;
  count: number;
};

export const copilotStats: CopilotStat[] = [
  { id: "c1", label: "Планы уроков", count: 38 },
  { id: "c2", label: "Методические листы", count: 24 },
  { id: "c3", label: "Варианты контрольных", count: 52 },
];
