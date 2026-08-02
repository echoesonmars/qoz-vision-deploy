"use client";

import { ADM_COPY } from "@/lib/brand/copy";
import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { checksCardHeader, checksCardInteractive, summaryKicker } from "@/components/dashboard/summary-card-shell";
import { AllCamerasPageClient } from "@/components/cameras/all-cameras-page-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdVideocam } from "react-icons/md";

export default function AllCamerasPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: ADM_COPY.videoAnalyticsNav, href: "/dashboard/cameras/all" },
          { label: "Все камеры" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <Card className={checksCardInteractive}>
          <CardHeader className={checksCardHeader}>
            <p className={summaryKicker}>
              <MdVideocam className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
              Реестр
            </p>
            <CardTitle className="text-lg font-semibold">Все камеры</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <AllCamerasPageClient />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
