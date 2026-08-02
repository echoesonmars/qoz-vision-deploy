"use client";

import { useMemo } from "react";
import { AdmLogo } from "@/components/brand/adm-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  summaryCardHeaderMuted,
  summaryCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import {
  engagementByLesson,
  getEngagementHighlights,
} from "@/lib/data/stubs/dashboard/summary-mock";
import { cn } from "@/lib/utils";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { MdShowChart } from "react-icons/md";

const chartConfig = {
  focus: {
    label: "Фокус, %",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const CHART_PANEL_MIN = "min-h-[18rem]";

export function SummaryEngagementChart() {
  const { dayAvg, bestLesson, worstLesson } = getEngagementHighlights();

  const focusDomain = useMemo((): [number, number] => {
    const vals = engagementByLesson.map((d) => d.focus);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const pad = 6;
    return [Math.max(0, lo - pad), Math.min(100, hi + pad)];
  }, []);

  return (
    <Card className={cn(summaryCardInteractive, "flex h-full min-h-0 flex-col")}>
      <CardHeader className={cn(summaryCardHeaderMuted, "gap-3")}>
        <div className="flex items-start gap-3">
          <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-primary/20 transition-transform duration-200 group-hover/card:scale-105">
            <MdShowChart className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <p className={summaryKicker}>Живая аналитика</p>
              <CardTitle className="mt-1 text-lg font-semibold leading-snug">
                Индекс вовлечённости по урокам
              </CardTitle>
            </div>
            <CardDescription className="flex flex-wrap items-center gap-2 text-sm leading-relaxed">
              <AdmLogo size="xs" />
              <span>фокус внимания школы с 1-го по 6-й урок (сегодня)</span>
            </CardDescription>
            <div
              className="bg-muted/50 flex h-10 items-end gap-1 rounded-md px-1.5 py-1.5 ring-1 ring-border/40"
              role="img"
              aria-label="Мини-сводка фокуса по шести урокам"
            >
              {engagementByLesson.map((r) => (
                <div
                  key={r.lesson}
                  className="bg-primary/80 min-h-2 flex-1 rounded-sm"
                  style={{ height: `${8 + (r.focus / 100) * 28}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-2 min-h-0">
        <div className="flex flex-wrap gap-2">
          <span className="text-muted-foreground rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 text-xs">
            Срез за сегодня · среднее{" "}
            <span className="text-primary font-medium tabular-nums">{dayAvg}%</span>
          </span>
          <span className="text-muted-foreground rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 text-xs">
            Лучший урок{" "}
            <span className="text-primary font-medium tabular-nums">{bestLesson}</span>
          </span>
          <span className="text-muted-foreground rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 text-xs">
            Слабее всего урок{" "}
            <span className="text-primary font-medium tabular-nums">{worstLesson}</span>
          </span>
        </div>
        <div
          className={cn(
            "rounded-xl bg-muted/20 p-3 ring-1 ring-border/50 transition-colors group-hover/card:bg-muted/30",
            CHART_PANEL_MIN,
            "flex min-h-0 flex-1 flex-col",
          )}
        >
          <ChartContainer
            config={chartConfig}
            className={cn("aspect-auto w-full flex-1", CHART_PANEL_MIN)}
          >
            <AreaChart
              data={engagementByLesson}
              margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
            >
              <defs>
                <linearGradient id="engagementAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-focus)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-focus)" stopOpacity={0.06} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                className="stroke-border/60"
              />
              <XAxis
                dataKey="lesson"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                width={38}
                domain={focusDomain}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="natural"
                dataKey="focus"
                stroke="var(--color-focus)"
                strokeWidth={2}
                fill="url(#engagementAreaFill)"
                dot={{ r: 3, fill: "var(--color-focus)" }}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
