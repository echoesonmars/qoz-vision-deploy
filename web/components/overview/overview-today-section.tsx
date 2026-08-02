"use client";

import { DirectorTodaySection } from "@/components/director/today/director-today-section";
import { useIsMobile } from "@/hooks/use-mobile";
import type { TodayMetric } from "@/lib/director/types";
import type { OverviewLevel } from "@/lib/hierarchy/types";

type OverviewTodaySectionProps = {
  level: OverviewLevel;
  entityName: string;
  metrics: TodayMetric[];
};

function buildTitle(level: OverviewLevel, entityName: string): string {
  if (level === "country") return "Сегодня в Казахстане";
  return `Сегодня в ${entityName}`;
}

function buildDescription(level: OverviewLevel): string {
  if (level === "country") return "30-секундный обзор состояния республики";
  if (level === "region") return "30-секундный обзор состояния области";
  if (level === "city") return "30-секундный обзор состояния города";
  return "30-секундный обзор состояния района";
}

export function OverviewTodaySection({ level, entityName, metrics }: OverviewTodaySectionProps) {
  const isMobile = useIsMobile();

  return (
    <DirectorTodaySection
      metrics={metrics}
      loading={false}
      isMobile={isMobile}
      title={buildTitle(level, entityName)}
      description={buildDescription(level)}
    />
  );
}
