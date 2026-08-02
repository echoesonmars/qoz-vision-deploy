import { proxyBackendJson } from "@/lib/backend-live-proxy";

export async function GET() {
  return proxyBackendJson("/api/live/fleet", { timeoutMs: 15_000 });
}
