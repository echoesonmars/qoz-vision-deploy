import { proxyPublicBackendJson } from "@/lib/backend-live-proxy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  if (!category) {
    return Response.json({ error: "category required" }, { status: 400 });
  }
  const limit = url.searchParams.get("limit") ?? "40";
  const offset = url.searchParams.get("offset") ?? "0";
  const since = url.searchParams.get("since");
  const params = new URLSearchParams({
    category,
    limit,
    offset,
  });
  if (since) params.set("since", since);
  return proxyPublicBackendJson(`/api/live/fleet/situations?${params.toString()}`);
}
