"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import {
  AnalyticsFiltersProvider,
  useAnalyticsFilters,
} from "@/components/analytics/analytics-filters-provider";
import { AnalyticsKpiHub } from "@/components/analytics/analytics-kpi-hub";
import { AnalyticsSectionNavConnected } from "@/components/analytics/analytics-section-nav";
import { AnalyticsStickyFilters } from "@/components/analytics/analytics-sticky-filters";
import { AnalyticsSmartClassSection } from "@/components/analytics/sections/analytics-smart-class-section";
import { canViewAnalyticsSection } from "@/lib/director/permissions";
import { useDirectorRole } from "@/lib/director/role-context";
import { Skeleton } from "@/components/ui/skeleton";

const AnalyticsLessonSection = dynamic(
  () =>
    import("@/components/analytics/sections/analytics-lesson-section").then(
      (m) => m.AnalyticsLessonSection,
    ),
  { loading: () => <Skeleton className="h-64 rounded-2xl" /> },
);
const AnalyticsPerformanceSection = dynamic(
  () =>
    import("@/components/analytics/sections/analytics-performance-section").then(
      (m) => m.AnalyticsPerformanceSection,
    ),
  { loading: () => <Skeleton className="h-64 rounded-2xl" /> },
);
const AnalyticsSafetySection = dynamic(
  () =>
    import("@/components/analytics/sections/analytics-safety-section").then(
      (m) => m.AnalyticsSafetySection,
    ),
  { loading: () => <Skeleton className="h-64 rounded-2xl" /> },
);
const AnalyticsPlatformSection = dynamic(
  () =>
    import("@/components/analytics/sections/analytics-platform-section").then(
      (m) => m.AnalyticsPlatformSection,
    ),
  { loading: () => <Skeleton className="h-48 rounded-2xl" /> },
);

function AnalyticsSectionScroll() {
  const { section } = useAnalyticsFilters();

  useEffect(() => {
    if (!section) return;
    const timer = window.setTimeout(() => {
      document.getElementById(`analytics-${section}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [section]);

  return null;
}

function AnalyticsSectionsInner() {
  const { role } = useDirectorRole();

  return (
    <div className="flex flex-col gap-6">
      {canViewAnalyticsSection(role, "smart-class") ? <AnalyticsSmartClassSection /> : null}
      {canViewAnalyticsSection(role, "lesson") ? <AnalyticsLessonSection /> : null}
      {canViewAnalyticsSection(role, "performance") ? <AnalyticsPerformanceSection /> : null}
      {canViewAnalyticsSection(role, "safety") ? <AnalyticsSafetySection /> : null}
      {canViewAnalyticsSection(role, "platform") ? <AnalyticsPlatformSection /> : null}
    </div>
  );
}

export function DirectorAnalyticsView() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
      <AnalyticsFiltersProvider>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold tracking-tight">Аналитика школы</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Smart Class, поведение на уроке, успеваемость, безопасность и платформа — единый контекст
            </p>
          </div>
          <AnalyticsKpiHub />
          <AnalyticsStickyFilters />
          <AnalyticsSectionNavConnected />
          <AnalyticsSectionScroll />
          <AnalyticsSectionsInner />
        </div>
      </AnalyticsFiltersProvider>
    </Suspense>
  );
}
