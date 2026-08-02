import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  directorKicker,
  directorMetricContext,
  directorMetricValue,
  directorSectionCard,
  directorStatusClass,
} from "@/components/director/shared/director-styles";
import { cn } from "@/lib/utils";

type DirectorKpiTileProps = {
  label: string;
  value: ReactNode;
  context?: ReactNode;
  status?: "ok" | "warning" | "critical";
  className?: string;
};

export function DirectorKpiTile({
  label,
  value,
  context,
  status,
  className,
}: DirectorKpiTileProps) {
  return (
    <Card className={cn(directorSectionCard, "h-full", className)}>
      <CardContent className="flex flex-col gap-2 p-6">
        <p className={directorKicker}>{label}</p>
        <p className={directorMetricValue}>{value}</p>
        {context ? (
          <p
            className={cn(
              directorMetricContext,
              status ? directorStatusClass(status) : "text-muted-foreground",
            )}
          >
            {context}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
