"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { platformChartConfig } from "@/lib/analytics/chart-config";
import { ANALYTICS_CHART_CLASS } from "@/lib/analytics/chart-layout";
import type { PlatformMetricsData } from "@/lib/analytics/types";
import { AnalyticsChartCard } from "@/components/analytics/charts/analytics-chart-card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type AnalyticsPlatformBarChartsProps = {
  data: PlatformMetricsData;
};

export function AnalyticsPlatformBarCharts({ data }: AnalyticsPlatformBarChartsProps) {
  const sampled = data.daily.filter((_, i) => i % 3 === 0 || i === data.daily.length - 1);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <AnalyticsChartCard
        kicker="Платформа"
        title="Video path по дате"
        description={`Итого: ${(data.totalVideoPaths / 1_000_000).toFixed(2)} млн`}
      >
        <ChartContainer config={platformChartConfig} className={ANALYTICS_CHART_CLASS}>
          <BarChart data={sampled} margin={{ top: 8, right: 8, left: 4, bottom: 32 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="videoPathThousands"
              fill="var(--color-videoPathThousands)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </AnalyticsChartCard>
      <AnalyticsChartCard
        kicker="Платформа"
        title="Уроки по дате"
        description={`Итого снято: ${data.totalLessons}`}
      >
        <ChartContainer config={platformChartConfig} className={ANALYTICS_CHART_CLASS}>
          <BarChart data={sampled} margin={{ top: 8, right: 8, left: 4, bottom: 32 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="lessons"
              fill="var(--color-lessons)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </AnalyticsChartCard>
    </div>
  );
}
