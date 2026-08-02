export async function triggerLessonAnalyze(lessonId: string): Promise<boolean> {
  const base = process.env.BACKEND_URL?.replace(/\/$/, "");
  const secret = process.env.BACKEND_INTERNAL_SECRET;
  if (!base || !secret) {
    console.warn("[lessons] analyze skipped: BACKEND_URL or BACKEND_INTERNAL_SECRET missing");
    return false;
  }
  try {
    const res = await fetch(`${base}/api/lessons/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Backend-Secret": secret,
      },
      body: JSON.stringify({ lessonId }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok && res.status !== 202) {
      const body = await res.text();
      console.warn("[lessons] analyze trigger failed:", res.status, body);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[lessons] analyze trigger failed:", err);
    return false;
  }
}

export async function triggerIncidentAnalyze(incidentId: string): Promise<boolean> {
  const base = process.env.BACKEND_URL?.replace(/\/$/, "");
  const secret = process.env.BACKEND_INTERNAL_SECRET;
  if (!base || !secret) {
    console.warn("[incidents] analyze skipped: BACKEND_URL or BACKEND_INTERNAL_SECRET missing");
    return false;
  }
  try {
    const res = await fetch(`${base}/api/incidents/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Backend-Secret": secret,
      },
      body: JSON.stringify({ incidentId }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok && res.status !== 202) {
      const body = await res.text();
      console.warn("[incidents] analyze trigger failed:", res.status, body);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[incidents] analyze trigger failed:", err);
    return false;
  }
}
