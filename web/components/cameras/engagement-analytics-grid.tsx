"use client";

import { HistoricalChartCard } from "@/components/cameras/historical-chart-card";
import { LiveDemoWidget } from "@/components/cameras/live-demo-widget";
import { MetricsConsole } from "@/components/cameras/metrics-console";

export function EngagementAnalyticsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start lg:gap-6">
      <HistoricalChartCard />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="min-w-0 flex-1">
          <LiveDemoWidget />
        </div>
        <div className="w-full shrink-0 lg:w-52">
          <MetricsConsole />
        </div>
      </div>
    </div>
  );
}
