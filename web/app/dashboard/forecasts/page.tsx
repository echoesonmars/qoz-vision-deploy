import Link from "next/link";
import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { Button } from "@/components/ui/button";
import { ForecastEarlyWarning } from "@/components/dashboard/forecasts/forecast-early-warning";
import { ForecastReadinessMatrix } from "@/components/dashboard/forecasts/forecast-readiness-matrix";
import { ForecastRecommendedActions } from "@/components/dashboard/forecasts/forecast-recommended-actions";
import { ForecastScenarioSimulator } from "@/components/dashboard/forecasts/forecast-scenario-simulator";
import { ForecastStrategicCards } from "@/components/dashboard/forecasts/forecast-strategic-cards";

export default function ForecastsPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Прогнозы успеваемости" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 lg:gap-6">
        <div className="flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard?tab=analytics&section=performance">Числовые оценки</Link>
          </Button>
        </div>
        <ForecastStrategicCards />
        <ForecastReadinessMatrix />
        <ForecastEarlyWarning />
        <ForecastScenarioSimulator />
        <ForecastRecommendedActions />
      </div>
    </>
  );
}
