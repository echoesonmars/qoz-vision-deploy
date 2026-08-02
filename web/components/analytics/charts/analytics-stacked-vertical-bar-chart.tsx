"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { INCIDENT_COLORS } from "@/lib/analytics/chart-config";
import { ANALYTICS_CHART_CLASS } from "@/lib/analytics/chart-layout";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

type StackedRow = Record<string, string | number>;

type AnalyticsStackedVerticalBarChartProps = {
  data: StackedRow[];
  stackKeys: { key: string; label: string }[];
  xKey?: string;
};

export function AnalyticsStackedVerticalBarChart({
  data,
  stackKeys,
  xKey = "label",
}: AnalyticsStackedVerticalBarChartProps) {
  const config = stackKeys.reduce<ChartConfig>((acc, sk, i) => {
    acc[sk.key] = { label: sk.label, color: INCIDENT_COLORS[i % INCIDENT_COLORS.length] };
    return acc;
  }, {});

  return (
    <ChartContainer config={config} className={ANALYTICS_CHART_CLASS}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 32 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {stackKeys.map((sk, i) => (
          <Bar
            key={sk.key}
            dataKey={sk.key}
            stackId="stack"
            fill={INCIDENT_COLORS[i % INCIDENT_COLORS.length]}
            radius={i === stackKeys.length - 1 ? [4, 4, 0, 0] : undefined}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
