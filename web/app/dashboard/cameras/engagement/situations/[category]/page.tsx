import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { SituationCategoryPageClient } from "@/components/cameras/situation-category-page-client";
import { incidentCategoryLabel } from "@/lib/incident-categories";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import { ADM_COPY } from "@/lib/brand/copy";
import { isKnownIncidentCategory } from "@/lib/incidents-types";

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function SituationCategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!isKnownIncidentCategory(category)) {
    notFound();
  }

  const label = incidentCategoryLabel(category);

  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: ADM_COPY.videoAnalyticsNav, href: "/dashboard/cameras/all" },
          { label: "Вовлеченность", href: DIRECTOR_PATHS.camerasEngagement },
          { label: label },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0 pb-4">
        <Suspense fallback={<AdmLoadingScreen variant="inline" />}>
          <SituationCategoryPageClient category={category} />
        </Suspense>
      </div>
    </>
  );
}
