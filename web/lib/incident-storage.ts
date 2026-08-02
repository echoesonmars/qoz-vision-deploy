import { createSupabaseAdmin, INCIDENTS_BUCKET } from "@/lib/supabase-admin";
import { isS3StorageEnabled, s3PresignedGetUrl } from "@/lib/storage-s3";
import { uploadVideoToStorage } from "@/lib/storage-upload";

function supabaseStorageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function uploadIncidentFile(
  path: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  const blob = new Blob([Uint8Array.from(body)], { type: contentType });
  const file = new File([blob], path.split("/").pop() ?? "upload.bin", { type: contentType });
  await uploadVideoToStorage(path, file, contentType);
}

export async function deleteIncidentFile(path: string): Promise<void> {
  if (isS3StorageEnabled()) {
    const { s3DeleteObject } = await import("@/lib/storage-s3");
    await s3DeleteObject(path);
    return;
  }
  if (!supabaseStorageConfigured()) {
    return;
  }
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.storage.from(INCIDENTS_BUCKET).remove([path]);
  if (error) {
    throw new Error(error.message);
  }
}

export async function createIncidentFileUrl(
  path: string,
  expiresInSeconds: number,
): Promise<string> {
  if (isS3StorageEnabled()) {
    return s3PresignedGetUrl(path, expiresInSeconds);
  }
  if (!supabaseStorageConfigured()) {
    throw new Error(
      "Storage not configured: set SUPABASE_S3_* or SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(INCIDENTS_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "Could not sign URL");
  }
  return data.signedUrl;
}
