export function isBackendStorageUploadEnabled(): boolean {
  return Boolean(
    process.env.BACKEND_URL?.trim() && process.env.BACKEND_INTERNAL_SECRET?.trim(),
  );
}

export async function uploadVideoViaBackend(
  storagePath: string,
  file: File,
  contentType: string,
): Promise<void> {
  const base = process.env.BACKEND_URL?.replace(/\/$/, "");
  const secret = process.env.BACKEND_INTERNAL_SECRET?.trim();
  if (!base || !secret) {
    throw new Error("BACKEND_URL or BACKEND_INTERNAL_SECRET not configured");
  }

  const fd = new FormData();
  fd.set("file", file, file.name || "upload.mp4");
  fd.set("storagePath", storagePath);
  fd.set("contentType", contentType);

  const res = await fetch(`${base}/api/storage/upload`, {
    method: "POST",
    headers: { "X-Backend-Secret": secret },
    body: fd,
    signal: AbortSignal.timeout(600_000),
  });

  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `Backend storage upload failed (${res.status})`);
  }
}
