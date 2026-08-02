import { formatUserFacingVisionError } from "./vision-error-format.js";

export function formatUserFacingLiveIngestError(err: unknown): string {
  return formatUserFacingVisionError(err);
}
