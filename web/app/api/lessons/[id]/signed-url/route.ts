import { getSession } from "@/lib/auth-session.server";
import { createIncidentFileUrl } from "@/lib/incident-storage";
import { getLessonStoragePath } from "@/lib/lessons-repository";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    const storagePath = await getLessonStoragePath(id);
    if (!storagePath) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const url = await createIncidentFileUrl(storagePath, 3600);
    return NextResponse.json({ url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Storage unavailable";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
