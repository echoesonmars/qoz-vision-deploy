import type { IIntegrationsRepository } from "@/lib/data/contracts";
import { mockIntegrationMeta } from "@/lib/data/stubs/director/integrations";

export class MockIntegrationsRepository implements IIntegrationsRepository {
  getIntegrationMeta() {
    return mockIntegrationMeta;
  }

  async fetchCamerasOnlinePercent(): Promise<number | null> {
    const base = (
      process.env.BACKEND_URL?.trim() ||
      process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ||
      "http://backend:8080"
    ).replace(/\/$/, "");
    if (!base || base === "/backend") {
      try {
        const res = await fetch("http://backend:8080/api/cameras/infrastructure", {
          cache: "no-store",
        });
        if (!res.ok) return null;
        const data = (await res.json()) as {
          cameras?: { enabled?: boolean; online?: boolean }[];
        };
        const cameras = data.cameras ?? [];
        const enabled = cameras.filter((c) => c.enabled);
        if (enabled.length === 0) return null;
        const online = enabled.filter((c) => c.online).length;
        return Math.round((online / enabled.length) * 100);
      } catch {
        return null;
      }
    }
    try {
      const res = await fetch(`${base}/api/cameras/infrastructure`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = (await res.json()) as {
        cameras?: { enabled?: boolean; online?: boolean }[];
      };
      const cameras = data.cameras ?? [];
      const enabled = cameras.filter((c) => c.enabled);
      if (enabled.length === 0) return null;
      const online = enabled.filter((c) => c.online).length;
      return Math.round((online / enabled.length) * 100);
    } catch {
      return null;
    }
  }
}
