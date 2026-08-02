import { proxyBackendJson } from "@/lib/backend-live-proxy";

export async function PATCH(request: Request) {
  const body = await request.json();
  return proxyBackendJson("/api/live/config", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    timeoutMs: 15_000,
  });
}
