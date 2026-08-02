import { cn } from "@/lib/utils";
import {
  admKickerClass,
  admSectionCardClass,
  admStatusSuccessTextClass,
  admStatusWarningTextClass,
} from "@/lib/brand/ui-classes";

export const directorKicker = admKickerClass;

export const directorMetricValue = cn(
  "text-xl font-semibold tabular-nums tracking-tight text-foreground",
);

export const directorMetricContext = cn("text-xs leading-relaxed");

export const directorSectionCard = admSectionCardClass;

export const directorStatusOk = admStatusSuccessTextClass;
export const directorStatusWarning = admStatusWarningTextClass;
export const directorStatusCritical = "text-[var(--status-critical)]";

export function directorStatusClass(
  status: "ok" | "warning" | "critical",
): string {
  if (status === "ok") return directorStatusOk;
  if (status === "warning") return directorStatusWarning;
  return directorStatusCritical;
}

export const directorAlertPriorityBadge: Record<
  "critical" | "attention" | "info",
  string
> = {
  critical: "Высокий риск",
  attention: "Требует внимания",
  info: "Информация",
};
