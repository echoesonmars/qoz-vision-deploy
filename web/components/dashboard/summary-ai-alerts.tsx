"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  summaryCardHeaderMuted,
  summaryCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { aiAlerts, type SummaryAlertSeverity } from "@/lib/data/stubs/dashboard/summary-mock";
import {
  MdCheckCircle,
  MdOutlineReportProblem,
  MdSmartToy,
  MdWarningAmber,
} from "react-icons/md";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const severityMeta: Record<
  SummaryAlertSeverity,
  {
    badge: string;
    border: string;
    icon: ReactNode;
  }
> = {
  discipline: {
    badge: "Критично",
    border: "border-l-destructive",
    icon: <MdOutlineReportProblem className="size-4 text-destructive" aria-hidden />,
  },
  performance: {
    badge: "Внимание",
    border: "border-l-[var(--status-warning)]",
    icon: <MdWarningAmber className="size-4 text-[var(--status-warning)]" aria-hidden />,
  },
  success: {
    badge: "Успех",
    border: "border-l-primary",
    icon: <MdCheckCircle className="size-4 text-primary" aria-hidden />,
  },
};

export function SummaryAiAlerts() {
  return (
    <Card className={cn(summaryCardInteractive, "flex h-full min-h-0 flex-col")}>
      <CardHeader
        className={cn(summaryCardHeaderMuted, "flex flex-row items-start gap-3")}
      >
        <span className="bg-destructive/10 text-destructive flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-destructive/20">
          <MdSmartToy className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 space-y-1">
          <p className={summaryKicker}>Оперативный контроль</p>
          <CardTitle className="text-lg font-semibold leading-snug">
            ИИ-оповещения
          </CardTitle>
          <CardDescription className="leading-relaxed">
            События, которые требуют реакции администрации
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 pt-2">
        {aiAlerts.map((item) => {
          const meta = severityMeta[item.severity];
          return (
            <div
              key={item.id}
              className={cn(
                "bg-card/80 rounded-xl border-l-4 p-4 ring-1 ring-border/50",
                "transition-all duration-200 hover:bg-muted/50 hover:shadow-sm hover:ring-primary/15",
                meta.border,
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                {meta.icon}
                <span className="font-semibold">{item.title}</span>
                <Badge variant="outline" className="font-normal">
                  {meta.badge}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed border-t border-border/40 pt-3">
                {item.body}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
