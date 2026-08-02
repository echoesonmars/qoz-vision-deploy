import type { AlertPriority } from "@/lib/director/types";
import { ADM_COLORS } from "@/lib/brand/tokens";

export type AlertStatusKey = "success" | "warning" | "critical" | "info";

export type AlertStatusDefinition = {
  key: AlertStatusKey;
  label: string;
  color: string;
  background: string;
  borderClass: string;
  badgeClass: string;
  textClass: string;
};

export const ALERT_STATUS: Record<AlertStatusKey, AlertStatusDefinition> = {
  success: {
    key: "success",
    label: "Норма",
    color: ADM_COLORS.statusSuccess,
    background: ADM_COLORS.statusSuccessMuted,
    borderClass: "border-l-[var(--status-success)]",
    badgeClass:
      "border-[var(--status-success)]/30 bg-[var(--status-success-muted)] text-[var(--status-success)]",
    textClass: "text-[var(--status-success)]",
  },
  warning: {
    key: "warning",
    label: "Требует внимания",
    color: ADM_COLORS.statusWarning,
    background: ADM_COLORS.statusWarningMuted,
    borderClass: "border-l-[var(--status-warning)]",
    badgeClass:
      "border-[var(--status-warning)]/30 bg-[var(--status-warning-muted)] text-[var(--status-warning)]",
    textClass: "text-[var(--status-warning)]",
  },
  critical: {
    key: "critical",
    label: "Критический",
    color: ADM_COLORS.statusCritical,
    background: ADM_COLORS.statusCriticalMuted,
    borderClass: "border-l-[var(--status-critical)]",
    badgeClass:
      "border-[var(--status-critical)]/30 bg-[var(--status-critical-muted)] text-[var(--status-critical)]",
    textClass: "text-[var(--status-critical)]",
  },
  info: {
    key: "info",
    label: "Информация",
    color: ADM_COLORS.statusInfo,
    background: ADM_COLORS.statusInfoMuted,
    borderClass: "border-l-[var(--status-info)]",
    badgeClass:
      "border-[var(--status-info)]/30 bg-[var(--status-info-muted)] text-[var(--status-info)]",
    textClass: "text-[var(--status-info)]",
  },
};

export const ALERT_PRIORITY_LABELS: Record<AlertPriority, string> = {
  critical: "Высокий риск",
  attention: "Требует внимания",
  info: "Информация",
};

export function mapPriorityToAlertStatus(priority: AlertPriority): AlertStatusKey {
  if (priority === "critical") return "critical";
  if (priority === "attention") return "warning";
  return "info";
}

export function getAlertStatusByPriority(priority: AlertPriority): AlertStatusDefinition {
  return ALERT_STATUS[mapPriorityToAlertStatus(priority)];
}
