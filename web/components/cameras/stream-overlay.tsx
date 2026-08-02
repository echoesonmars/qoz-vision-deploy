"use client";

import type { StreamOverlayBoxNormalized } from "@/lib/cameras/stream-protocol";
import { cn } from "@/lib/utils";

type StreamOverlayProps = {
  boxes: StreamOverlayBoxNormalized[];
  className?: string;
};

export function StreamOverlay({ boxes, className }: StreamOverlayProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      {boxes.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-md border-2 border-primary bg-primary/20 shadow-sm"
          style={{
            left: `${b.left * 100}%`,
            top: `${b.top * 100}%`,
            width: `${b.width * 100}%`,
            height: `${b.height * 100}%`,
          }}
        >
          {b.label ? (
            <span className="bg-background/80 text-foreground absolute -top-6 left-0 rounded px-1 text-xs">
              {b.label}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
