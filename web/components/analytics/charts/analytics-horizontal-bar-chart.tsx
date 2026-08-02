"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DurationBar } from "@/lib/analytics/types";
import { ANALYTICS_CHART_CLASS } from "@/lib/analytics/chart-layout";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const config = {
  value: { label: "Тыс. фреймов", color: "hsl(142 71% 45%)" },
} satisfies ChartConfig;

type AnalyticsHorizontalBarChartProps = {
  data: DurationBar[];
};

export function AnalyticsHorizontalBarChart({ data }: AnalyticsHorizontalBarChartProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <ChartContainer config={config} className={ANALYTICS_CHART_CLASS}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={100}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
