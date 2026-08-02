"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ANALYTICS_CHART_CLASS } from "@/lib/analytics/chart-layout";
import type { SafetyLocationRow } from "@/lib/analytics/types";
import { Treemap } from "recharts";

type AnalyticsTreemapChartProps = {
  locations: SafetyLocationRow[];
};

const COLORS = [
  "hsl(142 71% 45%)",
  "hsl(199 89% 48%)",
  "hsl(38 92% 50%)",
  "hsl(262 83% 58%)",
];

const config = {
  size: { label: "Видеозаписи", color: "hsl(142 71% 45%)" },
} satisfies ChartConfig;

export function AnalyticsTreemapChart({ locations }: AnalyticsTreemapChartProps) {
  const data = locations.map((l, index) => ({
    name: l.label,
    size: l.videoCount,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <ChartContainer config={config} className={ANALYTICS_CHART_CLASS}>
      <Treemap
        data={data}
        dataKey="size"
        nameKey="name"
        stroke="hsl(var(--background))"
        isAnimationActive={false}
      >
        <ChartTooltip content={<ChartTooltipContent />} />
      </Treemap>
    </ChartContainer>
  );
}
