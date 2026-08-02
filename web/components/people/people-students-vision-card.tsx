"use client";

import { AdmLogo } from "@/components/brand/adm-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import type { StudentTwinData } from "@/lib/data/stubs/people/students-mock";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { MdVisibility } from "react-icons/md";

const chartConfig = {
  focus: {
    label: "Фокус, %",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

type PeopleStudentsVisionCardProps = {
  visionSeries: StudentTwinData["visionSeries"];
};

export function PeopleStudentsVisionCard({ visionSeries }: PeopleStudentsVisionCardProps) {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <AdmLogo size="xs" className="inline-block align-middle" />
        </p>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <MdVisibility className="size-5 shrink-0 text-primary" aria-hidden />
          Профиль внимания
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Вовлечённость по неделям четверти (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="aspect-video w-full max-h-72">
          <BarChart data={visionSeries} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="focusPercent" fill="var(--primary)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
