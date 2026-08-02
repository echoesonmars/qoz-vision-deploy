"use client";

import { AiAgentChatPanel } from "@/components/ai-agent/ai-agent-chat-panel";
import { AiAgentFab } from "@/components/ai-agent/ai-agent-fab";
import {
  createChatMessage,
  type AiChatMessage,
} from "@/lib/ai-agent/chat-mock";
import { useCallback, useState } from "react";

export function AiAgentChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSend = useCallback(async (text: string) => {
    const userMessage = createChatMessage("user", text);
    let historySnapshot: AiChatMessage[] = [];
    setMessages((prev) => {
      historySnapshot = [...prev, userMessage];
      return historySnapshot;
    });
    setSending(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historySnapshot.map((m) => ({ role: m.role, body: m.body })),
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Не удалось получить ответ");
      }
      setMessages((prev) => [...prev, createChatMessage("agent", data.reply ?? "")]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Не удалось получить ответ";
      setMessages((prev) => [...prev, createChatMessage("agent", msg)]);
    } finally {
      setSending(false);
    }
  }, []);

  return (
    <>
      <AiAgentChatPanel
        open={open}
        messages={messages}
        sending={sending}
        onClose={handleClose}
        onSend={handleSend}
      />
      <AiAgentFab open={open} onToggle={handleToggle} />
    </>
  );
}
