import { proxyBackendJson } from "@/lib/backend-live-proxy";

export async function POST(request: Request) {
  const body = await request.json();
  return proxyBackendJson("/api/live/sessions/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    timeoutMs: 30_000,
  });
}
