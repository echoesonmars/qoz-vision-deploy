import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { ManagementMapClient } from "@/components/dashboard/management/management-map-client";

export default function ManagementMapPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Кабинеты и карта" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <ManagementMapClient />
      </div>
    </>
  );
}
