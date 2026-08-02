export const knowledgeSubjects = ["math", "physics", "chemistry", "cs"] as const;
export type KnowledgeSubjectKey = (typeof knowledgeSubjects)[number];

export const knowledgeSubjectLabels: Record<KnowledgeSubjectKey, string> = {
  math: "Математика",
  physics: "Физика",
  chemistry: "Химия",
  cs: "Информатика",
};

export const knowledgeScales = ["school", "parallel", "class", "student"] as const;
export type KnowledgeScaleKey = (typeof knowledgeScales)[number];

export const knowledgeScaleLabels: Record<KnowledgeScaleKey, string> = {
  school: "Вся школа",
  parallel: "Параллель (10 классы)",
  class: 'Класс (10 «А»)',
  student: 'Ученик (Петров И.)',
};

export const knowledgeStandards = ["nish", "mesk", "ent"] as const;
export type KnowledgeStandardKey = (typeof knowledgeStandards)[number];

export const knowledgeStandardLabels: Record<KnowledgeStandardKey, string> = {
  nish: "НИШ",
  mesk: "МЕСК",
  ent: "ЕНТ",
};

export type MasteryLevel = "green" | "yellow" | "red";

export type KnowledgeTopicMeta = {
  id: string;
  label: string;
  subject: KnowledgeSubjectKey;
  teacher: string;
  row: number;
  col: number;
  basePercent: number;
  baselineRedZone: number;
  bottleneckNominalWeeks: number;
  bottleneckActualWeeks: number;
};

export const knowledgeTopics: KnowledgeTopicMeta[] = [
  {
    id: "quad",
    label: "Квадратные уравнения",
    subject: "math",
    teacher: "Серикова А.М.",
    row: 0,
    col: 0,
    basePercent: 88,
    baselineRedZone: 4,
    bottleneckNominalWeeks: 2,
    bottleneckActualWeeks: 2,
  },
  {
    id: "trig-ident",
    label: "Тригонометрические тождества",
    subject: "math",
    teacher: "Серикова А.М.",
    row: 1,
    col: 1,
    basePercent: 52,
    baselineRedZone: 14,
    bottleneckNominalWeeks: 2,
    bottleneckActualWeeks: 4,
  },
  {
    id: "trig-eq",
    label: "Тригонометрические уравнения",
    subject: "math",
    teacher: "Серикова А.М.",
    row: 2,
    col: 2,
    basePercent: 38,
    baselineRedZone: 18,
    bottleneckNominalWeeks: 3,
    bottleneckActualWeeks: 5,
  },
  {
    id: "deriv",
    label: "Производная",
    subject: "math",
    teacher: "Серикова А.М.",
    row: 0,
    col: 4,
    basePercent: 72,
    baselineRedZone: 9,
    bottleneckNominalWeeks: 3,
    bottleneckActualWeeks: 3,
  },
  {
    id: "integral",
    label: "Интеграл",
    subject: "math",
    teacher: "Серикова А.М.",
    row: 1,
    col: 5,
    basePercent: 44,
    baselineRedZone: 16,
    bottleneckNominalWeeks: 3,
    bottleneckActualWeeks: 6,
  },
  {
    id: "newton-laws",
    label: "Законы Ньютона",
    subject: "physics",
    teacher: "Тулегенов Е.Б.",
    row: 0,
    col: 0,
    basePercent: 81,
    baselineRedZone: 5,
    bottleneckNominalWeeks: 2,
    bottleneckActualWeeks: 2,
  },
  {
    id: "forces",
    label: "Силы и разложение",
    subject: "physics",
    teacher: "Тулегенов Е.Б.",
    row: 1,
    col: 1,
    basePercent: 58,
    baselineRedZone: 11,
    bottleneckNominalWeeks: 2,
    bottleneckActualWeeks: 3,
  },
  {
    id: "momentum",
    label: "Импульс",
    subject: "physics",
    teacher: "Тулегенов Е.Б.",
    row: 2,
    col: 2,
    basePercent: 41,
    baselineRedZone: 17,
    bottleneckNominalWeeks: 2,
    bottleneckActualWeeks: 4,
  },
  {
    id: "redox",
    label: "ОВР",
    subject: "chemistry",
    teacher: "Нурланова Р.С.",
    row: 0,
    col: 0,
    basePercent: 63,
    baselineRedZone: 12,
    bottleneckNominalWeeks: 2,
    bottleneckActualWeeks: 3,
  },
  {
    id: "electrochem",
    label: "Электролиз",
    subject: "chemistry",
    teacher: "Нурланова Р.С.",
    row: 1,
    col: 1,
    basePercent: 35,
    baselineRedZone: 19,
    bottleneckNominalWeeks: 2,
    bottleneckActualWeeks: 5,
  },
  {
    id: "oop",
    label: "ООП основы",
    subject: "cs",
    teacher: "Бахитов К.А.",
    row: 0,
    col: 0,
    basePercent: 76,
    baselineRedZone: 7,
    bottleneckNominalWeeks: 2,
    bottleneckActualWeeks: 2,
  },
  {
    id: "graphs",
    label: "Графы",
    subject: "cs",
    teacher: "Бахитов К.А.",
    row: 1,
    col: 1,
    basePercent: 48,
    baselineRedZone: 15,
    bottleneckNominalWeeks: 2,
    bottleneckActualWeeks: 5,
  },
];

export const knowledgeEdges: { source: string; target: string }[] = [
  { source: "quad", target: "trig-ident" },
  { source: "trig-ident", target: "trig-eq" },
  { source: "trig-ident", target: "deriv" },
  { source: "deriv", target: "integral" },
  { source: "newton-laws", target: "forces" },
  { source: "forces", target: "momentum" },
  { source: "redox", target: "electrochem" },
  { source: "oop", target: "graphs" },
];

