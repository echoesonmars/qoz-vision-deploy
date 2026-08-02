import { getSession } from "@/lib/auth-session.server";
import { getDb } from "@/lib/db";
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
  const incidentId = body.incidentId;
  if (!incidentId) {
    return NextResponse.json({ error: "incidentId required" }, { status: 400 });
  }

  const base = process.env.BACKEND_URL?.replace(/\/$/, "");
  const secret = process.env.BACKEND_INTERNAL_SECRET;
  if (!base || !secret) {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }

  const sql = getDb();
  const [row] = await sql<{ id: string }[]>`
    select id from public.incidents where id = ${incidentId} limit 1
  `;
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const res = await fetch(`${base}/api/incidents/analyze/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Backend-Secret": secret,
    },
    body: JSON.stringify({ incidentId }),
    signal: AbortSignal.timeout(15_000),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    return NextResponse.json(
      { error: data.error ?? res.statusText },
      { status: res.status >= 400 && res.status < 600 ? res.status : 502 },
    );
  }
  return NextResponse.json({ status: "cancelled", incidentId });
}
