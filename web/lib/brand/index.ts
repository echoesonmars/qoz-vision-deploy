export { ADM_COLORS, ADM_CSS_VARS, ADM_RADIUS, ADM_SPACING } from "@/lib/brand/tokens";
export type { AdmColorKey, AdmCssVarKey } from "@/lib/brand/tokens";

export { ADM_COPY } from "@/lib/brand/copy";
export type { AdmCopyKey } from "@/lib/brand/copy";

export {
  ADM_CHART_COLORS,
  ADM_CHART_SERIES,
  ADM_CHART_CSS_VARS,
} from "@/lib/brand/chart-palette";
export type { AdmChartColorKey } from "@/lib/brand/chart-palette";

export {
  ALERT_STATUS,
  ALERT_PRIORITY_LABELS,
  mapPriorityToAlertStatus,
  getAlertStatusByPriority,
} from "@/lib/brand/alert-status";
export type { AlertStatusKey, AlertStatusDefinition } from "@/lib/brand/alert-status";

export {
  admPageClass,
  admCardClass,
  admCardInteractiveClass,
  admCardHeaderMutedClass,
  admKickerClass,
  admChecksCardHeaderClass,
  admMetricChartPanelClass,
  admHeadingClass,
  admAlertRowClass,
  admHeaderShellClass,
  admIconWellClass,
  admStatusSuccessTextClass,
  admStatusSuccessBgClass,
  admStatusSuccessSoftClass,
  admStatusWarningTextClass,
  admActiveRingClass,
  admActiveSurfaceClass,
  admActiveBadgeClass,
  admFocusRingClass,
  admTabActiveClass,
  admNavActiveClass,
  admMediaBackdropClass,
  admIncidentPreviewToneClass,
  admConnectedDotClass,
  admProgressIndicatorClass,
  admTableRowSelectedClass,
  admGradeHeatHighClass,
  admGradeHeatMidClass,
  admHeatmapCellClass,
  admSectionCardClass,
} from "@/lib/brand/ui-classes";

export { formatIntegrationActorLabel } from "@/lib/brand/integration-labels";

export { camerasBreadcrumbItems } from "@/lib/brand/navigation";

export { mapDirectorAlertToView } from "@/lib/brand/alert-view-mapper";
export type { AdmAlertView } from "@/lib/brand/alert-view-mapper";
