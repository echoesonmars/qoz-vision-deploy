import { getSession } from "@/lib/auth-session.server";
import { triggerLessonAnalyze } from "@/lib/backend-trigger";
import { insertLesson } from "@/lib/lessons-repository";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { storagePath?: string; title?: string | null };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.storagePath?.trim()) {
    return NextResponse.json({ error: "storagePath required" }, { status: 400 });
  }
  try {
    const row = await insertLesson({
      storage_path: body.storagePath.trim(),
      title: body.title ?? null,
    });
    void triggerLessonAnalyze(row.id);
    return NextResponse.json(row);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Register failed";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
