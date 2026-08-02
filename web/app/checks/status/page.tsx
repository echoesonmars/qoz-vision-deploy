import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { ChecksStatusActiveExamsCard } from "@/components/checks/checks-status-active-exams-card";
import { ChecksStatusAnomaliesCard } from "@/components/checks/checks-status-anomalies-card";
import { ChecksStatusBottlenecksCard } from "@/components/checks/checks-status-bottlenecks-card";
import { ChecksStatusPipelineCard } from "@/components/checks/checks-status-pipeline-card";
import { ChecksStatusQuickActionsCard } from "@/components/checks/checks-status-quick-actions-card";

export default function ChecksStatusPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Проверка Sozley", href: "/checks/status" },
          { label: "Статус проверок" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <ChecksStatusPipelineCard />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <ChecksStatusActiveExamsCard />
          <ChecksStatusAnomaliesCard />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <ChecksStatusBottlenecksCard />
          <ChecksStatusQuickActionsCard />
        </div>
      </div>
    </>
  );
}
