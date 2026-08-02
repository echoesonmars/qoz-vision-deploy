export type StudentPerformanceBand = "high" | "mid" | "low";

export type StudentRow = {
  id: string;
  name: string;
  parallel: string;
  className: string;
  performanceBand: StudentPerformanceBand;
  earlyWarning: boolean;
};

const PERFORMANCE_STUDENT_NAMES = [
  "Алимбеков Д.",
  "Бекенова М.",
  "Волков И.",
  "Газиева К.",
  "Даулетов Р.",
  "Ермекова С.",
  "Жумабаев Т.",
  "Ибрагимова Л.",
  "Касымов Н.",
  "Муратова А.",
  "Нурланов Б.",
  "Омарова Д.",
  "Петров Е.",
  "Рахимова Ф.",
  "Садыков Г.",
  "Тлеуберген Х.",
  "Усенова Ц.",
  "Хасенов Ч.",
  "Шарипова Э.",
  "Ыдырысов Ж.",
  "Абдуллин К.",
  "Байжанова Л.",
  "Воронов П.",
  "Григорьева Н.",
  "Досов А.",
  "Есенова Р.",
];

function bandForIndex(i: number): StudentPerformanceBand {
  if (i < 8) return "high";
  if (i < 18) return "mid";
  return "low";
}

export const studentsRosterRows: StudentRow[] = PERFORMANCE_STUDENT_NAMES.map((name, i) => ({
  id: `perf-${String(i + 1).padStart(2, "0")}`,
  name,
  parallel: i < 10 ? "10" : "11",
  className: i < 10 ? "10«А»" : "11«Б»",
  performanceBand: bandForIndex(i),
  earlyWarning: i >= 18,
}));

export type TwinWorkBox = {
  id: string;
  left: string;
  top: string;
  width: string;
  height: string;
  variant: "correct" | "wrong";
};

export type StudentTwinData = {
  gpa: number;
  works: { id: string; title: string; score: number; max: number }[];
  scanBoxes: TwinWorkBox[];
  masteredTopics: string[];
  gapTopics: string[];
  visionSeries: { week: string; focusPercent: number }[];
  prescriptionItems: string[];
};

const defaultTwin: StudentTwinData = {
  gpa: 3.8,
  works: [{ id: "w1", title: "Срез Sozley", score: 14, max: 20 }],
  scanBoxes: [
    { id: "b1", left: "10%", top: "20%", width: "35%", height: "12%", variant: "correct" },
  ],
  masteredTopics: ["Базовые темы ГОСО"],
  gapTopics: ["Требует повторения"],
  visionSeries: [
    { week: "Нед. 1", focusPercent: 62 },
    { week: "Нед. 2", focusPercent: 65 },
    { week: "Нед. 3", focusPercent: 68 },
    { week: "Нед. 4", focusPercent: 64 },
  ],
  prescriptionItems: ["Адаптивное задание в банке Sozley."],
};

const twinByStudent: Record<string, StudentTwinData> = {
  "perf-01": {
    gpa: 4.6,
    works: [
      { id: "w1", title: "Срез Sozley — тригонометрия", score: 18, max: 20 },
      { id: "w2", title: "Домашняя №12", score: 9, max: 10 },
    ],
    scanBoxes: [
      { id: "b1", left: "10%", top: "20%", width: "35%", height: "12%", variant: "correct" },
      { id: "b2", left: "48%", top: "24%", width: "30%", height: "14%", variant: "wrong" },
    ],
    masteredTopics: ["Квадратные уравнения", "Векторы в плоскости"],
    gapTopics: ["Параметрические системы"],
    visionSeries: [
      { week: "Нед. 1", focusPercent: 72 },
      { week: "Нед. 2", focusPercent: 68 },
      { week: "Нед. 3", focusPercent: 81 },
      { week: "Нед. 4", focusPercent: 76 },
    ],
    prescriptionItems: [
      "Повторить цепное правило дифференцирования (микро-модуль А3).",
      "Две адаптивные домашние в банке Sozley по параметрам.",
    ],
  },
  "perf-02": {
    gpa: 3.9,
    works: [{ id: "w1", title: "Контрольная — ОВР", score: 12, max: 20 }],
    scanBoxes: [
      { id: "b1", left: "15%", top: "18%", width: "40%", height: "20%", variant: "wrong" },
    ],
    masteredTopics: ["Основы ОВР"],
    gapTopics: ["Баланс в молярных соотношениях", "Тригонометрия (связь с физикой)"],
    visionSeries: [
      { week: "Нед. 1", focusPercent: 45 },
      { week: "Нед. 2", focusPercent: 52 },
      { week: "Нед. 3", focusPercent: 48 },
      { week: "Нед. 4", focusPercent: 41 },
    ],
    prescriptionItems: [
      "Снижение фона тревоги на уроке: укороченные спринты 7 мин.",
      "Назначить тренажёр по ОВР с подсказками первого уровня.",
    ],
  },
};

export function getStudentTwin(studentId: string): StudentTwinData {
  return twinByStudent[studentId] ?? defaultTwin;
}
