import { proxyBackendStream } from "@/lib/backend-live-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const qs = new URL(request.url).searchParams.toString();
  return proxyBackendStream(`/api/live/dashboard/stream?${qs}`);
}
