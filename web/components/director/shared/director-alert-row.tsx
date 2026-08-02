"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { admAlertRowClass } from "@/lib/brand/ui-classes";
import { mapDirectorAlertToView } from "@/lib/brand/alert-view-mapper";
import { directorMetricContext } from "@/components/director/shared/director-styles";
import type { DirectorAlert } from "@/lib/director/types";
import { cn } from "@/lib/utils";
import {
  MdInfoOutline,
  MdOutlineReportProblem,
  MdWarningAmber,
} from "react-icons/md";
import type { AlertStatusKey } from "@/lib/brand/alert-status";

const statusIcons: Record<AlertStatusKey, ReactNode> = {
  success: <MdInfoOutline className="size-4 text-[var(--status-success)]" aria-hidden />,
  warning: <MdWarningAmber className="size-4 text-[var(--status-warning)]" aria-hidden />,
  critical: <MdOutlineReportProblem className="size-4 text-[var(--status-critical)]" aria-hidden />,
  info: <MdInfoOutline className="size-4 text-[var(--status-info)]" aria-hidden />,
};

type DirectorAlertRowProps = {
  alert: DirectorAlert;
};

export function DirectorAlertRow({ alert }: DirectorAlertRowProps) {
  const view = mapDirectorAlertToView(alert);

  return (
    <div className={cn(admAlertRowClass, view.status.borderClass)}>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {statusIcons[view.status.key]}
          <Badge variant="outline" className={cn("font-normal", view.status.badgeClass)}>
            {view.riskLabel}
          </Badge>
          <span className="text-muted-foreground text-xs">{view.occurredAt}</span>
        </div>
        <p className="text-sm font-medium leading-snug text-heading">{view.eventTitle}</p>
        <dl className="grid gap-1 text-xs sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Класс</dt>
            <dd className="font-medium">{view.classLabel}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Кабинет</dt>
            <dd className="font-medium">{view.roomLabel}</dd>
          </div>
        </dl>
        <p className={cn(directorMetricContext, "text-muted-foreground")}>{view.description}</p>
        <p className="text-muted-foreground text-xs">
          Ответственный: {view.responsible} · {view.reactionDeadline}
        </p>
      </div>
      <Button asChild size="sm" className="shrink-0">
        <Link href={view.actionHref}>{view.actionLabel}</Link>
      </Button>
    </div>
  );
}
