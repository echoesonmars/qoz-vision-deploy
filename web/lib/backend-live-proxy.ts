import { NextResponse } from "next/server";

export function getBackendProxyConfig(): { base: string; secret: string } | null {
  const base = process.env.BACKEND_URL?.replace(/\/$/, "");
  const secret = process.env.BACKEND_INTERNAL_SECRET;
  if (!base || !secret) return null;
  return { base, secret };
}

function backendUnavailableResponse(err: unknown): NextResponse {
  const msg = err instanceof Error ? err.message : String(err);
  const cause = err instanceof Error && err.cause instanceof Error ? err.cause.message : "";
  const refused =
    msg.includes("ECONNREFUSED") ||
    cause.includes("ECONNREFUSED") ||
    msg.includes("fetch failed");
  return NextResponse.json(
    {
      error: refused
        ? "Бэкенд не запущен. Запустите: cd qoz-demo-backend && npm run dev (порт 8080)"
        : `Не удалось связаться с бэкендом: ${msg}`,
    },
    { status: 503 },
  );
}

export async function proxyBackendJson(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<NextResponse> {
  const cfg = getBackendProxyConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "BACKEND_URL or BACKEND_INTERNAL_SECRET not configured" },
      { status: 503 },
    );
  }
  const timeoutMs = init?.timeoutMs ?? 30_000;
  const { timeoutMs: _t, ...fetchInit } = init ?? {};
  try {
    const res = await fetch(`${cfg.base}${path}`, {
      ...fetchInit,
      headers: {
        ...fetchInit.headers,
        "X-Backend-Secret": cfg.secret,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return backendUnavailableResponse(err);
  }
}

export async function proxyBackendStream(
  path: string,
  timeoutMs = 120_000,
): Promise<Response> {
  const cfg = getBackendProxyConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "BACKEND_URL or BACKEND_INTERNAL_SECRET not configured" },
      { status: 503 },
    );
  }
  try {
    const upstream = await fetch(`${cfg.base}${path}`, {
      headers: { "X-Backend-Secret": cfg.secret },
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();
      return NextResponse.json({ error: text || upstream.statusText }, { status: upstream.status });
    }
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return backendUnavailableResponse(err);
  }
}

export async function proxyPublicBackendJson(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<NextResponse> {
  const base = (
    process.env.BACKEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ||
    "http://backend:8080"
  ).replace(/\/$/, "");
  if (!base) {
    return NextResponse.json({ error: "BACKEND_URL not configured" }, { status: 503 });
  }
  const timeoutMs = init?.timeoutMs ?? 15_000;
  const { timeoutMs: _t, ...fetchInit } = init ?? {};
  try {
    const res = await fetch(`${base}${path}`, {
      ...fetchInit,
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return backendUnavailableResponse(err);
  }
}
