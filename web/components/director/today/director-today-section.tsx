"use client";

import { DirectorMetricCard } from "@/components/director/shared/director-metric-card";
import { DirectorSection } from "@/components/director/shared/director-section";
import { MOBILE_TODAY_METRIC_KEYS } from "@/lib/director/config/mobile-today-metrics";
import { DIRECTOR_SECTION_ANCHORS } from "@/lib/director/anchors";
import type { TodayMetric } from "@/lib/director/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type DirectorTodaySectionProps = {
  metrics: TodayMetric[] | undefined;
  loading: boolean;
  isMobile: boolean;
  title?: string;
  description?: string;
};

export function DirectorTodaySection({
  metrics,
  loading,
  isMobile,
  title = "Сегодня в школе",
  description,
}: DirectorTodaySectionProps) {
  const visible = metrics?.filter((m) =>
    isMobile ? MOBILE_TODAY_METRIC_KEYS.includes(m.key) : true,
  );

  return (
    <DirectorSection
      id={DIRECTOR_SECTION_ANCHORS.today}
      kicker="Главный экран"
      title={title}
      description={
        description ??
        (isMobile
          ? "4 ключевых счётчика (2×2) — состав согласуется на этапе дизайна"
          : "30-секундный обзор состояния школы")
      }
    >
      <div
        className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {loading
          ? Array.from({ length: isMobile ? 4 : 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))
          : visible?.map((metric) => <DirectorMetricCard key={metric.key} metric={metric} />)}
      </div>
    </DirectorSection>
  );
}
