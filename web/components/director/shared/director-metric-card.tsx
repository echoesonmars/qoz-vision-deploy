"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  directorKicker,
  directorMetricContext,
  directorMetricValue,
  directorSectionCard,
  directorStatusClass,
} from "@/components/director/shared/director-styles";
import { formatSourceBadge } from "@/lib/director/integrations/facade";
import type { TodayMetric } from "@/lib/director/types";
import { cn } from "@/lib/utils";

type DirectorMetricCardProps = {
  metric: TodayMetric;
  className?: string;
};

function MetricCardContent({ metric }: { metric: TodayMetric }) {
  return (
    <CardContent className="flex h-full flex-col gap-2 p-6">
      <p className={directorKicker}>{metric.label}</p>
      <p className={directorMetricValue}>{metric.value}</p>
      <p className={cn(directorMetricContext, directorStatusClass(metric.status))}>
        {metric.context}
      </p>
      <p className="text-muted-foreground mt-auto text-xs">
        {formatSourceBadge(metric.source)}
      </p>
    </CardContent>
  );
}

export function DirectorMetricCard({ metric, className }: DirectorMetricCardProps) {
  const cardClassName = cn(
    directorSectionCard,
    "h-full transition-all duration-200",
    metric.href ? "hover:ring-primary/30" : "",
  );

  if (!metric.href) {
    return (
      <div className={cn("block h-full", className)}>
        <Card className={cardClassName}>
          <MetricCardContent metric={metric} />
        </Card>
      </div>
    );
  }

  return (
    <Link href={metric.href} className={cn("block h-full", className)}>
      <Card className={cardClassName}>
        <MetricCardContent metric={metric} />
      </Card>
    </Link>
  );
}
