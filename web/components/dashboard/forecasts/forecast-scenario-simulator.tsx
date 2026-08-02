"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  summaryCardHeaderMuted,
  summaryCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import {
  simulatorBasePassPercent,
  simulatorGainPerHour,
  simulatorHoursMax,
  simulatorScenarios,
} from "@/lib/data/stubs/dashboard/forecasts-mock";
import { cn } from "@/lib/utils";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { MdTune } from "react-icons/md";

const chartConfig = {
  baseline: {
    label: "Без мер",
    color: "var(--muted-foreground)",
  },
  simulated: {
    label: "С мерами",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const scenarioMultiplier: Record<string, number> = {
  physics_extra: 1,
  teacher_swap: 0.85,
  chem_split: 1.1,
};

export function ForecastScenarioSimulator() {
  const [scenario, setScenario] = useState<string>(simulatorScenarios[0].value);
  const [hours, setHours] = useState([2]);

  const h = hours[0] ?? 0;
  const mult = scenarioMultiplier[scenario] ?? 1;

  const projected = Math.min(
    96,
    Math.round((simulatorBasePassPercent + h * simulatorGainPerHour * mult) * 10) / 10,
  );

  const chartData = useMemo(() => {
    const pts: { step: number; baseline: number; simulated: number }[] = [];
    for (let i = 0; i <= simulatorHoursMax; i += 1) {
      pts.push({
        step: i,
        baseline: simulatorBasePassPercent,
        simulated: Math.min(
          96,
          Math.round((simulatorBasePassPercent + i * simulatorGainPerHour * mult) * 10) / 10,
        ),
      });
    }
    return pts;
  }, [mult]);

  return (
    <Card className={summaryCardInteractive}>
      <CardHeader className={cn(summaryCardHeaderMuted, "space-y-2")}>
        <div className="flex items-start gap-3">
          <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-primary/20">
            <MdTune className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 space-y-1">
            <p className={summaryKicker}>Симулятор сценариев</p>
            <CardTitle className="text-lg font-semibold">Что если изменить процесс</CardTitle>
            <CardDescription className="max-w-3xl text-sm leading-relaxed">
              Задайте параметры: дополнительные часы или смена преподавателя — модель пересчитает
              прогноз доли успешной сдачи.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="forecast-scenario">Сценарий</Label>
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger id="forecast-scenario" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {simulatorScenarios.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-4 text-sm">
                <Label htmlFor="forecast-hours">Доп. часы (факультатив / сопровождение)</Label>
                <span className="text-primary font-medium tabular-nums">{h}</span>
              </div>
              <Slider
                id="forecast-hours"
                min={0}
                max={simulatorHoursMax}
                step={1}
                value={hours}
                onValueChange={setHours}
              />
            </div>
            <div className="bg-muted/40 rounded-xl border border-border/50 p-4 ring-1 ring-border/30">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Прогноз доли сдачи на целевой балл
              </p>
              <p className="text-primary mt-2 text-3xl font-semibold tabular-nums">
                {projected}%
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                База {simulatorBasePassPercent}% без дополнительных часов в этом сценарии
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 ring-1 ring-border/50">
            <ChartContainer config={chartConfig} className="aspect-auto min-h-64 w-full">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border/60"
                />
                <XAxis dataKey="step" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  domain={[60, 96]}
                  width={36}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="var(--color-baseline)"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="simulated"
                  stroke="var(--color-simulated)"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ChartContainer>
            <p className="text-muted-foreground pt-2 text-center text-xs">Ось X: доп. часы</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
