"use client";

import Link from "next/link";
import { MetricSozleyCard } from "@/components/dashboard/metrics/metric-sozley-card";
import { SummarySozleyGradesChart } from "@/components/dashboard/summary-sozley-grades-chart";
import { ChecksStatusActiveExamsCard } from "@/components/checks/checks-status-active-exams-card";
import { ChecksStatusAnomaliesCard } from "@/components/checks/checks-status-anomalies-card";
import { ChecksStatusBottlenecksCard } from "@/components/checks/checks-status-bottlenecks-card";
import { ChecksStatusPipelineCard } from "@/components/checks/checks-status-pipeline-card";
import { ChecksStatusQuickActionsCard } from "@/components/checks/checks-status-quick-actions-card";
import { DirectorCountPercentValue } from "@/components/director/shared/director-count-percent-value";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { DirectorSection } from "@/components/director/shared/director-section";
import { Button } from "@/components/ui/button";
import { DIRECTOR_SECTION_ANCHORS } from "@/lib/director/anchors";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import {
  sozleyPendingVerification,
  sozleyProcessedToday,
  sozleyStatusSlices,
} from "@/lib/data/stubs/dashboard/summary-mock";

export function DirectorSozleySection() {
  const verified = sozleyStatusSlices.find((s) => s.key === "verified")?.value ?? 0;
  const pending = sozleyStatusSlices.find((s) => s.key === "pending")?.value ?? 0;

  return (
    <DirectorSection
      id={DIRECTOR_SECTION_ANCHORS.sozley}
      kicker="Проверка работ"
      title="Sozley"
      description="ИИ-проверка письменных работ, очередь верификации учителем и срезы успеваемости по школе"
      action={
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={DIRECTOR_PATHS.sozleyStatus}>Статус проверок</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/checks/bank">Банк заданий</Link>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DirectorKpiTile
            label="Обработано сегодня"
            value={sozleyProcessedToday}
            context="Работ прошли ИИ-проверку"
          />
          <DirectorKpiTile
            label="Ожидают верификации"
            value={
              <DirectorCountPercentValue
                count={sozleyPendingVerification}
                total={sozleyProcessedToday}
                fractionDigits={0}
              />
            }
            context="Требуют решения учителя"
            status={sozleyPendingVerification > 10 ? "warning" : "ok"}
          />
          <DirectorKpiTile
            label="Утверждено учителем"
            value={
              <DirectorCountPercentValue
                count={verified}
                total={sozleyProcessedToday}
                fractionDigits={0}
              />
            }
            context="За текущий учебный день"
            status="ok"
          />
          <DirectorKpiTile
            label="В очереди ИИ"
            value={
              <DirectorCountPercentValue
                count={pending}
                total={sozleyProcessedToday}
                fractionDigits={0}
              />
            }
            context="На этапе автоматической проверки"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <MetricSozleyCard />
          <SummarySozleyGradesChart />
        </div>

        <ChecksStatusPipelineCard />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <ChecksStatusActiveExamsCard />
          <ChecksStatusAnomaliesCard />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <ChecksStatusBottlenecksCard />
          <ChecksStatusQuickActionsCard />
        </div>
      </div>
    </DirectorSection>
  );
}
