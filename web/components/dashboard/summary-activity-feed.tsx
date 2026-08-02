"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  summaryCardHeaderMuted,
  summaryCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { liveActivityItems } from "@/lib/data/stubs/dashboard/summary-mock";
import { MdHistory, MdSchedule } from "react-icons/md";
import { cn } from "@/lib/utils";

export function SummaryActivityFeed() {
  return (
    <Card className={cn(summaryCardInteractive, "flex h-full min-h-0 flex-col")}>
      <CardHeader
        className={cn(summaryCardHeaderMuted, "flex flex-row items-start gap-3")}
      >
        <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-primary/20 transition-transform duration-200 group-hover/card:scale-105">
          <MdHistory className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 space-y-1">
          <p className={summaryKicker}>Лента</p>
          <CardTitle className="text-lg font-semibold leading-snug">
            Живая активность
          </CardTitle>
          <CardDescription className="leading-relaxed">
            Хронология событий в реальном времени
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col pb-5 pt-2">
        <div className="relative min-h-88 flex-1">
          <ScrollArea className="absolute inset-0 pr-3">
            <ul className="flex flex-col gap-2 pb-1">
              {liveActivityItems.map((row, idx) => (
                <li
                  key={`${row.time}-${idx}`}
                  className={cn(
                    "flex gap-3 rounded-lg border border-transparent px-3 py-3 text-sm leading-relaxed",
                    "transition-colors duration-200 hover:border-border/80 hover:bg-muted/50",
                  )}
                >
                  <span className="text-primary flex shrink-0 items-center gap-1.5 font-mono text-xs tabular-nums">
                    <MdSchedule className="size-4 shrink-0 opacity-80" aria-hidden />
                    {row.time}
                  </span>
                  <span className="text-foreground min-w-0">{row.text}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
