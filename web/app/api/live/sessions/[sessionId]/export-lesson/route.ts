import { proxyBackendJson } from "@/lib/backend-live-proxy";

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
  const body = await request.text();
  return proxyBackendJson(
    `/api/live/sessions/${encodeURIComponent(sessionId)}/export-lesson`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body || "{}",
      timeoutMs: 60_000,
    },
  );
}
