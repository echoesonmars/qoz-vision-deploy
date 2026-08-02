import { getSession } from "@/lib/auth-session.server";
import { triggerIncidentAnalyze } from "@/lib/backend-trigger";
import { resetIncidentForRetry } from "@/lib/incidents-repository";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { incidentId?: string };
  try {
    body = (await request.json()) as { incidentId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const incidentId = body.incidentId;
  if (!incidentId) {
    return NextResponse.json({ error: "incidentId required" }, { status: 400 });
  }
  const sql = getDb();
  const [row] = await sql<{ id: string; category: string }[]>`
    select id, category from public.incidents where id = ${incidentId} limit 1
  `;
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (row.category !== "pending") {
    return NextResponse.json({ status: "already_done", incidentId });
  }
  await resetIncidentForRetry(incidentId);
  const ok = await triggerIncidentAnalyze(incidentId);
  if (!ok) {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
  return NextResponse.json({ status: "processing", incidentId });
}
