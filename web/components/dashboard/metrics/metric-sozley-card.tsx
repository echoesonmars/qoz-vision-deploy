"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { metricSozleyAreaConfig } from "@/components/dashboard/metrics/metric-chart-config";
import {
  metricFeatureCardClass,
  metricFeatureChartPanelClass,
  metricFeatureContentClass,
  MetricFeatureHeader,
} from "@/components/dashboard/metrics/metric-feature-shell";
import { sozleyFlowArea, sozleyProcessedToday } from "@/lib/data/stubs/dashboard/summary-mock";
import { cn } from "@/lib/utils";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function MetricSozleyCard() {
  return (
    <Card className={metricFeatureCardClass}>
      <MetricFeatureHeader
        icon={<MdAssignmentTurnedIn className="size-4" aria-hidden />}
        kicker="Sozley"
        title={
          <span className="tabular-nums">Статус проверок · {sozleyProcessedToday} работ</span>
        }
        description="Накопление проверенных работ и очереди за сегодня"
      />
      <CardContent className={cn(metricFeatureContentClass, "gap-2 pb-4")}>
        <div
          className={cn(metricFeatureChartPanelClass, "min-h-0 flex-1 justify-center")}
          role="img"
          aria-label={`Sozley: ${sozleyProcessedToday} работ за сегодня`}
        >
          <ChartContainer
            config={metricSozleyAreaConfig}
            className="aspect-auto min-h-0 w-full flex-1"
            initialDimension={{ width: 360, height: 176 }}
          >
            <AreaChart data={sozleyFlowArea} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="sozleyVerifiedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-verified)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-verified)" stopOpacity={0.06} />
                </linearGradient>
                <linearGradient id="sozleyPendingFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-pending)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-pending)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis
                dataKey="slot"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                tick={{ fontSize: 10 }}
              />
              <YAxis width={36} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="verified"
                stackId="sozley"
                stroke="var(--color-verified)"
                strokeWidth={2}
                fill="url(#sozleyVerifiedFill)"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="sozley"
                stroke="var(--color-pending)"
                strokeWidth={2}
                fill="url(#sozleyPendingFill)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
        <p className="text-muted-foreground shrink-0 border-t border-border/50 bg-muted/20 rounded-lg px-3 py-2 text-center text-[11px]">
          Поток ИИ без простоя
        </p>
      </CardContent>
    </Card>
  );
}
