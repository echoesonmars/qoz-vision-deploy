export const ADM_COLORS = {
  primary: "#0B5CFF",
  primaryForeground: "#FFFFFF",
  background: "#F7F9FC",
  foreground: "#101828",
  heading: "#0F1F4D",
  card: "#FFFFFF",
  cardForeground: "#101828",
  mutedForeground: "#667085",
  border: "#E3E9F2",
  input: "#E3E9F2",
  ring: "#0B5CFF",
  destructive: "#F04438",
  statusSuccess: "#22A06B",
  statusSuccessMuted: "#EAF8F1",
  statusWarning: "#F79009",
  statusWarningMuted: "#FFF4E5",
  statusCritical: "#F04438",
  statusCriticalMuted: "#FFF0EE",
  statusInfo: "#2F80ED",
  statusInfoMuted: "#F4F8FF",
} as const;

export type AdmColorKey = keyof typeof ADM_COLORS;

export const ADM_CSS_VARS = {
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  background: "--background",
  foreground: "--foreground",
  heading: "--heading",
  card: "--card",
  cardForeground: "--card-foreground",
  mutedForeground: "--muted-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
  destructive: "--destructive",
  statusSuccess: "--status-success",
  statusSuccessMuted: "--status-success-muted",
  statusWarning: "--status-warning",
  statusWarningMuted: "--status-warning-muted",
  statusCritical: "--status-critical",
  statusCriticalMuted: "--status-critical-muted",
  statusInfo: "--status-info",
  statusInfoMuted: "--status-info-muted",
  chart1: "--chart-1",
  chart2: "--chart-2",
  chart3: "--chart-3",
  chart4: "--chart-4",
  chart5: "--chart-5",
} as const;

export type AdmCssVarKey = keyof typeof ADM_CSS_VARS;

export const ADM_RADIUS = {
  base: "0.75rem",
  card: "12px",
  button: "8px",
} as const;

export const ADM_SPACING = [8, 16, 24, 32, 48] as const;
