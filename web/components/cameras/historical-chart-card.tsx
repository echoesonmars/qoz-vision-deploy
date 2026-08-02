"use client";

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
import { checksCardHeader, checksCardInteractive, summaryKicker } from "@/components/dashboard/summary-card-shell";
import { engagementHistoryWeek } from "@/lib/data/stubs/cameras/engagement-history-mock";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { MdShowChart } from "react-icons/md";

const chartConfig = {
  value: {
    label: "Вовлечённость, %",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function HistoricalChartCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdShowChart className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          История
        </p>
        <CardTitle className="text-lg font-semibold">Неделя (демо)</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Динамика вовлечённости по мок-данным из локального модуля.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="aspect-video w-full max-h-80">
          <AreaChart data={engagementHistoryWeek} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="engFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              fill="url(#engFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
