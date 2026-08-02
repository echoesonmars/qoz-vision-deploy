import { Readable } from "node:stream";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { createSupabaseAdmin, INCIDENTS_BUCKET } from "@/lib/supabase-admin";
import {
  isBackendStorageUploadEnabled,
  uploadVideoViaBackend,
} from "@/lib/storage-backend-upload";
import { isS3StorageEnabled, s3PutObjectStream, s3UploadObject } from "@/lib/storage-s3";

export function isSupabaseRestStorageEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function resolveStorageUploadBackend(): "supabase" | "s3" {
  const forced = process.env.STORAGE_UPLOAD_BACKEND?.trim().toLowerCase();
  if (forced === "supabase" || forced === "s3") {
    return forced;
  }
  if (isSupabaseRestStorageEnabled()) {
    return "supabase";
  }
  return "s3";
}

async function supabaseRestUpload(
  path: string,
  file: File,
  contentType: string,
): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.storage.from(INCIDENTS_BUCKET).upload(path, file, {
    contentType,
    upsert: false,
  });
  if (error) {
    throw new Error(error.message);
  }
}

async function s3UploadFile(
  path: string,
  file: File,
  contentType: string,
): Promise<void> {
  const bufferPutMax = 64 * 1024 * 1024;
  if (file.size > 0 && file.size <= bufferPutMax) {
    const buf = Buffer.from(await file.arrayBuffer());
    await s3UploadObject(path, buf, contentType);
    return;
  }
  if (file.size > 0) {
    const body = Readable.fromWeb(file.stream() as NodeReadableStream);
    await s3PutObjectStream(path, body, contentType, file.size);
    return;
  }
  throw new Error("Empty file");
}

function isSslLikeError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /bad record mac|SSL routines/i.test(msg);
}

export async function uploadVideoToStorage(
  path: string,
  file: File,
  contentType: string,
): Promise<void> {
  const backendMode = resolveStorageUploadBackend();
  if (backendMode === "supabase") {
    await supabaseRestUpload(path, file, contentType);
    return;
  }

  if (isBackendStorageUploadEnabled()) {
    try {
      await uploadVideoViaBackend(path, file, contentType);
      return;
    } catch (err) {
      if (!isS3StorageEnabled() || !isSslLikeError(err)) {
        throw err;
      }
    }
  }

  if (!isS3StorageEnabled()) {
    throw new Error(
      "Storage upload not configured: start qoz-demo-backend (BACKEND_URL) or set SUPABASE_S3_*",
    );
  }
  await s3UploadFile(path, file, contentType);
}
