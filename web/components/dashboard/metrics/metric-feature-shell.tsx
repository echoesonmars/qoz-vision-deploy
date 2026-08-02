"use client";

import type { ReactNode } from "react";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  admMetricChartPanelClass,
  admCardHeaderMutedClass,
  admCardInteractiveClass,
  admKickerClass,
} from "@/lib/brand/ui-classes";
import { cn } from "@/lib/utils";

export const metricFeatureCardClass = cn(
  admCardInteractiveClass,
  "flex h-full min-h-0 flex-col",
);

export const metricFeatureContentClass = "flex flex-1 flex-col gap-2 p-4 pt-1 min-h-0";

export const metricFeatureChartPanelClass = admMetricChartPanelClass;

type MetricFeatureHeaderProps = {
  icon: ReactNode;
  kicker: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
};

export function MetricFeatureHeader({
  icon,
  kicker,
  title,
  description,
  trailing,
}: MetricFeatureHeaderProps) {
  return (
    <CardHeader className={cn(admCardHeaderMutedClass, "gap-2 py-3 pb-3")}>
      <div className="flex items-start gap-3">
        <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-primary/20 transition-transform duration-200 group-hover/card:scale-105">
          {icon}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 space-y-0.5">
              {typeof kicker === "string" ? (
                <p className={admKickerClass}>{kicker}</p>
              ) : (
                kicker
              )}
              <CardTitle className="text-base font-semibold leading-snug text-heading">
                {title}
              </CardTitle>
            </div>
            {trailing}
          </div>
          {description ? (
            <CardDescription className="text-xs leading-snug">{description}</CardDescription>
          ) : null}
        </div>
      </div>
    </CardHeader>
  );
}
