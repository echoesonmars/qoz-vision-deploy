import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { CamerasManageClient } from "@/components/cameras/cameras-manage-client";
import { ADM_COPY } from "@/lib/brand/copy";

export default function CamerasManagePage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: ADM_COPY.videoAnalyticsNav, href: "/dashboard/cameras/all" },
          { label: "Управление камерами" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0 pb-8">
        <CamerasManageClient />
      </div>
    </>
  );
}
