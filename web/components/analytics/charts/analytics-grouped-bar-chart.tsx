"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { waveChartConfig } from "@/lib/analytics/chart-config";
import { ANALYTICS_CHART_CLASS_TALL } from "@/lib/analytics/chart-layout";
import type { SmartClassData } from "@/lib/analytics/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
} from "recharts";

type WaveMode = "wave1" | "wave4" | "wave8" | "all";

type AnalyticsGroupedBarChartProps = {
  data: SmartClassData;
  waveMode: WaveMode;
};

function buildChartData(data: SmartClassData, waveMode: WaveMode) {
  return data.criteria.map((c) => {
    const row: Record<string, string | number> = {
      criterion: c.label.length > 18 ? `${c.label.slice(0, 16)}…` : c.label,
      fullLabel: c.label,
    };
    if (waveMode === "all" || waveMode === "wave1") row.wave1 = c.waves[0];
    if (waveMode === "all" || waveMode === "wave4") row.wave4 = c.waves[3];
    if (waveMode === "all" || waveMode === "wave8") row.wave8 = c.waves[7];
    return row;
  });
}

const modeConfig: Record<WaveMode, ChartConfig> = {
  wave1: { wave1: waveChartConfig.wave1 },
  wave4: { wave4: waveChartConfig.wave4 },
  wave8: { wave8: waveChartConfig.wave8 },
  all: waveChartConfig,
};

export function AnalyticsGroupedBarChart({
  data,
  waveMode,
}: AnalyticsGroupedBarChartProps) {
  const chartData = buildChartData(data, waveMode);
  const config = modeConfig[waveMode];

  return (
    <ChartContainer config={config} className={ANALYTICS_CHART_CLASS_TALL}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 4, bottom: 48 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis
          dataKey="criterion"
          tickLine={false}
          axisLine={false}
          angle={-35}
          textAnchor="end"
          height={72}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {(waveMode === "all" || waveMode === "wave1") && (
          <Bar dataKey="wave1" fill="var(--color-wave1)" radius={[4, 4, 0, 0]} />
        )}
        {(waveMode === "all" || waveMode === "wave4") && (
          <Bar dataKey="wave4" fill="var(--color-wave4)" radius={[4, 4, 0, 0]} />
        )}
        {(waveMode === "all" || waveMode === "wave8") && (
          <Bar dataKey="wave8" fill="var(--color-wave8)" radius={[4, 4, 0, 0]} />
        )}
      </BarChart>
    </ChartContainer>
  );
}
