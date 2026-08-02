export type ArchiveFilterOption = { value: string; label: string };

export const filterYears: ArchiveFilterOption[] = [
  { value: "2025-2026", label: "2025–2026" },
  { value: "2024-2025", label: "2024–2025" },
];

export const filterQuarters: ArchiveFilterOption[] = [
  { value: "q3", label: "III четверть" },
  { value: "q4", label: "IV четверть" },
];

export const filterClasses: ArchiveFilterOption[] = [
  { value: "10a", label: '10 «А»' },
  { value: "11b", label: '11 «Б»' },
];

export const filterSubjects: ArchiveFilterOption[] = [
  { value: "math", label: "Математика" },
  { value: "physics", label: "Физика" },
];

export type ExamTwinBox = {
  id: string;
  left: string;
  top: string;
  width: string;
  height: string;
  variant: "correct" | "wrong";
};

export const twinBoxes: ExamTwinBox[] = [
  { id: "b1", left: "12%", top: "18%", width: "28%", height: "12%", variant: "correct" },
  { id: "b2", left: "44%", top: "22%", width: "22%", height: "14%", variant: "wrong" },
  { id: "b3", left: "14%", top: "42%", width: "52%", height: "18%", variant: "correct" },
];

export type TwinTabCopy = {
  rawOcr: string;
  logic: string;
  finalEval: string;
};

export const twinCopy: TwinTabCopy = {
  rawOcr:
    "Задача 12. cos(2x) + sin(x) = 0 … [фрагмент утрачен] … подстановка x = π/6 проверена.",
  logic:
    "Шаг 1: сведение к квадратному уравнению по sin(x). Шаг 2: проверка области допустимых значений. Риск: пропущен период ±2πk.",
  finalEval:
    "Частичное решение: логика верна на 70%, ошибка в финальных корнях (−1 балл по критерию §4.2). Итог ИИ: 13 / 20.",
};

export type AuditLogRow = {
  id: string;
  editedBy: string;
  beforeScore: number;
  afterScore: number;
  changedAt: string;
  reason: string;
};

export const auditLogRows: AuditLogRow[] = [
  {
    id: "log1",
    editedBy: "Серикова А.М.",
    beforeScore: 13,
    afterScore: 14,
    changedAt: "2026-05-12 09:40",
    reason: "Зачтён альтернивный ход доказательства по разбору на уроке.",
  },
  {
    id: "log2",
    editedBy: "Завуч ИБ",
    beforeScore: 18,
    afterScore: 17,
    changedAt: "2026-05-11 16:05",
    reason: "Ужесточено соответствие ключу МЕСК после верификации второго читателя.",
  },
];
