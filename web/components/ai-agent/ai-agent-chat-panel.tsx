"use client";

import { AiAgentComposer } from "@/components/ai-agent/ai-agent-composer";
import { AiAgentMessageList } from "@/components/ai-agent/ai-agent-message-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AiChatMessage } from "@/lib/ai-agent/chat-mock";
import { cn } from "@/lib/utils";
import { MdClose, MdPsychology } from "react-icons/md";

type AiAgentChatPanelProps = {
  open: boolean;
  messages: AiChatMessage[];
  sending: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
};

export function AiAgentChatPanel({
  open,
  messages,
  sending,
  onClose,
  onSend,
}: AiAgentChatPanelProps) {
  return (
    <Card
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed bottom-24 right-6 z-50 flex h-[32rem] max-h-[70vh] w-96 flex-col gap-0 overflow-hidden rounded-2xl py-0 shadow-lg ring-1 ring-border/60",
        "transition-all duration-200 ease-out",
        "data-[state=open]:pointer-events-auto data-[state=open]:translate-y-0 data-[state=open]:opacity-100",
        "data-[state=closed]:pointer-events-none data-[state=closed]:translate-y-4 data-[state=closed]:opacity-0",
      )}
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-border/60 p-4">
        <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30">
          <MdPsychology className="size-5" aria-hidden />
        </span>
        <h2 className="min-w-0 flex-1 text-base font-semibold leading-snug">Qoz Agent</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Закрыть чат"
          onClick={onClose}
          className="shrink-0"
        >
          <MdClose className="size-4" aria-hidden />
        </Button>
      </header>
      <AiAgentMessageList messages={messages} />
      <AiAgentComposer disabled={sending} onSend={onSend} />
    </Card>
  );
}
