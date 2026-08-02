"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { pipelineStages } from "@/lib/data/stubs/checks/status-mock";
import { formatSharePercent } from "@/lib/director/format-metric-value";

export function ChecksStatusPipelineCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Конвейер обработки</p>
        <CardTitle className="text-lg font-semibold">Live Pipeline</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Поток бланков по этапам Sozley (демо-числа).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pt-0 sm:grid-cols-2 lg:grid-cols-5">
        {pipelineStages.map((stage) => {
          const progressPercent = Math.min(
            100,
            Math.round((stage.count / Math.max(1, stage.total)) * 100),
          );
          return (
          <div key={stage.id} className="rounded-xl border border-border/50 bg-muted/30 p-4 ring-1 ring-border/40">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {stage.title}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {stage.count}
              <span className="text-muted-foreground text-base font-normal"> / {stage.total}</span>
              <span className="text-muted-foreground ml-2 text-base font-normal">
                ({formatSharePercent(stage.count, stage.total, 0)})
              </span>
            </p>
            <Progress className="mt-3 h-2" value={progressPercent} />
          </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
