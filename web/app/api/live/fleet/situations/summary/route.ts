import { proxyPublicBackendJson } from "@/lib/backend-live-proxy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const since = url.searchParams.get("since");
  const qs = since ? `?since=${encodeURIComponent(since)}` : "";
  return proxyPublicBackendJson(`/api/live/fleet/situations/summary${qs}`);
}
