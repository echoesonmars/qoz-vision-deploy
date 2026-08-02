"use client";

import { useMemo } from "react";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { buildDonutConfig, INCIDENT_COLORS } from "@/lib/analytics/chart-config";
import { ANALYTICS_DONUT_CHART_CLASS } from "@/lib/analytics/chart-layout";
import type { DonutSlice } from "@/lib/analytics/types";
import { Cell, Pie, PieChart, type PieLabelRenderProps } from "recharts";

type EnrichedDonutSlice = DonutSlice & {
  percent: number;
  color: string;
};

type AnalyticsDonutChartProps = {
  data: DonutSlice[];
  config?: ChartConfig;
};

const MIN_SLICE_LABEL_PERCENT = 5;

function formatPercentValue(percent: number, maximumFractionDigits = 1): string {
  return `${percent.toLocaleString("ru-RU", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  })}%`;
}

function enrichDonutSlices(data: DonutSlice[]): EnrichedDonutSlice[] {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  return data
    .map((slice, index) => ({
      ...slice,
      percent: total > 0 ? Math.round((slice.value / total) * 1000) / 10 : 0,
      color: INCIDENT_COLORS[index % INCIDENT_COLORS.length],
    }))
    .filter((slice) => slice.percent > 0);
}

function renderSliceLabel(props: PieLabelRenderProps) {
  const slice = props.payload as EnrichedDonutSlice | undefined;
  const percent = slice?.percent ?? (props.percent ?? 0) * 100;
  if (percent < MIN_SLICE_LABEL_PERCENT) return null;

  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const midAngle = Number(props.midAngle ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const radius = innerRadius + (outerRadius - innerRadius) * 0.52;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="hsl(var(--background))"
      textAnchor="middle"
      dominantBaseline="central"
      className="pointer-events-none text-[10px] font-semibold tabular-nums"
    >
      {`${Math.round(percent)}%`}
    </text>
  );
}

type DonutTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: EnrichedDonutSlice }>;
};

function DonutTooltip({ active, payload }: DonutTooltipProps) {
  if (!active || !payload?.length) return null;
  const slice = payload[0]?.payload;
  if (!slice) return null;

  return (
    <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="flex min-w-32 items-center justify-between gap-4">
        <span className="text-muted-foreground">{slice.label}</span>
        <span className="font-medium tabular-nums">{formatPercentValue(slice.percent)}</span>
      </div>
    </div>
  );
}

export function AnalyticsDonutChart({ data, config }: AnalyticsDonutChartProps) {
  const slices = useMemo(() => enrichDonutSlices(data), [data]);

  const chartConfig =
    config ??
    buildDonutConfig(
      slices.map((slice) => ({ key: slice.key, label: slice.label })),
      INCIDENT_COLORS,
    );

  return (
    <div className="flex flex-col gap-4">
      <ChartContainer config={chartConfig} className={ANALYTICS_DONUT_CHART_CLASS}>
        <PieChart>
          <ChartTooltip content={<DonutTooltip />} />
          <Pie
            data={slices}
            dataKey="percent"
            nameKey="label"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={2}
            isAnimationActive={false}
            label={renderSliceLabel}
            labelLine={false}
          >
            {slices.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {slices.map((slice) => (
          <li key={slice.key} className="flex min-w-0 items-center gap-2 text-xs">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
              aria-hidden
            />
            <span className="text-muted-foreground truncate">{slice.label}</span>
            <span className="text-foreground ml-auto font-medium tabular-nums">
              {formatPercentValue(slice.percent)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
