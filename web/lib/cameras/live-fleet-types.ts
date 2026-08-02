export type LiveFleetStatus = {
  activeIngests: number;
  maxConcurrent: number;
  runningSessions: number;
  captureIntervalMs: number;
  baseCaptureIntervalMs: number;
  captureIntervalMinFloorMs: number;
  geminiMaxConcurrent: number;
  visionMaxConcurrent?: number;
  lastGemini429At: string | null;
  lastFailStreakAlertAt: string | null;
  lastVisionHttpErrorAt?: string | null;
};
