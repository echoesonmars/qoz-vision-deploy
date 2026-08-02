export type ReadinessLevel = "stable" | "risk" | "critical";

export const forecastSubjectLabels: Record<string, string> = {
  math: "Математика",
  physics: "Физика",
  chemistry: "Химия",
  biology: "Биология",
};

export const forecastSubjectKeys = [
  "math",
  "physics",
  "chemistry",
  "biology",
] as const;

export type ForecastSubjectKey = (typeof forecastSubjectKeys)[number];

export const strategicTargets = {
  meskEntPassPercent: 72,
  meskEntDetail: "подтверждают целевой балл (110+ ЕНТ / A*/A МЕСК)",
  gpaForecast: 3.68,
  gpaTrend: "up" as const,
  gpaPeriodLabel: "конец четверти",
  riskZoneCount: 23,
  riskZoneDetail:
    "падение успеваемости на ≥1,5 балла за месяц без вмешательства",
};

export const readinessMatrixRows: {
  className: string;
  cells: Record<ForecastSubjectKey, ReadinessLevel>;
}[] = [
  {
    className: "10 «А»",
    cells: {
      math: "stable",
      physics: "risk",
      chemistry: "stable",
      biology: "risk",
    },
  },
  {
    className: "10 «Б»",
    cells: {
      math: "risk",
      physics: "stable",
      chemistry: "critical",
      biology: "stable",
    },
  },
  {
    className: "11 «А»",
    cells: {
      math: "stable",
      physics: "stable",
      chemistry: "risk",
      biology: "stable",
    },
  },
  {
    className: "11 «Б»",
    cells: {
      math: "critical",
      physics: "risk",
      chemistry: "stable",
      biology: "risk",
    },
  },
];

export const earlyWarningStudents: {
  id: string;
  name: string;
  className: string;
  threatRank: number;
  teaser: string;
  reasoning: string;
}[] = [
  {
    id: "w1",
    name: "Асылбек М.",
    className: "11 «Б»",
    threatRank: 1,
    teaser:
      "Резкое снижение концентрации на математике и ошибки по тригонометрии",
    reasoning:
      "Падение концентрации на уроках математики за последние 2 недели на 30% (данные Qoz) + 3 неисправленные критические ошибки в домашних работах по тригонометрии (данные Sozley). Совместная модель прогнозирует снижение среднего балла по срезу на 1,6 при отсутствии дополнительной работы с задачами ЕНТ профиля.",
  },
  {
    id: "w2",
    name: "Камилла С.",
    className: "10 «А»",
    threatRank: 2,
    teaser: "Риск не успеть стереометрию при текущем темпе подготовки",
    reasoning:
      "Серия оценок Sozley по стереометрии ниже медианы класса на 18%. Видеоаналитика фиксирует снижение вовлечённости на 4-м и 5-м уроках. Без факультативной работы вероятность не закрепить тему к контрольной в течение 3 недель оценивается как высокая.",
  },
  {
    id: "w3",
    name: "Данияр Т.",
    className: "11 «А»",
    threatRank: 3,
    teaser:
      "Колебания по физике и пропуски цифровых тренажёров Sozley на этой неделе",
    reasoning:
      "Невыполнены 2 адаптивных задания Sozley с высоким весом в прогнозе ЕНТ. На уроках физики фиксируется нестабильный фокус (Qoz). Рекомендовано целевое назначение мини-модуля по электродинамике до следующего среза.",
  },
];

export const recommendedActions: { id: string; body: string }[] = [
  {
    id: "r1",
    body: "Разделить 10 «А» на две подгруппы на уроках химии на следующие 14 дней. Около 40% класса не усвоят тему «Органические соединения» при текущем темпе (прогноз Sozley + граф знаний).",
  },
  {
    id: "r2",
    body: "Направить персональный цифровой тренажёр Sozley по векторам для 15 учеников 9 «В» до пятницы; ожидаемый прирост проходного балла по математике в симуляторе +3,1 п.п.",
  },
  {
    id: "r3",
    body: "Добавить 2 часа факультатива по физике для 11 классов в сценарии симулятора снижает число учеников в зоне риска по предмету на 6 чел. при неизменном составе педагогов.",
  },
];

export const simulatorScenarios = [
  { value: "physics_extra", label: "+2 ч факультатива физика, 11 кл." },
  { value: "teacher_swap", label: "Переназначение преподавателя в 10 «Б»" },
  { value: "chem_split", label: "Деление 10 «А» на подгруппы по химии" },
] as const;

export const simulatorBasePassPercent = 68;
export const simulatorHoursMax = 4;
export const simulatorGainPerHour = 2.1;
