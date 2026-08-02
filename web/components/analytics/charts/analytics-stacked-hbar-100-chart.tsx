"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { actionChartConfig, emotionChartConfig } from "@/lib/analytics/chart-config";
import type { StudentActionRow, StudentEmotionRow } from "@/lib/analytics/types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { ANALYTICS_CHART_CLASS_TALL } from "@/lib/analytics/chart-layout";

const ACTION_KEYS = ["writes", "reads", "sits", "phone", "listens", "speaks", "eats", "stands", "other"] as const;
const EMOTION_KEYS = ["calm", "focused", "anxious", "sad", "happy"] as const;

const ACTION_COLORS = ACTION_KEYS.map((k) => actionChartConfig[k]?.color ?? "hsl(220 9% 46%)");
const EMOTION_COLORS = EMOTION_KEYS.map((k) => emotionChartConfig[k]?.color ?? "hsl(220 9% 46%)");

type AnalyticsStackedHbar100ChartProps =
  | {
      mode: "actions";
      rows: StudentActionRow[];
      onStudentClick?: (studentId: string) => void;
    }
  | {
      mode: "emotions";
      rows: StudentEmotionRow[];
      onStudentClick?: (studentId: string) => void;
    };

export function AnalyticsStackedHbar100Chart(props: AnalyticsStackedHbar100ChartProps) {
  const { navigate } = useAppNavigation();
  const isActions = props.mode === "actions";
  const keys = isActions ? ACTION_KEYS : EMOTION_KEYS;
  const colors = isActions ? ACTION_COLORS : EMOTION_COLORS;
  const config = (isActions ? actionChartConfig : emotionChartConfig) as ChartConfig;

  const chartData = props.rows.map((row) => {
    const shares = row.shares as Record<string, number>;
    const entry: Record<string, string | number> = {
      name: row.studentName,
      studentId: row.studentId,
    };
    for (const key of keys) {
      entry[key] = Math.round((shares[key] ?? 0) * 100);
    }
    return entry;
  });

  const handleClick = (studentId: string) => {
    if (props.onStudentClick) {
      props.onStudentClick(studentId);
    } else {
      navigate({ to: "student", studentId, from: "analytics-lesson" });
    }
  };

  return (
    <ChartContainer config={config} className={ANALYTICS_CHART_CLASS_TALL}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
        onClick={(state) => {
          const chartState = state as {
            activePayload?: { payload?: { studentId?: string } }[];
          };
          const payload = chartState.activePayload?.[0]?.payload;
          if (payload?.studentId) handleClick(payload.studentId);
        }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={88}
          tick={{ fontSize: 10, cursor: "pointer" }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {keys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={colors[i]}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
