import { getSession } from "@/lib/auth-session.server";
import { triggerLessonAnalyze } from "@/lib/backend-trigger";
import { uploadIncidentFile } from "@/lib/incident-storage";
import { insertLesson, listLessons } from "@/lib/lessons-repository";
import { isVideoWithinSizeLimit, videoUploadSizeError } from "@/lib/video-upload-limits";
import { NextResponse } from "next/server";

export const maxDuration = 300;
export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await listLessons();
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database unavailable";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  if (!isVideoWithinSizeLimit(file.size)) {
    return NextResponse.json({ error: videoUploadSizeError() }, { status: 413 });
  }
  const titleRaw = form.get("title");
  const title =
    typeof titleRaw === "string" && titleRaw.trim().length > 0 ? titleRaw.trim() : null;
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "mp4";
  const safeExt = ext && /^[a-z0-9]+$/i.test(ext) ? ext : "mp4";
  const path = `lessons/${crypto.randomUUID()}.${safeExt}`;
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    await uploadIncidentFile(path, buf, file.type || "video/mp4");
    const row = await insertLesson({ storage_path: path, title });
    void triggerLessonAnalyze(row.id);
    return NextResponse.json(row);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
