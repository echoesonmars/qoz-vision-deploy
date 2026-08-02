"use client";

import { admConnectedDotClass } from "@/lib/brand/ui-classes";
import { cn } from "@/lib/utils";

type ConnectionStatusProps = {
  connected: boolean;
  label?: string;
};

export function ConnectionStatus({ connected, label }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          "size-2 rounded-full",
          connected ? admConnectedDotClass : "bg-muted-foreground",
        )}
        aria-hidden
      />
      <span className="text-muted-foreground">
        {label ?? (connected ? "WebSocket активен" : "Нет соединения")}
      </span>
    </div>
  );
}
