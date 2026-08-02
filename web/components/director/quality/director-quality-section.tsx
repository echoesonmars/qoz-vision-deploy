"use client";

import Link from "next/link";
import { DirectorCountPercentValue } from "@/components/director/shared/director-count-percent-value";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { DirectorSection } from "@/components/director/shared/director-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { admStatusSuccessTextClass, admStatusWarningTextClass } from "@/lib/brand/ui-classes";
import { DIRECTOR_SECTION_ANCHORS } from "@/lib/director/anchors";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import type { AcademicQualityBlock, DirectorPeriod } from "@/lib/director/types";
import { MdTrendingDown, MdTrendingUp } from "react-icons/md";
import { DirectorSourceBadge } from "@/components/director/shared/director-source-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DIRECTOR_SCHOOL_STUDENT_COUNT } from "@/lib/director/school-scale";
import { cn } from "@/lib/utils";

type DirectorQualitySectionProps = {
  data: AcademicQualityBlock | undefined;
  period: DirectorPeriod;
  loading: boolean;
};

export function DirectorQualitySection({ data, period, loading }: DirectorQualitySectionProps) {
  const showModo = period === "today" || period === "week";
  const forecastLabel = showModo ? "Прогноз МОДО" : "Прогноз ЕНТ";
  const forecastValue = showModo
    ? `${data?.modoForecastPercent ?? 0}%`
    : `${data?.entForecastPercent ?? 0}%`;
  const trendUp = (data?.dynamicsDelta ?? 0) >= 0;

  return (
    <DirectorSection
      id={DIRECTOR_SECTION_ANCHORS.quality}
      kicker="Блок 1"
      title="Качество обучения"
      description="Где именно есть учебный дефицит и что школа делает для его устранения?"
      action={
        <Button asChild variant="outline" size="sm">
          <Link href={DIRECTOR_PATHS.knowledgeMap}>Подробнее</Link>
        </Button>
      }
    >
      {loading || !data ? (
        <Skeleton className="h-48 rounded-2xl" />
      ) : (
        <div className="flex flex-col gap-6">
          <DirectorSourceBadge source="journal" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DirectorKpiTile label="Средний балл СОР/СОЧ" value={data.avgSorSoch.toFixed(2)} />
            <DirectorKpiTile
              label="Динамика балла"
              value={
                <span className="inline-flex items-center gap-1">
                  {trendUp ? (
                    <MdTrendingUp className={cn("size-5", admStatusSuccessTextClass)} />
                  ) : (
                    <MdTrendingDown className={cn("size-5", admStatusWarningTextClass)} />
                  )}
                  {data.dynamicsDelta > 0 ? "+" : ""}
                  {data.dynamicsDelta.toFixed(1)}
                </span>
              }
              status={trendUp ? "ok" : "warning"}
            />
            <DirectorKpiTile
              label="Учеников с пробелами"
              value={
                <DirectorCountPercentValue
                  count={data.studentsWithGaps}
                  total={DIRECTOR_SCHOOL_STUDENT_COUNT}
                />
              }
              context="≥2 темы, ≥2 цикла"
            />
            <DirectorKpiTile
              label={forecastLabel}
              value={forecastValue}
              context={
                showModo ? (
                  <Link href="/dashboard/director/modo-forecast" className="text-primary hover:underline">
                    4 и 9 классы →
                  </Link>
                ) : (
                  <Link href="/dashboard/director/ent-forecast" className="text-primary hover:underline">
                    11 класс →
                  </Link>
                )
              }
            />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
              <p className="mb-3 text-sm font-semibold">Темы с наибольшими ошибками</p>
              <div className="flex flex-col gap-3">
                {data.topErrorTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/dashboard/director/topics/${topic.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium">{topic.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {topic.subject} · {topic.classLabel}
                      </p>
                    </div>
                    <Badge variant="outline">{topic.errorPercent}% ошибок</Badge>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
              <p className="mb-3 text-sm font-semibold">Классы с устойчивым снижением</p>
              <div className="flex flex-col gap-3">
                {data.decliningClasses.map((row) => (
                  <Link
                    key={row.classId}
                    href={`/dashboard/director/classes/${row.classId}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium">{row.classLabel}</p>
                      <p className="text-muted-foreground text-xs">{row.subject}</p>
                    </div>
                    <Badge variant="destructive">{row.deltaPercent}%</Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </DirectorSection>
  );
}
