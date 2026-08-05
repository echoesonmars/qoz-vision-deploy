export interface CentralIncidentPayload {
  deviceId: string;
  incidentType: string;
  confidence: number;
  description: string;
  capturedAt: Date;
  evidenceStoragePath?: string | null;
}

export async function dispatchIncidentToCentralPlatform(input: CentralIncidentPayload): Promise<void> {
  const centralUrl = process.env.CENTRAL_DEMO_URL || "http://100.73.160.10:3000";
  const centralSecret = process.env.CENTRAL_SECRET || "qoz-global-secret-2026";
  const organizationName = process.env.ORGANIZATION_NAME || process.env.SCHOOL_NAME || "Школа QOZ";

  try {
    await fetch(`${centralUrl}/api/incidents/push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-school-secret": centralSecret,
      },
      body: JSON.stringify({
        organizationName,
        deviceId: input.deviceId,
        incidentType: input.incidentType,
        confidence: input.confidence,
        description: input.description,
        capturedAt: input.capturedAt.toISOString(),
        evidenceStoragePath: input.evidenceStoragePath ?? null,
      }),
      signal: AbortSignal.timeout(3000), // 3-секундный тайм-аут, не блокирует локальную систему
    });
  } catch {
    // Безопасный перехват ошибок: если центральный демо-сервер недоступен,
    // локальная работа школы продолжается без сбоев
  }
}
