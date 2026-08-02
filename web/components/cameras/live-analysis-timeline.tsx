"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { checksCardHeader, checksCardInteractive, summaryKicker } from "@/components/dashboard/summary-card-shell";
import { formatLiveClock, formatOffset } from "@/lib/cameras/format-live-time";
import type { LiveAnalysisSnapshot } from "@/lib/cameras/live-analysis-types";
import { MdHistory, MdSchedule } from "react-icons/md";
import { cn } from "@/lib/utils";

type LiveAnalysisTimelineProps = {
  snapshots: LiveAnalysisSnapshot[];
};

export function LiveAnalysisTimeline({ snapshots }: LiveAnalysisTimelineProps) {
  return (
    <Card className={cn(checksCardInteractive, "flex min-h-0 flex-col")}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdHistory className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Таймлайн
        </p>
        <CardTitle className="text-lg font-semibold">Лог анализа</CardTitle>
        <CardDescription>Хронология снимков с сервера</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 pt-0">
        {snapshots.length === 0 ? (
          <p className="text-muted-foreground text-sm">Пока нет записей.</p>
        ) : (
          <ScrollArea className="h-72 pr-3">
            <ul className="flex flex-col gap-2">
              {snapshots.map((row) => {
                const score = row.engagementScore ?? row.payload.analytics_meta.overall_engagement_score;
                const inc = row.incidentCount;
                return (
                  <li
                    key={row.id}
                    className="flex gap-3 rounded-lg border border-border/60 px-3 py-3 text-sm transition-colors hover:bg-muted/50"
                  >
                    <span className="text-primary flex shrink-0 flex-col font-mono text-xs tabular-nums">
                      <span className="flex items-center gap-1">
                        <MdSchedule className="size-3.5 opacity-80" aria-hidden />
                        {formatLiveClock(row.capturedAt)}
                      </span>
                      <span className="text-muted-foreground mt-0.5">
                        +{formatOffset(row.sessionOffsetSec)}
                      </span>
                    </span>
                    <span className="min-w-0 leading-relaxed">
                      <span className="font-medium text-primary tabular-nums">{Math.round(score)}%</span>
                      {" · "}
                      учеников {row.payload.classroom_visual_behavior.students_count_detected}
                      {inc > 0 ? (
                        <span className="text-destructive"> · инцидентов: {inc}</span>
                      ) : (
                        <span className="text-muted-foreground"> · без инцидентов</span>
                      )}
                      <span className="text-muted-foreground mt-1 block text-xs">
                        {row.payload.classroom_visual_behavior.general_focus_description}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
