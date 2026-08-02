"use client";

import { AdmLogo } from "@/components/brand/adm-logo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { metricEngagementRadarConfig } from "@/components/dashboard/metrics/metric-chart-config";
import {
  metricFeatureCardClass,
  metricFeatureChartPanelClass,
  metricFeatureContentClass,
  MetricFeatureHeader,
} from "@/components/dashboard/metrics/metric-feature-shell";
import { engagementIndex, engagementRadarData } from "@/lib/data/stubs/dashboard/summary-mock";
import { cn } from "@/lib/utils";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { MdPsychology } from "react-icons/md";

export function MetricEngagementCard() {
  return (
    <Card className={metricFeatureCardClass}>
      <MetricFeatureHeader
        icon={<MdPsychology className="size-4" aria-hidden />}
        kicker={<AdmLogo size="xs" />}
        title="Индекс вовлечённости школы"
        description="Профиль фокуса внимания на уроках 1–6"
        trailing={
          <Badge variant="secondary" className="shrink-0 tabular-nums">
            {engagementIndex}%
          </Badge>
        }
      />
      <CardContent className={metricFeatureContentClass}>
        <div
          className={cn(metricFeatureChartPanelClass, "items-center justify-center")}
          role="img"
          aria-label={`Вовлечённость ${engagementIndex}%, radar по шести урокам`}
        >
          <ChartContainer
            config={metricEngagementRadarConfig}
            className="mx-auto aspect-square min-h-0 w-full max-w-xs flex-1"
            initialDimension={{ width: 280, height: 280 }}
          >
            <RadarChart data={engagementRadarData} margin={{ top: 8, right: 16, left: 16, bottom: 8 }}>
              <PolarGrid className="stroke-border/50" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis
                angle={90}
                domain={[50, 90]}
                tickCount={4}
                tick={{ fontSize: 9 }}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Radar
                name="focus"
                dataKey="focus"
                stroke="var(--color-focus)"
                fill="var(--color-focus)"
                fillOpacity={0.28}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </RadarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
