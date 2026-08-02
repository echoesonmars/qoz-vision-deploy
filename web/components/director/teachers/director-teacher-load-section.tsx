"use client";

import Link from "next/link";
import { useState } from "react";
import { DirectorRatioPercentValue } from "@/components/director/shared/director-count-percent-value";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { DirectorSection } from "@/components/director/shared/director-section";
import { TeacherRecommendationCard } from "@/components/director/shared/teacher-recommendation-card";
import { Button } from "@/components/ui/button";
import { DirectorMockFeedback } from "@/components/director/shared/director-mock-feedback";
import { DIRECTOR_SECTION_ANCHORS } from "@/lib/director/anchors";
import { directorDetailRepo } from "@/lib/data";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import type { TeacherLoadBlock } from "@/lib/director/types";
import { Skeleton } from "@/components/ui/skeleton";

type DirectorTeacherLoadSectionProps = {
  data: TeacherLoadBlock | undefined;
  loading: boolean;
};

export function DirectorTeacherLoadSection({
  data,
  loading,
}: DirectorTeacherLoadSectionProps) {
  const [scheduled, setScheduled] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSchedule(id: string, name: string) {
    setScheduled((prev) => ({ ...prev, [id]: true }));
    setFeedback(`Встреча с ${name} добавлена в календарь`);
  }

  return (
    <DirectorSection
      id={DIRECTOR_SECTION_ANCHORS.teachers}
      kicker="Блок 4"
      title="Нагрузка педагогов"
      description="Снижение рутинной нагрузки и поддержка педагогов"
      action={
        <Button asChild variant="outline" size="sm">
          <Link href="/people/teachers">Все педагоги</Link>
        </Button>
      }
    >
      {loading || !data ? (
        <Skeleton className="h-56 rounded-2xl" />
      ) : (
        <div className="flex flex-col gap-6">
          <DirectorMockFeedback message={feedback} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <DirectorKpiTile
              label="С ИИ-помощником"
              value={`${data.aiAssistantPercent}%`}
              context="Цель ≥80%"
              status={data.aiAssistantPercent >= 80 ? "ok" : "warning"}
            />
            <DirectorKpiTile
              label="Подготовка урока"
              value={`${data.avgLessonPrepMinutes} мин`}
              context="Тренд ↓2.5×"
            />
            <DirectorKpiTile
              label="Проверка работ"
              value={`${data.avgGradingMinutes} мин`}
            />
            <DirectorKpiTile
              label="Автоматизировано"
              value={
                <DirectorRatioPercentValue
                  numerator={data.automatedProcesses}
                  denominator={directorDetailRepo.getRoutineOperationsTotal()}
                />
              }
              context={`Цель ${data.automatedProcessesTarget}`}
            />
            <DirectorKpiTile
              label="Высвобождено"
              value={`${data.hoursSavedPerWeek} ч/нед`}
              context="На педагога"
              status={data.hoursSavedPerWeek >= 5 ? "ok" : "warning"}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.recommendations.map((item) => (
              <TeacherRecommendationCard
                key={item.id}
                item={item}
                onScheduleMeeting={() => {
                  if (!scheduled[item.id]) handleSchedule(item.id, item.teacherName);
                }}
              />
            ))}
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit">
            <Link href={DIRECTOR_PATHS.sozleyStatus}>Статус проверок Sozley</Link>
          </Button>
        </div>
      )}
    </DirectorSection>
  );
}
