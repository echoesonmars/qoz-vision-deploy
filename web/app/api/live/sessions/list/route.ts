import { proxyBackendJson } from "@/lib/backend-live-proxy";

export async function GET(request: Request) {
  const qs = new URL(request.url).searchParams.toString();
  return proxyBackendJson(`/api/live/sessions/list?${qs}`);
}
