import { getSession } from "@/lib/auth-session.server";
import type { AgentChatTurn } from "@/lib/ai-agent/chat-mock";
import { NextResponse } from "next/server";

function parseBody(raw: unknown): { messages: AgentChatTurn[] } | null {
  if (!raw || typeof raw !== "object" || !("messages" in raw)) return null;
  const messages = (raw as { messages: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40) return null;
  const parsed: AgentChatTurn[] = [];
  for (const item of messages) {
    if (!item || typeof item !== "object") return null;
    const role = (item as { role?: unknown }).role;
    const body = (item as { body?: unknown }).body;
    if (role !== "user" && role !== "agent") return null;
    if (typeof body !== "string" || body.length < 1 || body.length > 4000) return null;
    parsed.push({ role, body });
  }
  if (parsed[parsed.length - 1]?.role !== "user") return null;
  return { messages: parsed };
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = process.env.BACKEND_URL?.replace(/\/$/, "");
  const secret = process.env.BACKEND_INTERNAL_SECRET;
  if (!base || !secret) {
    return NextResponse.json({ error: "Backend not configured" }, { status: 503 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const body = parseBody(raw);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const res = await fetch(`${base}/api/agent/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Backend-Secret": secret,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120_000),
    });

    const data = (await res.json()) as { reply?: string; error?: string };
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error ?? "Backend error" },
        { status: res.status >= 500 ? 502 : res.status },
      );
    }
    if (!data.reply) {
      return NextResponse.json({ error: "Empty reply" }, { status: 502 });
    }
    return NextResponse.json({ reply: data.reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Backend unavailable";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
