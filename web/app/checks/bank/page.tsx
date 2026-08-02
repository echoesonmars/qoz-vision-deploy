import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { ChecksBankAiVariantCard } from "@/components/checks/checks-bank-ai-variant-card";
import { ChecksBankCurriculumTreeCard } from "@/components/checks/checks-bank-curriculum-tree-card";
import { ChecksBankStemTasksCard } from "@/components/checks/checks-bank-stem-tasks-card";
import { ChecksBankTaskMetricsCard } from "@/components/checks/checks-bank-task-metrics-card";
import { ChecksBankVersionManagementCard } from "@/components/checks/checks-bank-version-management-card";

export default function ChecksBankPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Проверка Sozley", href: "/checks/status" },
          { label: "Банк заданий" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <ChecksBankCurriculumTreeCard />
          <ChecksBankStemTasksCard />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <ChecksBankAiVariantCard />
          <ChecksBankTaskMetricsCard />
        </div>
        <ChecksBankVersionManagementCard />
      </div>
    </>
  );
}
