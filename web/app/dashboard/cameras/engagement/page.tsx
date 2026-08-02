"use client";

import { Suspense } from "react";
import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { EngagementPageClient } from "@/components/cameras/engagement-page-client";
import { ADM_COPY } from "@/lib/brand/copy";

export default function CamerasEngagementPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: ADM_COPY.videoAnalyticsNav, href: "/dashboard/cameras/all" },
          { label: "Вовлеченность классов" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0 pb-4">
        <Suspense fallback={<AdmLoadingScreen variant="inline" />}>
          <EngagementPageClient />
        </Suspense>
      </div>
    </>
  );
}
