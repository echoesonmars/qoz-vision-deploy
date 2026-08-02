import { randomUUID } from "node:crypto";
import { getSession } from "@/lib/auth-session.server";
import { isS3StorageEnabled } from "@/lib/storage-s3";
import { isVideoWithinSizeLimit, videoUploadSizeError } from "@/lib/video-upload-limits";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isS3StorageEnabled() && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }
  let body: { fileName?: string; contentType?: string; sizeBytes?: number };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const size = body.sizeBytes ?? 0;
  if (!isVideoWithinSizeLimit(size)) {
    return NextResponse.json({ error: videoUploadSizeError() }, { status: 413 });
  }
  const ext = body.fileName?.includes(".") ? body.fileName.split(".").pop() : "mp4";
  const safeExt = ext && /^[a-z0-9]+$/i.test(ext) ? ext : "mp4";
  const storagePath = `incidents/${randomUUID()}.${safeExt}`;
  const contentType = body.contentType?.trim() || "video/mp4";
  return NextResponse.json({ storagePath, contentType });
}
