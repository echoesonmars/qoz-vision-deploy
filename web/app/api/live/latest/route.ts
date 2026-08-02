import { proxyPublicBackendJson } from "@/lib/backend-live-proxy";

export async function GET(request: Request) {
  const deviceId = new URL(request.url).searchParams.get("deviceId");
  if (!deviceId) {
    return Response.json({ error: "deviceId required" }, { status: 400 });
  }
  return proxyPublicBackendJson(
    `/api/live/latest?deviceId=${encodeURIComponent(deviceId)}`,
  );
}
