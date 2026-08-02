export const attendancePercent = 42;
export const attendanceTotalStudents = 570;
export const attendanceVisitedStudents = 238;
export const attendanceTrendPercent = 1.2;
export const attendanceSparkline = [
  { i: 0, v: 38.5 },
  { i: 1, v: 39.2 },
  { i: 2, v: 40.1 },
  { i: 3, v: 39.8 },
  { i: 4, v: 41.2 },
  { i: 5, v: 40.4 },
  { i: 6, v: 41.8 },
  { i: 7, v: 41.1 },
  { i: 8, v: 42.5 },
  { i: 9, v: 41.6 },
  { i: 10, v: 42 },
  { i: 11, v: 42 },
];

export const engagementIndex = 78;

export const sozleyProcessedToday = 342;
export const sozleyPendingVerification = 12;

export const camerasOnline = 42;
export const camerasTotal = 45;

export const sozleyStatusSlices = [
  { key: "verified", label: "Утверждено учителем", value: 330 },
  { key: "pending", label: "Ожидают верификации", value: 12 },
] as const;

export const cameraStatusSlices = [
  { key: "online", label: "Онлайн", value: camerasOnline },
  { key: "offline", label: "Офлайн", value: camerasTotal - camerasOnline },
] as const;

export const networkDevicesPercent = 93;

export const networkDeviceSlices = [
  { key: "inNetwork", label: "В сети", value: 186 },
  { key: "outOfNetwork", label: "Вне сети", value: 14 },
] as const;

export const engagementByLesson = [
  { lesson: "1", focus: 74 },
  { lesson: "2", focus: 81 },
  { lesson: "3", focus: 79 },
  { lesson: "4", focus: 76 },
  { lesson: "5", focus: 62 },
  { lesson: "6", focus: 71 },
];

export const engagementRadarData = engagementByLesson.map((row) => ({
  subject: `${row.lesson} ур`,
  focus: row.focus,
  fullMark: 100,
}));

export const sozleyFlowArea = [
  { slot: "8:00", verified: 42, pending: 2 },
  { slot: "10:00", verified: 118, pending: 5 },
  { slot: "12:00", verified: 201, pending: 8 },
  { slot: "14:00", verified: 278, pending: 10 },
  { slot: "16:00", verified: 330, pending: 12 },
];

export const SOZLEY_SUBJECTS = [
  { value: "math", label: "Математика" },
  { value: "physics", label: "Физика" },
  { value: "chemistry", label: "Химия" },
] as const;

export const SOZLEY_PARALLELS = [
  { value: "8", label: "8 класс" },
  { value: "9", label: "9 класс" },
  { value: "10", label: "10 класс" },
  { value: "11", label: "11 класс" },
] as const;

export type SozleySubjectKey = (typeof SOZLEY_SUBJECTS)[number]["value"];
export type SozleyParallelKey = (typeof SOZLEY_PARALLELS)[number]["value"];

const sozleyGradesData: Record<
  SozleySubjectKey,
  Record<SozleyParallelKey, { grade5: number; grade4: number; grade3: number; grade2: number }>
> = {
  math: {
    "8": { grade5: 6, grade4: 10, grade3: 4, grade2: 1 },
    "9": { grade5: 8, grade4: 9, grade3: 3, grade2: 0 },
    "10": { grade5: 12, grade4: 8, grade3: 2, grade2: 0 },
    "11": { grade5: 10, grade4: 7, grade3: 4, grade2: 1 },
  },
  physics: {
    "8": { grade5: 4, grade4: 11, grade3: 5, grade2: 2 },
    "9": { grade5: 7, grade4: 10, grade3: 4, grade2: 1 },
    "10": { grade5: 9, grade4: 9, grade3: 3, grade2: 1 },
    "11": { grade5: 11, grade4: 8, grade3: 3, grade2: 0 },
  },
  chemistry: {
    "8": { grade5: 5, grade4: 9, grade3: 6, grade2: 2 },
    "9": { grade5: 6, grade4: 12, grade3: 4, grade2: 0 },
    "10": { grade5: 14, grade4: 7, grade3: 2, grade2: 0 },
    "11": { grade5: 8, grade4: 6, grade3: 5, grade2: 2 },
  },
};

export function getSozleyBars(
  subject: SozleySubjectKey,
  parallel: SozleyParallelKey,
) {
  const row = sozleyGradesData[subject][parallel];
  return [
    { grade: "5", count: row.grade5 },
    { grade: "4", count: row.grade4 },
    { grade: "3", count: row.grade3 },
    { grade: "2", count: row.grade2 },
  ];
}

export function getEngagementHighlights() {
  const rows = engagementByLesson;
  if (!rows.length) {
    return { dayAvg: 0, bestLesson: "—", worstLesson: "—" };
  }
  let sum = 0;
  let best = rows[0];
  let worst = rows[0];
  for (const r of rows) {
    sum += r.focus;
    if (r.focus > best.focus) best = r;
    if (r.focus < worst.focus) worst = r;
  }
  return {
    dayAvg: Math.round(sum / rows.length),
    bestLesson: best.lesson,
    worstLesson: worst.lesson,
  };
}

export function getSozleyHighlightStats(
  bars: { grade: string; count: number }[],
) {
  const totalWorks = bars.reduce((s, b) => s + b.count, 0);
  if (totalWorks === 0) {
    return { totalWorks: 0, avgGrade: "—" };
  }
  const weighted = bars.reduce(
    (s, b) => s + Number(b.grade) * b.count,
    0,
  );
  const avg = weighted / totalWorks;
  return { totalWorks, avgGrade: avg.toFixed(1) };
}

export type SummaryAlertSeverity = "discipline" | "performance" | "success";

export const aiAlerts: {
  id: string;
  severity: SummaryAlertSeverity;
  title: string;
  body: string;
}[] = [
  {
    id: "a1",
    severity: "discipline",
    title: "Дисциплина",
    body: "В 10 «Б» на уроке физики уровень шума и отвлечения превысил норму на 45%.",
  },
  {
    id: "a2",
    severity: "performance",
    title: "Успеваемость",
    body: "В 11 «А» средний балл за срез Sozley упал на 1.8 балла ниже исторического среднего класса.",
  },
  {
    id: "a3",
    severity: "success",
    title: "Успех",
    body: "9 «А» закрыл «слепую зону» по геометрии: темы логарифмов и векторов усвоены на 90%.",
  },
];

export const liveActivityItems: { time: string; text: string }[] = [
  {
    time: "10:48",
    text: "ADM: пик вовлечённости в 9 «Б» на 4-м уроке соответствует норме лабораторной работы.",
  },
  {
    time: "10:45",
    text: "Пакет Sozley по алгебре (11 «А»): 32 работы проверены ИИ, очередь на верификацию сокращена.",
  },
  {
    time: "10:42",
    text: "Учитель Ахметова Н. утвердила оценки за тест по химии в 10 «А» (Sozley).",
  },
  {
    time: "10:39",
    text: "Камера в кабинете 304 зафиксировала начало контрольной работы.",
  },
  {
    time: "10:38",
    text: "Камера у входа в спортзал перешла в режим дневной калибровки по расписанию администратора.",
  },
  {
    time: "10:31",
    text: "Отчёт по посещаемости за 2-й урок записан в базу данных.",
  },
];
