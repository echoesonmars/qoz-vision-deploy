export type CurriculumNode = {
  id: string;
  title: string;
  standard: "nish" | "mesk" | "ent";
  children?: CurriculumNode[];
};

export const curriculumRoots: CurriculumNode[] = [
  {
    id: "alg",
    title: "Алгебра и функции",
    standard: "nish",
    children: [
      { id: "alg-q", title: "Квадратные уравнения", standard: "nish" },
      { id: "alg-tr", title: "Тригонометрия", standard: "nish" },
    ],
  },
  {
    id: "phys",
    title: "Механика",
    standard: "mesk",
    children: [
      { id: "phys-n", title: "Законы Ньютона", standard: "mesk" },
      { id: "phys-e", title: "Энергия и импульс", standard: "mesk" },
    ],
  },
];

export type StemTaskCard = {
  id: string;
  subject: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  rubricPoints: number;
  preview: string;
};

export const stemTasks: StemTaskCard[] = [
  {
    id: "t1",
    subject: "Математика",
    title: "Параметрический корень",
    difficulty: "hard",
    rubricPoints: 12,
    preview: "Найти все действительные a ∈ ℝ, при которых система … имеет ровно два решения.",
  },
  {
    id: "t2",
    subject: "Химия",
    title: "ОВР на электродах",
    difficulty: "medium",
    rubricPoints: 8,
    preview: "Составьте процессы на аноде и катоде и рассчитайте объём газа …",
  },
];

export type TaskMetricRow = {
  taskId: string;
  failSchoolPercent: number;
  label: string;
};

export const taskMetricRows: TaskMetricRow[] = [
  { taskId: "t1", failSchoolPercent: 62, label: "Параметрический корень" },
  { taskId: "t2", failSchoolPercent: 28, label: "ОВР на электродах" },
];

export const aiVariantLines: string[] = [
  "[Вариант A] Упростите выражение: (sin³x + cos³x) / (sin x + cos x) при условии sin x + cos x ≠ 0.",
  "[Вариант B] Докажите тождество с подстановкой t = tan(x/2); уточнить ОДЗ.",
];

export const aiVariantShufflePool: string[] = [
  ...aiVariantLines,
  "[Вариант C] Постройте график y = arcsin(sin x) на отрезке [−2π; 2π] с пометкой скачков.",
];

export type VersionManagementState = {
  revealAnswersLocked: boolean;
  examStartsAt: string;
};

export const versionMgmt: VersionManagementState = {
  revealAnswersLocked: true,
  examStartsAt: "2026-05-20 08:00",
};
