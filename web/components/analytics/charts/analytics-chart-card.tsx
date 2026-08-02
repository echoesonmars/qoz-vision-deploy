"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { directorKicker } from "@/components/director/shared/director-styles";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AnalyticsChartCardProps = {
  kicker?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function AnalyticsChartCard({
  kicker,
  title,
  description,
  children,
  className,
}: AnalyticsChartCardProps) {
  return (
    <Card className={cn("rounded-2xl border-0 shadow-sm ring-1 ring-border/60", className)}>
      <CardHeader className="border-b border-border/60 bg-muted/20 p-4">
        {kicker ? <p className={directorKicker}>{kicker}</p> : null}
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description ? (
          <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}
