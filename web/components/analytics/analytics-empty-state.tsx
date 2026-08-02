"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AnalyticsEmptyStateProps = {
  title: string;
  description: string;
  onReset?: () => void;
};

export function AnalyticsEmptyState({
  title,
  description,
  onReset,
}: AnalyticsEmptyStateProps) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm ring-1 ring-border/60">
      <CardHeader className="p-6">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
      </CardHeader>
      {onReset ? (
        <CardContent className="p-6 pt-0">
          <Button type="button" variant="outline" size="sm" onClick={onReset}>
            Сбросить фильтры
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}
