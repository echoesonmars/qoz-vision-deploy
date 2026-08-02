const INTEGRATION_ACTOR_LABELS: Record<string, string> = {
  "Система Qoz": "Видеоаналитика ADM",
};

export function formatIntegrationActorLabel(actor: string): string {
  return INTEGRATION_ACTOR_LABELS[actor] ?? actor;
}
