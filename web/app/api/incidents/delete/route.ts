import { getSession } from "@/lib/auth-session.server";
import { deleteIncidentFile } from "@/lib/incident-storage";
import { deleteIncident, getIncidentStoragePath } from "@/lib/incidents-repository";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { incidentId?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const incidentId = body.incidentId?.trim();
  if (!incidentId) {
    return NextResponse.json({ error: "incidentId required" }, { status: 400 });
  }
  try {
    const storagePath = await getIncidentStoragePath(incidentId);
    if (!storagePath) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const removed = await deleteIncident(incidentId);
    if (!removed) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    try {
      await deleteIncidentFile(storagePath);
    } catch {
      return NextResponse.json({ id: incidentId, storageDeleted: false });
    }
    return NextResponse.json({ id: incidentId, storageDeleted: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
