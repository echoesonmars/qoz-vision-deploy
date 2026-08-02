"use client";

import { MetricAttendanceCard } from "@/components/dashboard/metrics/metric-attendance-card";
import { MetricEngagementCard } from "@/components/dashboard/metrics/metric-engagement-card";
import { MetricInfrastructureCard } from "@/components/dashboard/metrics/metric-infrastructure-card";
import { MetricSozleyCard } from "@/components/dashboard/metrics/metric-sozley-card";

export function SummaryMetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6 [&>*]:h-full">
      <MetricAttendanceCard />
      <MetricEngagementCard />
      <MetricSozleyCard />
      <MetricInfrastructureCard />
    </div>
  );
}
