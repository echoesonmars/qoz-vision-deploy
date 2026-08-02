"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LiveCanvasContainerProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  children?: ReactNode;
  containerClassName?: string;
};

export function LiveCanvasContainer({ videoRef, children, containerClassName }: LiveCanvasContainerProps) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-black ring-1 ring-border/40",
        containerClassName,
      )}
    >
      <video ref={videoRef} className="h-full w-full object-contain" muted playsInline controls />
      {children}
    </div>
  );
}
