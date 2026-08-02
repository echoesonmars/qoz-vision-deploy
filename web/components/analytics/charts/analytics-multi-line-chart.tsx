"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { actionChartConfig, emotionChartConfig } from "@/lib/analytics/chart-config";
import type { TimelinePoint } from "@/lib/analytics/types";
import { ANALYTICS_CHART_CLASS } from "@/lib/analytics/chart-layout";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";

type AnalyticsMultiLineChartProps = {
  data: TimelinePoint[];
  keys: string[];
  config: ChartConfig;
  logScale?: boolean;
  xLabel?: string;
};

export function AnalyticsActionsLineChart({
  data,
  logScale,
}: {
  data: TimelinePoint[];
  logScale?: boolean;
}) {
  const keys = ["writes", "reads", "listens", "phone", "sits"];
  return (
    <AnalyticsMultiLineChart
      data={data}
      keys={keys}
      config={actionChartConfig}
      logScale={logScale}
      xLabel="Минуты"
    />
  );
}

export function AnalyticsEmotionsLineChart({ data }: { data: TimelinePoint[] }) {
  const keys = ["calm", "focused", "anxious", "sad", "happy"];
  return (
    <AnalyticsMultiLineChart
      data={data}
      keys={keys}
      config={emotionChartConfig}
      xLabel="Минуты"
    />
  );
}

const LINE_COLORS = [
  "hsl(142 71% 45%)",
  "hsl(199 89% 48%)",
  "hsl(38 92% 50%)",
  "hsl(0 84% 60%)",
  "hsl(262 83% 58%)",
  "hsl(173 58% 39%)",
  "hsl(215 16% 47%)",
];

function AnalyticsMultiLineChart({
  data,
  keys,
  config,
  logScale,
  xLabel,
}: AnalyticsMultiLineChartProps) {
  return (
    <ChartContainer config={config} className={ANALYTICS_CHART_CLASS}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis
          dataKey="minute"
          tickLine={false}
          axisLine={false}
          label={xLabel ? { value: xLabel, position: "insideBottom", offset: -2 } : undefined}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          scale={logScale ? "log" : "auto"}
          domain={logScale ? [0.01, "auto"] : [0, "auto"]}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {keys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={LINE_COLORS[i % LINE_COLORS.length]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
