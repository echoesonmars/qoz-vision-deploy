import type {
  LiveDashboardResponse,
  LiveSessionResponse,
  LiveSessionsListResponse,
} from "@/lib/cameras/live-analysis-types";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    try {
      const parsed = JSON.parse(text) as { error?: string };
      if (parsed.error) throw new Error(parsed.error);
    } catch (e) {
      if (e instanceof Error && e.message !== text) throw e;
    }
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchLiveSession(deviceId: string): Promise<{
  session: LiveDashboardResponse["session"];
  isMonitoring: boolean;
}> {
  const res = await fetch(
    `/api/live/sessions?deviceId=${encodeURIComponent(deviceId)}`,
    { cache: "no-store" },
  );
  const data = await parseJson<LiveSessionResponse>(res);
  return { session: data.session, isMonitoring: data.isMonitoring };
}

export async function fetchLiveDashboard(
  deviceId: string,
  options?: {
    sessionId?: string | null;
    snapshotLimit?: number;
    incidentLimit?: number;
  },
): Promise<LiveDashboardResponse> {
  const params = new URLSearchParams({ deviceId });
  if (options?.sessionId) params.set("sessionId", options.sessionId);
  if (options?.snapshotLimit != null) {
    params.set("snapshotLimit", String(options.snapshotLimit));
  }
  if (options?.incidentLimit != null) {
    params.set("incidentLimit", String(options.incidentLimit));
  }
  const res = await fetch(`/api/live/dashboard?${params.toString()}`, {
    cache: "no-store",
  });
  return parseJson(res);
}

export async function fetchLiveSessionList(
  deviceId: string,
  limit = 20,
): Promise<LiveSessionsListResponse> {
  const res = await fetch(
    `/api/live/sessions/list?deviceId=${encodeURIComponent(deviceId)}&limit=${limit}`,
    { cache: "no-store" },
  );
  return parseJson(res);
}

export async function fetchLiveRecordingUrl(sessionId: string): Promise<string> {
  const res = await fetch(
    `/api/live/sessions/recording-url?sessionId=${encodeURIComponent(sessionId)}`,
    { cache: "no-store" },
  );
  const data = await parseJson<{ url: string }>(res);
  return data.url;
}

export async function startLiveMonitoring(input: {
  deviceId: string;
  cameraId: string;
  hlsUrl: string;
}): Promise<LiveSessionResponse> {
  const res = await fetch("/api/live/sessions/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ session: LiveSessionResponse["session"] }>(res);
  return { session: data.session, isMonitoring: data.session?.status === "running" };
}

export async function stopLiveMonitoring(deviceId: string): Promise<LiveSessionResponse> {
  const res = await fetch("/api/live/sessions/stop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId }),
  });
  const data = await parseJson<{ session: LiveSessionResponse["session"] }>(res);
  return {
    session: data.session,
    isMonitoring: false,
  };
}

export async function exportLiveSessionAsLesson(
  sessionId: string,
  title?: string,
): Promise<{ lessonId: string; status: string }> {
  const res = await fetch(`/api/live/sessions/${encodeURIComponent(sessionId)}/export-lesson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return parseJson(res);
}
