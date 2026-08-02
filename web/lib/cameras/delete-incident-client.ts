import type { IncidentRow } from "@/lib/incidents-types";

export async function requestDeleteIncident(incident: IncidentRow): Promise<void> {
  if (incident.analysis_status === "processing") {
    await fetch("/api/incidents/cancel-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incidentId: incident.id }),
      credentials: "same-origin",
    }).catch(() => {});
  }

  const res = await fetch("/api/incidents/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ incidentId: incident.id }),
  });

  let data: { error?: string } = {};
  try {
    data = (await res.json()) as { error?: string };
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.error ?? res.statusText);
  }
}
