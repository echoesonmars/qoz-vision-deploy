import { proxyPublicBackendJson } from "@/lib/backend-live-proxy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const deviceId = url.searchParams.get("deviceId");
  const limit = url.searchParams.get("limit") ?? "50";
  if (!deviceId) {
    return Response.json({ error: "deviceId required" }, { status: 400 });
  }
  return proxyPublicBackendJson(
    `/api/live/feed?deviceId=${encodeURIComponent(deviceId)}&limit=${limit}`,
  );
}
