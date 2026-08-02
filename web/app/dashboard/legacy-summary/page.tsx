import Link from "next/link";
import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { Button } from "@/components/ui/button";
import { SummaryActivityFeed } from "@/components/dashboard/summary-activity-feed";
import { SummaryAiAlerts } from "@/components/dashboard/summary-ai-alerts";
import { SummaryEngagementChart } from "@/components/dashboard/summary-engagement-chart";
import { SummaryMetricCards } from "@/components/dashboard/summary-metric-cards";
import { SummarySozleyGradesChart } from "@/components/dashboard/summary-sozley-grades-chart";

export default function LegacySummaryPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Сводка Qoz (legacy)" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex justify-end">
          <Button asChild size="sm">
            <Link href="/dashboard?tab=analytics">Перейти в Аналитику</Link>
          </Button>
        </div>
        <SummaryMetricCards />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <SummaryEngagementChart />
          <SummarySozleyGradesChart />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <SummaryAiAlerts />
          <SummaryActivityFeed />
        </div>
      </div>
    </>
  );
}
