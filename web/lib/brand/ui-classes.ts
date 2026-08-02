import { cn } from "@/lib/utils";

export const admPageClass = "min-h-svh bg-background text-foreground";

export const admCardClass = cn(
  "bg-card text-card-foreground",
  "border border-border rounded-lg",
);

export const admCardInteractiveClass = cn(
  admCardClass,
  "shadow-sm",
  "transition-all duration-200 ease-out",
  "hover:-translate-y-0.5 hover:shadow-md hover:ring-1 hover:ring-primary/20",
);

export const admCardHeaderMutedClass = cn(
  "border-b border-border bg-muted/30 pb-4 pt-2",
);

export const admKickerClass = cn(
  "text-xs font-medium uppercase tracking-wider text-muted-foreground",
);

export const admChecksCardHeaderClass = cn(
  "border-b border-border bg-muted/30 pb-3",
);

export const admMetricChartPanelClass = cn(
  "rounded-lg bg-muted/20 p-2 ring-1 ring-border/50 transition-colors group-hover/card:bg-muted/30",
  "min-h-[11rem] flex min-h-0 flex-1 flex-col",
);

export const admHeadingClass = "text-heading font-semibold tracking-tight";

export const admAlertRowClass = cn(
  "flex flex-col gap-3 rounded-lg border border-border border-l-4 bg-card p-4",
  "sm:flex-row sm:items-center sm:justify-between",
);

export const admHeaderShellClass = cn(
  "flex flex-col gap-4 rounded-lg border border-border bg-card p-6",
);

export const admIconWellClass = cn(
  "flex size-11 shrink-0 items-center justify-center rounded-lg",
  "bg-primary/10 text-primary ring-1 ring-primary/20",
);

export const admStatusSuccessTextClass = "text-[var(--status-success)]";

export const admStatusSuccessBgClass =
  "bg-[var(--status-success-muted)] text-[var(--status-success)]";

export const admStatusSuccessSoftClass = "bg-[var(--status-success)]/10 text-[var(--status-success)]";

export const admStatusWarningTextClass = "text-[var(--status-warning)]";

export const admActiveRingClass = "ring-2 ring-primary/40";

export const admActiveSurfaceClass = "bg-primary/5";

export const admActiveBadgeClass =
  "bg-primary/10 text-primary ring-primary/30";

export const admFocusRingClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export const admTabActiveClass =
  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground";

export const admNavActiveClass = "bg-primary text-primary-foreground hover:bg-primary/90";

export const admMediaBackdropClass =
  "bg-gradient-to-br from-foreground/90 via-foreground/70 to-muted";

export const admIncidentPreviewToneClass =
  "from-foreground/80 via-foreground/40 to-muted";

export const admConnectedDotClass = "animate-pulse bg-[var(--status-success)]";

export const admProgressIndicatorClass =
  "[&_[data-slot=progress-indicator]]:bg-primary";

export const admTableRowSelectedClass = "data-[state=selected]:bg-primary/10";

export const admGradeHeatHighClass =
  "bg-[var(--status-success)]/30 text-foreground";

export const admGradeHeatMidClass =
  "bg-[var(--status-success)]/20 text-foreground";

export const admHeatmapCellClass =
  "bg-[var(--status-success)]/20 ring-[var(--status-success)]/40";

export const admSectionCardClass = cn(
  "rounded-lg border border-border bg-card shadow-sm",
);
