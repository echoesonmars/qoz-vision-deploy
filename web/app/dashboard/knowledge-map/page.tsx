import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { KnowledgeMapWorkbench } from "@/components/dashboard/knowledge-map/knowledge-map-workbench";

export default function KnowledgeMapPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Карта знаний" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 lg:gap-6">
        <KnowledgeMapWorkbench />
      </div>
    </>
  );
}