const scaleDrift: Record<KnowledgeScaleKey, number> = {
  school: 2,
  parallel: 0,
  class: -4,
  student: -22,
};

const standardDrift: Record<KnowledgeStandardKey, number> = {
  nish: -1,
  mesk: 0,
  ent: 4,
};

export function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function clampStudentCount(value: number) {
  return Math.min(28, Math.max(0, Math.round(value)));
}

export function percentToLevel(percent: number): MasteryLevel {
  if (percent > 80) return "green";
  if (percent >= 50) return "yellow";
  return "red";
}

export function resolveTopicPercent(
  base: number,
  scale: KnowledgeScaleKey,
  standard: KnowledgeStandardKey
) {
  return clampPercent(base + scaleDrift[scale] + standardDrift[standard]);
}

export type ResolvedTopic = KnowledgeTopicMeta & {
  masteryPercent: number;
  masteryLevel: MasteryLevel;
  redZoneStudents: number;
  isBottleneck: boolean;
};

export function resolveTopic(
  topic: KnowledgeTopicMeta,
  scale: KnowledgeScaleKey,
  standard: KnowledgeStandardKey
): ResolvedTopic {
  const masteryPercent = resolveTopicPercent(topic.basePercent, scale, standard);
  const drift = masteryPercent - topic.basePercent;
  const redZoneStudents = clampStudentCount(topic.baselineRedZone - drift / 4);
  const isBottleneck = topic.bottleneckActualWeeks > topic.bottleneckNominalWeeks + 1;
  return {
    ...topic,
    masteryPercent,
    masteryLevel: percentToLevel(masteryPercent),
    redZoneStudents,
    isBottleneck,
  };
}

export function getResolvedTopics(
  subject: KnowledgeSubjectKey,
  scale: KnowledgeScaleKey,
  standard: KnowledgeStandardKey
): ResolvedTopic[] {
  return knowledgeTopics
    .filter((topic) => topic.subject === subject)
    .map((topic) => resolveTopic(topic, scale, standard));
}

export type BlindSpotItem = {
  nodeId: string;
  headline: string;
  affectedStudents: number;
  subjectLabel: string;
  detectionSummary: string;
};

export function getBlindSpots(
  subject: KnowledgeSubjectKey,
  scale: KnowledgeScaleKey,
  standard: KnowledgeStandardKey
): BlindSpotItem[] {
  const rows = getResolvedTopics(subject, scale, standard);
  const reds = rows.filter((topic) => topic.masteryLevel === "red");
  const items: BlindSpotItem[] = reds.map((topic) => {
    const detection =
      topic.id === "trig-eq"
        ? `${knowledgeSubjectLabels[subject]} 11 «Б» — «${topic.label}»: ${68}% класса допустили ошибки в шаге раскрытия формул на письменном экзамене (Sozley) + среднее время фиксации взгляда на доске во время этой лекции снижено на 25% (Qoz).`
        : `${knowledgeSubjectLabels[subject]}: «${topic.label}» — ${topic.redZoneStudents} учеников в красной зоне по Sozley; аномалии внимания Qoz подтверждены на 2 уроках.`;
    return {
      nodeId: topic.id,
      headline: `${knowledgeSubjectLabels[subject]} — ${topic.label}`,
      affectedStudents: topic.redZoneStudents,
      subjectLabel: knowledgeSubjectLabels[subject],
      detectionSummary: detection,
    };
  });
  return items.sort((first, second) => second.affectedStudents - first.affectedStudents);
}

export type PacingSummary = {
  statusLabel: string;
  varianceLabel: string;
  tone: "ok" | "ahead" | "behind";
  bottleneckRefs: string[];
};

export function getPacingSummary(
  subject: KnowledgeSubjectKey,
  scale: KnowledgeScaleKey,
  standard: KnowledgeStandardKey
): PacingSummary {
  const resolved = getResolvedTopics(subject, scale, standard);
  const backlogWeeks =
    resolved.reduce(
      (sum, topic) => sum + Math.max(0, topic.bottleneckActualWeeks - topic.bottleneckNominalWeeks),
      0
    ) * 0.35;
  const bottleneckRefs = resolved.filter((topic) => topic.isBottleneck).map((topic) => topic.id);

  let tone: PacingSummary["tone"] = "ok";
  let varianceLabel = "Идем по графику";
  if (backlogWeeks > 2.2) {
    tone = "behind";
    varianceLabel =
      backlogWeeks > 3.5 ? "Отставание на 1.5 недели" : "Отставание на 6 дней";
  } else if (backlogWeeks < 0.6) {
    tone = "ahead";
    varianceLabel = "Опережение на 3 дня";
  }

  const statusLabel =
    tone === "ahead"
      ? "Ритм календаря"
      : tone === "behind"
        ? "Риск провала КТП"
        : "Синхронизация с планом";

  return { statusLabel, varianceLabel, tone, bottleneckRefs };
}

export const knowledgeAiPackages = [
  {
    id: "sozley-retest",
    title: "Точечные повторные тесты Sozley",
    body: "Сгенерированы мини-кейсы только по красным узлам графа; отправка 10 «А» и 11 «Б» на эту неделю.",
  },
  {
    id: "teacher-focus",
    title: "Фокус следующих уроков",
    body: "Перед «Интеграл» повторить «Производная» (20 мин) + разбор «Тригонометрические уравнения» на интерактивной доске.",
  },
  {
    id: "schedule-buffer",
    title: "Резерв часов",
    body: "Заложить +2 академических часа на «ОВР» в расписании следующего года — класс стоит дольше норматива.",
  },
] as const;
