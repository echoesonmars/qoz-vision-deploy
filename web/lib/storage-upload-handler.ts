import { getSession } from "@/lib/auth-session.server";
import { validateReservedStoragePath } from "@/lib/storage-path";
import {
  isSupabaseRestStorageEnabled,
  uploadVideoToStorage,
} from "@/lib/storage-upload";
import { isBackendStorageUploadEnabled } from "@/lib/storage-backend-upload";
import { isS3StorageEnabled } from "@/lib/storage-s3";
import { isVideoWithinSizeLimit, videoUploadSizeError } from "@/lib/video-upload-limits";
import { NextResponse } from "next/server";

export async function handleStorageUploadPost(
  request: Request,
  prefix: "incidents" | "lessons",
): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (
    !isS3StorageEnabled() &&
    !isSupabaseRestStorageEnabled() &&
    !isBackendStorageUploadEnabled()
  ) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  const file = form.get("file");
  const storagePathRaw = form.get("storagePath");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  if (typeof storagePathRaw !== "string" || !storagePathRaw.trim()) {
    return NextResponse.json({ error: "storagePath required" }, { status: 400 });
  }
  const storagePath = storagePathRaw.trim();
  if (!validateReservedStoragePath(storagePath, prefix)) {
    return NextResponse.json({ error: "Invalid storagePath" }, { status: 400 });
  }
  if (!isVideoWithinSizeLimit(file.size)) {
    return NextResponse.json({ error: videoUploadSizeError() }, { status: 413 });
  }
  const contentType = file.type?.trim() || "video/mp4";
  try {
    await uploadVideoToStorage(storagePath, file, contentType);
    return NextResponse.json({ ok: true, storagePath });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
