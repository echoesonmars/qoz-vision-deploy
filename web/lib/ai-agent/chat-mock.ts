export type AiChatRole = "user" | "agent";

export type AiChatMessage = {
  id: string;
  role: AiChatRole;
  body: string;
  at: string;
};

export function formatChatTime(date: Date): string {
  return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export function createChatMessage(role: AiChatRole, body: string): AiChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    body,
    at: formatChatTime(new Date()),
  };
}

export type AgentChatTurn = {
  role: AiChatRole;
  body: string;
};
