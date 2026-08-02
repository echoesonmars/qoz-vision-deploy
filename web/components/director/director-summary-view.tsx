"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnalyticsPreviewStrip } from "@/components/analytics/analytics-preview-strip";
import { DirectorAttentionSection } from "@/components/director/attention/director-attention-section";
import { DirectorTodaySection } from "@/components/director/today/director-today-section";
import { DirectorMobileExtras } from "@/components/director/responsive/director-mobile-extras";
import { DirectorQuickActions } from "@/components/director/responsive/director-quick-actions";
import { canViewSection } from "@/lib/director/permissions";
import { useDirectorRole } from "@/lib/director/role-context";
import type { DirectorDashboardData } from "@/lib/director/types";
import { useDirectorPeriod } from "@/lib/director/period-context";
import { Skeleton } from "@/components/ui/skeleton";

const DirectorQualitySection = dynamic(
  () =>
    import("@/components/director/quality/director-quality-section").then(
      (m) => m.DirectorQualitySection,
    ),
  { loading: () => <Skeleton className="h-48 rounded-2xl" /> },
);
const DirectorSozleySection = dynamic(
  () =>
    import("@/components/director/sozley/director-sozley-section").then(
      (m) => m.DirectorSozleySection,
    ),
  { loading: () => <Skeleton className="h-48 rounded-2xl" /> },
);
const DirectorLessonAnalyticsSection = dynamic(
  () =>
    import("@/components/director/lessons/director-lesson-analytics-section").then(
      (m) => m.DirectorLessonAnalyticsSection,
    ),
  { loading: () => <Skeleton className="h-48 rounded-2xl" /> },
);
const DirectorSecuritySection = dynamic(
  () =>
    import("@/components/director/security/director-security-section").then(
      (m) => m.DirectorSecuritySection,
    ),
  { loading: () => <Skeleton className="h-48 rounded-2xl" /> },
);
const DirectorTeacherLoadSection = dynamic(
  () =>
    import("@/components/director/teachers/director-teacher-load-section").then(
      (m) => m.DirectorTeacherLoadSection,
    ),
  { loading: () => <Skeleton className="h-48 rounded-2xl" /> },
);
const DirectorInfrastructureSection = dynamic(
  () =>
    import("@/components/director/infrastructure/director-infrastructure-section").then(
      (m) => m.DirectorInfrastructureSection,
    ),
  { loading: () => <Skeleton className="h-48 rounded-2xl" /> },
);
const DirectorExtrasSection = dynamic(
  () =>
    import("@/components/director/extras/director-extras-section").then(
      (m) => m.DirectorExtrasSection,
    ),
  { loading: () => <Skeleton className="h-32 rounded-2xl" /> },
);

type DirectorSummaryViewProps = {
  data: DirectorDashboardData | undefined;
  loading: boolean;
  isMobile: boolean;
};

export function DirectorSummaryView({ data, loading, isMobile }: DirectorSummaryViewProps) {
  const { period } = useDirectorPeriod();
  const { role } = useDirectorRole();
  const [showAllSections, setShowAllSections] = useState(!isMobile);

  const showBlock = (section: Parameters<typeof canViewSection>[1]) => {
    if (!canViewSection(role, section)) return false;
    if (isMobile && !showAllSections) {
      return section === "today" || section === "attention";
    }
    return true;
  };

  return (
    <>
      {isMobile ? <DirectorQuickActions /> : null}
      {isMobile ? (
        <DirectorMobileExtras
          showAllSections={showAllSections}
          onToggle={() => setShowAllSections((v) => !v)}
        />
      ) : null}

      <AnalyticsPreviewStrip />

      {showBlock("today") ? (
        <DirectorTodaySection
          metrics={data?.todayMetrics}
          loading={loading}
          isMobile={isMobile}
        />
      ) : null}

      {showBlock("attention") ? (
        <DirectorAttentionSection
          alerts={data?.alerts}
          loading={loading}
          isMobile={isMobile}
        />
      ) : null}

      {showBlock("quality") ? (
        <DirectorQualitySection
          data={data?.academicQuality}
          period={period}
          loading={loading}
        />
      ) : null}

      {showBlock("sozley") ? <DirectorSozleySection /> : null}

      {showBlock("lessons") ? (
        <DirectorLessonAnalyticsSection data={data?.lessonAnalytics} loading={loading} />
      ) : null}

      {showBlock("security") ? (
        <DirectorSecuritySection data={data?.security} loading={loading} />
      ) : null}

      {showBlock("teachers") ? (
        <DirectorTeacherLoadSection data={data?.teacherLoad} loading={loading} />
      ) : null}

      {showBlock("infrastructure") ? (
        <DirectorInfrastructureSection data={data?.infrastructure} loading={loading} />
      ) : null}

      {showBlock("extras") ? (
        <DirectorExtrasSection data={data?.benchmarks} loading={loading} />
      ) : null}
    </>
  );
}
