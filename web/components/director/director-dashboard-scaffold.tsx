"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DirectorHeader } from "@/components/director/header/director-header";
import { DirectorSummaryView } from "@/components/director/director-summary-view";
import { DirectorSchoolBreadcrumbs, DirectorBackToSchoolsLink } from "@/components/director/shared/director-school-breadcrumbs";
import { useDirectorDashboard } from "@/hooks/use-director-dashboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSchoolContext } from "@/lib/hierarchy/school-context";
import { useDirectorPeriod } from "@/lib/director/period-context";
import { parseDashboardNavigation } from "@/lib/navigation/app-navigation";
import type { DashboardTab } from "@/lib/analytics/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { admTabActiveClass } from "@/lib/brand/ui-classes";
import { Skeleton } from "@/components/ui/skeleton";

const DirectorAnalyticsView = dynamic(
  () =>
    import("@/components/analytics/director-analytics-view").then(
      (m) => m.DirectorAnalyticsView,
    ),
  { loading: () => <Skeleton className="h-96 rounded-2xl" /> },
);

function DashboardTabsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { period } = useDirectorPeriod();
  const { schoolId } = useSchoolContext();
  const { data, loading, error, lastUpdatedAt, refresh } = useDirectorDashboard(
    period,
    schoolId,
  );
  const isMobile = useIsMobile();
  const { tab } = parseDashboardNavigation(searchParams);

  const alertCount =
    data?.alerts.filter((a) => a.priority === "critical" || a.priority === "attention").length ??
    0;

  const setTab = useCallback(
    (next: DashboardTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "summary") {
        params.delete("tab");
        params.delete("section");
      } else {
        params.set("tab", next);
      }
      const qs = params.toString();
      router.replace(qs ? `/dashboard?${qs}` : "/dashboard");
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorSchoolBreadcrumbs />
      <DirectorBackToSchoolsLink />
      <DirectorHeader
        school={data?.school}
        lastUpdatedAt={lastUpdatedAt}
        onRefresh={() => void refresh()}
        compact={isMobile}
        notificationCount={alertCount}
      />

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      <Tabs value={tab} onValueChange={(v) => setTab(v as DashboardTab)}>
        <TabsList className="w-full justify-start sm:w-auto">
          <TabsTrigger value="summary">Сводка</TabsTrigger>
          <TabsTrigger value="analytics" className={admTabActiveClass}>
            Аналитика
          </TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-6 flex flex-col gap-6">
          {tab === "summary" ? (
            <DirectorSummaryView data={data ?? undefined} loading={loading} isMobile={isMobile} />
          ) : null}
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          {tab === "analytics" ? <DirectorAnalyticsView /> : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function DirectorDashboardScaffold() {
  return (
    <Suspense fallback={<Skeleton className="m-6 h-96 rounded-2xl" />}>
      <DashboardTabsInner />
    </Suspense>
  );
}
