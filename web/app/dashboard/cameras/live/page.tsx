"use client";

import { Suspense } from "react";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { checksCardHeader, checksCardInteractive, summaryKicker } from "@/components/dashboard/summary-card-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveStreamPageClient } from "@/components/cameras/live-stream-page-client";
import { ADM_COPY } from "@/lib/brand/copy";
import { MdLiveTv } from "react-icons/md";

export default function CamerasLivePage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: ADM_COPY.videoAnalyticsNav, href: "/dashboard/cameras/all" },
          { label: "Прямой эфир" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <Card className={checksCardInteractive}>
          <CardHeader className={checksCardHeader}>
            <p className={summaryKicker}>
              <MdLiveTv className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
              Live
            </p>
            <CardTitle className="text-lg font-semibold">Прямой эфир</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Suspense fallback={<AdmLoadingScreen variant="inline" />}>
              <LiveStreamPageClient />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
