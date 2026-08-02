import { getSession } from "@/lib/auth-session.server";
import { triggerLessonAnalyze } from "@/lib/backend-trigger";
import { getLessonById, resetLessonForRetry } from "@/lib/lessons-repository";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { lessonId?: string };
  try {
    body = (await request.json()) as { lessonId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const lessonId = body.lessonId;
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }
  const row = await getLessonById(lessonId);
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (row.source_live_session_id) {
    return NextResponse.json({ status: "live_archive", lessonId });
  }
  if (row.status === "ready") {
    return NextResponse.json({ status: "already_done", lessonId });
  }
  if (row.status === "failed" || row.status === "processing") {
    await resetLessonForRetry(lessonId);
  }
  const ok = await triggerLessonAnalyze(lessonId);
  if (!ok) {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
  return NextResponse.json({ status: "processing", lessonId });
}
