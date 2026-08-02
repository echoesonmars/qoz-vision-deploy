export type PipelineStageId =
  | "scan"
  | "ocr"
  | "ai_grade"
  | "teacher_review"
  | "done";

export type PipelineStageRow = {
  id: PipelineStageId;
  title: string;
  count: number;
  total: number;
};

export const pipelineStages: PipelineStageRow[] = [
  { id: "scan", title: "Сканирование", count: 48, total: 52 },
  { id: "ocr", title: "Распознавание OCR", count: 41, total: 48 },
  { id: "ai_grade", title: "Оценка ИИ", count: 38, total: 41 },
  { id: "teacher_review", title: "Утверждение учителем", count: 12, total: 38 },
  { id: "done", title: "Завершено", count: 31, total: 52 },
];

export type ActiveExamRow = {
  id: string;
  subject: string;
  className: string;
  teacher: string;
  disputed: number;
  progressPercent: number;
};

export const activeExams: ActiveExamRow[] = [
  {
    id: "ex1",
    subject: "Математика",
    className: '10 «А»',
    teacher: "Серикова А.М.",
    disputed: 4,
    progressPercent: 76,
  },
  {
    id: "ex2",
    subject: "Физика",
    className: '11 «Б»',
    teacher: "Тулегенов Е.Б.",
    disputed: 9,
    progressPercent: 54,
  },
  {
    id: "ex3",
    subject: "Химия",
    className: '10 «Б»',
    teacher: "Нурланова Р.С.",
    disputed: 2,
    progressPercent: 92,
  },
];

export type AnomalyRow = {
  id: string;
  label: string;
  detail: string;
};

export const anomalies: AnomalyRow[] = [
  {
    id: "a1",
    label: "Неразборчивый почерк",
    detail: "Бланк №2041 — сегмент формул не распознан OCR выше порога доверия.",
  },
  {
    id: "a2",
    label: "Незаполненный бланк ответов",
    detail: "Стр. 3 пуста при обязательном блоке «часть Б».",
  },
  {
    id: "a3",
    label: "Выброс балла к GPA",
    detail: "Ученик 11«А»: текущий срез на 2.1σ ниже исторического среднего Sozley.",
  },
];

export type BottleneckTeacher = {
  teacher: string;
  backlog: number;
  oldestHours: number;
};

export const bottleneckTeachers: BottleneckTeacher[] = [
  { teacher: "Серикова А.М.", backlog: 24, oldestHours: 38 },
  { teacher: "Бахитов К.А.", backlog: 17, oldestHours: 21 },
  { teacher: "Тулегенов Е.Б.", backlog: 11, oldestHours: 14 },
];
