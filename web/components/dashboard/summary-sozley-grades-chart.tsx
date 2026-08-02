"use client";

import { useMemo, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  summaryCardHeaderMuted,
  summaryCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import {
  getSozleyBars,
  getSozleyHighlightStats,
  SOZLEY_PARALLELS,
  SOZLEY_SUBJECTS,
  type SozleyParallelKey,
  type SozleySubjectKey,
} from "@/lib/data/stubs/dashboard/summary-mock";
import { cn } from "@/lib/utils";
import { formatSharePercent } from "@/lib/director/format-metric-value";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { MdBarChart } from "react-icons/md";

const barConfig = {
  count: {
    label: "Работ",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function SummarySozleyGradesChart() {
  const [subject, setSubject] = useState<SozleySubjectKey>("math");
  const [parallel, setParallel] = useState<SozleyParallelKey>("10");

  const data = useMemo(() => getSozleyBars(subject, parallel), [subject, parallel]);

  const { totalWorks, avgGrade } = useMemo(
    () => getSozleyHighlightStats(data),
    [data],
  );

  const barYMax = useMemo(() => {
    const m = Math.max(1, ...data.map((d) => d.count));
    return m + Math.max(2, Math.ceil(m * 0.15));
  }, [data]);

  const subjectLabel =
    SOZLEY_SUBJECTS.find((s) => s.value === subject)?.label ?? "";
  const parallelLabel =
    SOZLEY_PARALLELS.find((p) => p.value === parallel)?.label ?? "";

  return (
    <Card className={cn(summaryCardInteractive, "flex h-full min-h-0 flex-col")}>
      <CardHeader className={cn(summaryCardHeaderMuted, "flex flex-col gap-4")}>
        <div className="flex min-w-0 items-start gap-3">
          <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-primary/20 transition-transform duration-200 group-hover/card:scale-105">
            <MdBarChart className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <p className={summaryKicker}>Мониторинг Sozley</p>
            <CardTitle className="text-lg font-semibold leading-snug">
              Успеваемость по оценкам
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Распределение оценок за сегодня по данным ИИ
            </CardDescription>
            <div
              className="bg-muted/50 flex h-2 w-full max-w-md overflow-hidden rounded-full ring-1 ring-border/40"
              role="img"
              aria-label="Доля работ по оценкам в выборке"
            >
              {data.map((d) => (
                <div
                  key={d.grade}
                  className={cn(
                    "h-full min-w-px",
                    d.grade === "5" && "bg-primary",
                    d.grade === "4" && "bg-primary/72",
                    d.grade === "3" && "bg-[var(--status-warning)]/75",
                    d.grade === "2" && "bg-destructive/70",
                  )}
                  style={{ flexGrow: Math.max(1, d.count), flexBasis: 0 }}
                  title={`Оценка ${d.grade}: ${d.count} (${formatSharePercent(d.count, totalWorks, 0)})`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {data.map((d) => (
                <span
                  key={d.grade}
                  className="text-muted-foreground rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 text-xs tabular-nums"
                >
                  {d.grade}:{" "}
                  <span className="text-foreground font-medium">
                    {d.count} ({formatSharePercent(d.count, totalWorks, 0)})
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-muted-foreground rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 text-xs">
            Выборка ·{" "}
            <span className="text-primary font-medium">
              {subjectLabel}, {parallelLabel}
            </span>
          </span>
          <span className="text-muted-foreground rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 text-xs">
            Работ в столбцах{" "}
            <span className="text-primary font-medium tabular-nums">
              {totalWorks}
            </span>
          </span>
          <span className="text-muted-foreground rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 text-xs">
            Условный средний балл{" "}
            <span className="text-primary font-medium tabular-nums">
              {avgGrade}
            </span>
          </span>
        </div>
        <div className="bg-muted/30 flex flex-col gap-4 rounded-lg p-4 ring-1 ring-border/40 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-8 sm:gap-y-4">
          <div className="grid w-full min-w-0 gap-2 sm:max-w-xs sm:flex-1">
            <Label htmlFor="summary-subject" className="text-xs font-medium">
              Предмет
            </Label>
            <Select
              value={subject}
              onValueChange={(v) => setSubject(v as SozleySubjectKey)}
            >
              <SelectTrigger
                id="summary-subject"
                className="w-full"
                size="sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOZLEY_SUBJECTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full min-w-0 gap-2 sm:max-w-xs sm:flex-1">
            <Label htmlFor="summary-parallel" className="text-xs font-medium">
              Параллель
            </Label>
            <Select
              value={parallel}
              onValueChange={(v) => setParallel(v as SozleyParallelKey)}
            >
              <SelectTrigger
                id="summary-parallel"
                className="w-full"
                size="sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOZLEY_PARALLELS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-2 min-h-0">
        <div className="flex min-h-[18rem] flex-1 flex-col rounded-xl bg-muted/20 p-3 ring-1 ring-border/50 transition-colors group-hover/card:bg-muted/30">
          <ChartContainer
            config={barConfig}
            className="aspect-auto w-full min-h-[18rem] flex-1"
          >
            <BarChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                className="stroke-border/60"
              />
              <XAxis dataKey="grade" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                width={40}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                domain={[0, barYMax]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
