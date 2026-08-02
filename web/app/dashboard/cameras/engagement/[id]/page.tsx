import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { EngagementDetailClient } from "@/components/cameras/engagement-detail-client";
import { ADM_COPY } from "@/lib/brand/copy";
import { findCameraByDeviceIdAsync } from "@/lib/cameras/resolve-engagement-id.server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EngagementDetailPage({ params }: PageProps) {
  const { id } = await params;
  const liveCamera = await findCameraByDeviceIdAsync(id);
  const detailLabel = liveCamera ? "Live-камера" : "Анализ урока";

  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: ADM_COPY.videoAnalyticsNav, href: "/dashboard/cameras/all" },
          { label: "Вовлеченность", href: "/dashboard/cameras/engagement" },
          { label: detailLabel },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0 pb-8">
        <EngagementDetailClient id={id} />
      </div>
    </>
  );
}
