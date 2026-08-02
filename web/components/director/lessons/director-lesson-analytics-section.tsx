"use client";

import Link from "next/link";
import { DirectorDisclaimer } from "@/components/director/shared/director-disclaimer";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { DirectorSection } from "@/components/director/shared/director-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DIRECTOR_SECTION_ANCHORS } from "@/lib/director/anchors";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import type { LessonAnalyticsBlock } from "@/lib/director/types";
import { ADM_COPY } from "@/lib/brand/copy";
import { admActiveBadgeClass } from "@/lib/brand/ui-classes";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const FORMAT_COLORS = [
  "bg-[var(--chart-2)]",
  "bg-[var(--chart-4)]",
  "bg-[var(--chart-3)]",
  "bg-primary",
] as const;

const FORMAT_LABELS = [
  { key: "frontal" as const, label: "Фронтальная" },
  { key: "pair" as const, label: "Парная" },
  { key: "group" as const, label: "Групповая" },
  { key: "individual" as const, label: "Индивидуальная" },
];

type DirectorLessonAnalyticsSectionProps = {
  data: LessonAnalyticsBlock | undefined;
  loading: boolean;
};

export function DirectorLessonAnalyticsSection({
  data,
  loading,
}: DirectorLessonAnalyticsSectionProps) {
  return (
    <DirectorSection
      id={DIRECTOR_SECTION_ANCHORS.lessons}
      kicker="Блок 2"
      title="Видео- и аудиоаналитика уроков"
      description="Улучшение качества преподавания через анализ структуры урока"
      action={
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/dashboard?tab=analytics&section=lesson">Аналитика урока</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={DIRECTOR_PATHS.camerasEngagement}>{ADM_COPY.moduleTitle}</Link>
          </Button>
        </div>
      }
    >
      {loading || !data ? (
        <Skeleton className="h-56 rounded-2xl" />
      ) : (
        <div className="flex flex-col gap-6">
          {data.pilotEnabled ? (
            <Badge className={cn("w-fit", admActiveBadgeClass)}>
              Пилотная школа
            </Badge>
          ) : null}
          <DirectorDisclaimer>
            Не для оценки и рейтингования учителей. Видео хранится не дольше 30 дней (policy).{" "}
            <Link href="/dashboard/director/teacher-rights" className="text-primary hover:underline">
              Права педагогов
            </Link>
          </DirectorDisclaimer>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DirectorKpiTile
              label="Вовлечённость"
              value={`${data.engagementPercent}%`}
              status="ok"
            />
            <DirectorKpiTile
              label="Активность учеников"
              value={`${data.studentActivityPercent}%`}
            />
            <DirectorKpiTile
              label="Проанализировано уроков"
              value={`${Math.round(data.analyzedLessonsRatio * 100)}%`}
            />
            <DirectorKpiTile
              label="Интерактивные форматы"
              value={`${Math.round(data.interactiveFormatsRatio * 100)}%`}
            />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">Распределение форматов</p>
            <div className="flex h-4 overflow-hidden rounded-full">
              {FORMAT_LABELS.map((f, i) => (
                <div
                  key={f.key}
                  className={FORMAT_COLORS[i]}
                  style={{ width: `${data.formatShares[f.key]}%` }}
                  title={`${f.label}: ${data.formatShares[f.key]}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              {FORMAT_LABELS.map((f, i) => (
                <span key={f.key} className="inline-flex items-center gap-2">
                  <span className={`size-3 rounded-full ${FORMAT_COLORS[i]}`} />
                  {f.label} {data.formatShares[f.key]}%
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">Вовлечённость по параллелям (5–11)</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {data.engagementByParallel.map((row) => (
                <div key={row.parallel} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{row.parallel} кл.</span>
                    <span className="tabular-nums">{row.percent}%</span>
                  </div>
                  <Progress value={row.percent} className="h-2" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50"
              >
                <p className="text-sm font-semibold">
                  {rec.classLabel}, {rec.subject}, урок {rec.lessonDate}
                </p>
                <p className="text-muted-foreground mt-2 text-xs">Сигнал: {rec.signal}</p>
                <p className="mt-2 text-sm">{rec.recommendation}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Ответственный: {rec.responsible}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DirectorSection>
  );
}
