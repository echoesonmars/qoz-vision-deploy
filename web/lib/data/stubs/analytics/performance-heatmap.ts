import type { PerformanceHeatmapData, PerformanceSubject } from "@/lib/analytics/types";

const SUBJECT_LABELS: Record<PerformanceSubject, string> = {
  algebra: "Алгебра",
  biology: "Биология",
  literature: "Русская литература",
  physics: "Физика",
  chemistry: "Химия",
};

const NAMES = [
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

function seededGrade(seed: number, base: number): number {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  const r = x - Math.floor(x);
  const grade = base + (r - 0.5) * 1.2;
  return Math.round(Math.min(5, Math.max(2, grade)) * 10) / 10;
}

const students = NAMES.map((name, i) => {
  const grades = {
    algebra: seededGrade(i * 3 + 1, 3.58),
    biology: seededGrade(i * 3 + 2, 3.81),
    literature: seededGrade(i * 3 + 3, 3.62),
    physics: seededGrade(i * 3 + 4, 3.5),
    chemistry: seededGrade(i * 3 + 5, 3.27),
  };
  const values = Object.values(grades);
  const average = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
  return {
    studentId: `perf-${String(i + 1).padStart(2, "0")}`,
    name,
    grades,
    average,
  };
});

const subjectAverages: Record<PerformanceSubject, number> = {
  algebra: 3.58,
  biology: 3.81,
  literature: 3.62,
  physics: 3.5,
  chemistry: 3.27,
};

export const performanceHeatmapData: PerformanceHeatmapData = {
  students,
  subjectAverages,
  overallAverage: 3.55,
  subjectLabels: SUBJECT_LABELS,
};
