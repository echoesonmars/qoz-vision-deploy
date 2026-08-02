const DEFAULT_MAX_MB = 500;

function resolveMaxMb(): number {
  const raw = process.env.VIDEO_MAX_UPLOAD_MB ?? process.env.NEXT_PUBLIC_VIDEO_MAX_UPLOAD_MB;
  if (!raw) return DEFAULT_MAX_MB;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_MB;
}

export const MAX_VIDEO_UPLOAD_MB = resolveMaxMb();

export const MAX_VIDEO_UPLOAD_BYTES = MAX_VIDEO_UPLOAD_MB * 1024 * 1024;

export const MAX_VIDEO_UPLOAD_LABEL = `${MAX_VIDEO_UPLOAD_MB} МБ`;

export function isVideoWithinSizeLimit(bytes: number): boolean {
  return bytes > 0 && bytes <= MAX_VIDEO_UPLOAD_BYTES;
}

export function videoUploadSizeError(): string {
  return `Файл слишком большой. Максимальный размер: ${MAX_VIDEO_UPLOAD_LABEL}`;
}
