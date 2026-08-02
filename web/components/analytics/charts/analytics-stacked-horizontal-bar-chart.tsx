"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { INCIDENT_COLORS } from "@/lib/analytics/chart-config";
import type { SafetyLocationRow } from "@/lib/analytics/types";
import { ANALYTICS_CHART_CLASS } from "@/lib/analytics/chart-layout";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

type AnalyticsStackedHorizontalBarChartProps = {
  locations: SafetyLocationRow[];
};

export function AnalyticsStackedHorizontalBarChart({
  locations,
}: AnalyticsStackedHorizontalBarChartProps) {
  const typeKeys = [...new Set(locations.flatMap((l) => Object.keys(l.byType)))];
  const chartData = locations.map((loc) => {
    const row: Record<string, string | number> = { label: loc.label };
    for (const key of typeKeys) {
      row[key] = loc.byType[key] ?? 0;
    }
    return row;
  });

  const config = typeKeys.reduce<ChartConfig>((acc, key, i) => {
    acc[key] = { label: key, color: INCIDENT_COLORS[i % INCIDENT_COLORS.length] };
    return acc;
  }, {});

  return (
    <ChartContainer config={config} className={ANALYTICS_CHART_CLASS}>
      <BarChart
        data={chartData}
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
          width={110}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {typeKeys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="loc"
            fill={INCIDENT_COLORS[i % INCIDENT_COLORS.length]}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
