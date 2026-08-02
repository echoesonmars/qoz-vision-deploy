"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MdSend } from "react-icons/md";
import { useRef } from "react";

type AiAgentComposerProps = {
  disabled?: boolean;
  onSend: (text: string) => void | Promise<void>;
};

export function AiAgentComposer({ disabled, onSend }: AiAgentComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function submit() {
    const el = textareaRef.current;
    if (!el) return;
    const text = el.value.trim();
    if (!text) return;
    onSend(text);
    el.value = "";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex shrink-0 items-end gap-3 border-t border-border/60 p-4">
      <textarea
        ref={textareaRef}
        rows={2}
        disabled={disabled}
        placeholder="Спросите Qoz Agent…"
        onKeyDown={handleKeyDown}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50",
          "flex min-h-16 w-full min-w-0 resize-none rounded-lg border bg-transparent px-3 py-2 text-sm transition-colors outline-none",
          "focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />
      <Button
        type="button"
        size="icon"
        disabled={disabled}
        aria-label="Отправить сообщение"
        onClick={submit}
        className="size-9 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <MdSend className="size-4" aria-hidden />
      </Button>
    </div>
  );
}
