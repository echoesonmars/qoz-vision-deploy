"use client";

import { AdmLogo } from "@/components/brand/adm-logo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { metricAttendanceConfig } from "@/components/dashboard/metrics/metric-chart-config";
import {
  metricFeatureCardClass,
  metricFeatureChartPanelClass,
  metricFeatureContentClass,
  MetricFeatureHeader,
} from "@/components/dashboard/metrics/metric-feature-shell";
import {
  attendancePercent,
  attendanceSparkline,
  attendanceTotalStudents,
  attendanceTrendPercent,
  attendanceVisitedStudents,
} from "@/lib/data/stubs/dashboard/summary-mock";
import { cn } from "@/lib/utils";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { MdGroups } from "react-icons/md";

export function MetricAttendanceCard() {
  return (
    <Card className={metricFeatureCardClass}>
      <MetricFeatureHeader
        icon={<MdGroups className="size-5" aria-hidden />}
        kicker={<AdmLogo size="xs" />}
        title={
          <span className="tabular-nums">
            Текущая посещаемость · {attendancePercent}%
          </span>
        }
        description={
          <span className="tabular-nums">
            Всего {attendanceTotalStudents} · посетили {attendanceVisitedStudents} учеников (
            {attendancePercent}%)
          </span>
        }
        trailing={
          <Badge variant="default" className="shrink-0">
            +{attendanceTrendPercent}% к вчера
          </Badge>
        }
      />
      <CardContent className={metricFeatureContentClass}>
        <div
          className={cn(metricFeatureChartPanelClass)}
          role="img"
          aria-label={`Посещаемость ${attendancePercent}%, всего ${attendanceTotalStudents}, посетили ${attendanceVisitedStudents}`}
        >
          <ChartContainer
            config={metricAttendanceConfig}
            className="aspect-auto min-h-0 w-full flex-1"
          >
            <AreaChart
              data={attendanceSparkline}
              margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
            >
              <defs>
                <linearGradient id="attendanceMetricFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-v)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-v)" stopOpacity={0.06} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
              <XAxis dataKey="i" hide />
              <YAxis
                width={40}
                domain={["dataMin - 2", "dataMax + 1"]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="natural"
                dataKey="v"
                stroke="var(--color-v)"
                strokeWidth={2}
                fill="url(#attendanceMetricFill)"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
