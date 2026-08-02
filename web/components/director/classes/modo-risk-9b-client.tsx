"use client";

import Link from "next/link";
import { useState } from "react";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { DirectorCountPercentValue } from "@/components/director/shared/director-count-percent-value";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { directorDetailRepo } from "@/lib/data";
import { DirectorConfirmAction } from "@/components/director/shared/director-confirm-action";
import { DirectorMockFeedback } from "@/components/director/shared/director-mock-feedback";

const RISK_LABELS = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
} as const;

export function ModoRisk9bClient() {
  const [launched, setLaunched] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const data = directorDetailRepo.getModoRisk9b();

  function handleLaunch(stepId: string) {
    setLaunched((prev) => ({ ...prev, [stepId]: true }));
    setFeedback("Шаг плана запущен");
  }

  function handleApprove() {
    setFeedback("План поддержки утверждён");
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Требует внимания", href: "/dashboard#attention" },
          { label: "9 «Б» · Группа риска МОДО" },
        ]}
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{data.classLabel}</h1>
          <p className="text-muted-foreground text-sm">
            КР: {data.homeroomTeacher} · {data.studentCount} учеников
          </p>
          <Badge variant="destructive" className="mt-2">
            {data.riskBadge}
          </Badge>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <DirectorMockFeedback message={feedback} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DirectorKpiTile label="Прогноз класса" value={data.kpis.classForecast} status="warning" />
        <DirectorKpiTile
          label="В группе риска"
          value={
            <DirectorCountPercentValue
              count={data.kpis.inRiskGroup}
              total={data.studentCount}
              fractionDigits={0}
            />
          }
          status="critical"
        />
        <DirectorKpiTile label="Средний балл" value={data.kpis.avgScore} />
        <DirectorKpiTile label="Общие пробелы" value={data.kpis.sharedGaps} />
      </div>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ученик</TableHead>
              <TableHead>Прогноз МОДО</TableHead>
              <TableHead>Δ за месяц</TableHead>
              <TableHead>Пробелы</TableHead>
              <TableHead>Риск</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.students.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.fullName}</TableCell>
                <TableCell>{s.modoForecast}</TableCell>
                <TableCell>{s.deltaMonth}</TableCell>
                <TableCell>{s.gaps}</TableCell>
                <TableCell>
                  <Badge variant={s.riskLevel === "high" ? "destructive" : "outline"}>
                    {RISK_LABELS[s.riskLevel]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
        <p className="mb-4 text-sm font-semibold">Общие пробелы класса</p>
        <div className="space-y-4">
          {data.classGaps.map((gap) => (
            <div key={gap.topic} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{gap.topic}</span>
                <span className="tabular-nums">{gap.mastery}%</span>
              </div>
              <Progress value={gap.mastery} className="h-2" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
        <p className="mb-4 text-sm font-semibold">ИИ-план поддержки</p>
        <div className="flex flex-col gap-4">
          {data.supportPlan.map((step) => (
            <div
              key={step.id}
              className="flex flex-col gap-2 rounded-lg bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-muted-foreground text-xs">
                  {step.responsible} · до {step.deadline}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant={launched[step.id] ? "outline" : "default"}
                disabled={launched[step.id]}
                onClick={() => handleLaunch(step.id)}
              >
                {launched[step.id] ? "Запущено" : "Запустить"}
              </Button>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-4 text-sm">{data.effectForecast}</p>
        <DirectorConfirmAction
          description="План поддержки 9 «Б» будет утверждён (без автоматических санкций)."
          onConfirm={handleApprove}
        >
          {(openConfirm) => (
            <Button type="button" className="mt-4" onClick={openConfirm}>
              Утвердить план
            </Button>
          )}
        </DirectorConfirmAction>
      </div>
    </div>
  );
}
