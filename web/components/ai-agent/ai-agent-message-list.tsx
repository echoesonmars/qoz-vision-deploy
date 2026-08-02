"use client";

import { AiAgentMarkdown } from "@/components/ai-agent/ai-agent-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AiChatMessage } from "@/lib/ai-agent/chat-mock";
import { cn } from "@/lib/utils";

type AiAgentMessageListProps = {
  messages: AiChatMessage[];
};

export function AiAgentMessageList({ messages }: AiAgentMessageListProps) {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <ul className="flex flex-col gap-3 p-4">
        {messages.map((m) => (
          <li
            key={m.id}
            className={cn(
              "flex flex-col gap-1",
              m.role === "user" ? "items-end" : "items-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-xl p-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/60 bg-muted/30 text-foreground",
              )}
            >
              <AiAgentMarkdown content={m.body} variant={m.role} />
            </div>
            <span className="text-muted-foreground text-xs">{m.at}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
