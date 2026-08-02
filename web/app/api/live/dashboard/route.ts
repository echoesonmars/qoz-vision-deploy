import { proxyBackendJson } from "@/lib/backend-live-proxy";

export async function GET(request: Request) {
  const qs = new URL(request.url).searchParams.toString();
  const path = qs ? `/api/live/dashboard?${qs}` : "/api/live/dashboard";
  return proxyBackendJson(path);
}
