"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MetricChartPanelProps = {
  children: ReactNode;
  className?: string;
  ariaLabel: string;
};

export function MetricChartPanel({
  children,
  className,
  ariaLabel,
}: MetricChartPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-muted/40 p-2 ring-1 ring-border/40 transition-colors group-hover/card:bg-muted/50",
        className,
      )}
      role="img"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
