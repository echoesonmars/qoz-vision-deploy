import type { SecuritySignalType, SecurityWorkflowStatus } from "@/lib/director/types";

export const SECURITY_SIGNAL_LABELS: Record<SecuritySignalType, string> = {
  conflict: "Конфликт",
  bullying: "Буллинг",
  crowd: "Скопление",
  intruder: "Посторонний",
  left_item: "Предмет",
  fall_injury: "Падение / травма",
};

export const SECURITY_WORKFLOW_LABELS: Record<SecurityWorkflowStatus, string> = {
  new: "Новое",
  reviewing: "На проверке",
  forwarded: "Передано",
  closed: "Закрыто",
};

export const SECURITY_WORKFLOW_NEXT: Partial<
  Record<SecurityWorkflowStatus, SecurityWorkflowStatus>
> = {
  new: "reviewing",
  reviewing: "forwarded",
  forwarded: "closed",
};
