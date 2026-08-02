import { getSession } from "@/lib/auth-session.server";
import { deleteIncidentFile } from "@/lib/incident-storage";
import { deleteIncident, getIncidentStoragePath } from "@/lib/incidents-repository";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

async function removeIncident(id: string) {
  const storagePath = await getIncidentStoragePath(id);
  if (!storagePath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const removed = await deleteIncident(id);
  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    await deleteIncidentFile(storagePath);
  } catch {
    return NextResponse.json({ id, storageDeleted: false });
  }
  return NextResponse.json({ id, storageDeleted: true });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await context.params;
    return await removeIncident(id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}

export async function POST(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await context.params;
    return await removeIncident(id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
