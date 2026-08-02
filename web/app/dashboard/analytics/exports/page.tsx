import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { ExportsHub } from "@/components/dashboard/exports/exports-hub";

export default function AnalyticsExportsPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Управление" },
          { label: "Выгрузка документов" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <ExportsHub />
      </div>
    </>
  );
}
