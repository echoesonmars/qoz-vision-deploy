"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MdAutoAwesome } from "react-icons/md";

type AiAgentFabProps = {
  open: boolean;
  onToggle: () => void;
};

export function AiAgentFab({ open, onToggle }: AiAgentFabProps) {
  return (
    <Button
      type="button"
      size="icon"
      aria-label={open ? "Закрыть Qoz Agent" : "Открыть Qoz Agent"}
      aria-expanded={open}
      onClick={onToggle}
      className={cn(
        "fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg ring-2 ring-primary/30",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl",
      )}
    >
      <MdAutoAwesome className="size-6" aria-hidden />
    </Button>
  );
}
