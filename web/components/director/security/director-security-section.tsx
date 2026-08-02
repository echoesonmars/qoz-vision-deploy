"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DirectorCountPercentValue } from "@/components/director/shared/director-count-percent-value";
import { DirectorDisclaimer } from "@/components/director/shared/director-disclaimer";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { DirectorSection } from "@/components/director/shared/director-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DIRECTOR_SECTION_ANCHORS } from "@/lib/director/anchors";
import { directorDetailRepo } from "@/lib/data";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import {
  SECURITY_SIGNAL_LABELS,
  SECURITY_WORKFLOW_LABELS,
  SECURITY_WORKFLOW_NEXT,
} from "@/lib/director/security-labels";
import type { SecurityBlock, SecurityEvent, SecurityWorkflowStatus } from "@/lib/director/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { DirectorSourceBadge } from "@/components/director/shared/director-source-badge";
import { Skeleton } from "@/components/ui/skeleton";

type DirectorSecuritySectionProps = {
  data: SecurityBlock | undefined;
  loading: boolean;
};

export function DirectorSecuritySection({ data, loading }: DirectorSecuritySectionProps) {
  const [statuses, setStatuses] = useState<Record<string, SecurityWorkflowStatus>>({});

  const events = useMemo(() => {
    if (!data) return [];
    return data.recentEvents.map((e) => ({
      ...e,
      workflowStatus: statuses[e.id] ?? e.workflowStatus,
    }));
  }, [data, statuses]);

  function advanceStatus(event: SecurityEvent) {
    const current = statuses[event.id] ?? event.workflowStatus;
    const next = SECURITY_WORKFLOW_NEXT[current];
    if (!next) return;
    setStatuses((prev) => ({ ...prev, [event.id]: next }));
  }

  return (
    <DirectorSection
      id={DIRECTOR_SECTION_ANCHORS.security}
      kicker="Блок 3"
      title="Безопасность школы"
      description="ИИ выявляет сигналы — решение принимает сотрудник школы"
      action={
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/dashboard?tab=analytics&section=safety">Аналитика безопасности</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={DIRECTOR_PATHS.camerasIncidents}>Журнал с видео</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={DIRECTOR_PATHS.alerts}>Все события</Link>
          </Button>
        </div>
      }
    >
      {loading || !data ? (
        <Skeleton className="h-56 rounded-2xl" />
      ) : (
        <div className="flex flex-col gap-6">
          <DirectorDisclaimer>
            ИИ только выявляет сигналы. Решение принимает сотрудник школы.
          </DirectorDisclaimer>
          <DirectorSourceBadge source="qoz_vision" realtime />
          {(() => {
            const signalTotal = Object.values(data.signalCounts).reduce(
              (sum, value) => sum + value,
              0,
            );
            return (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            {(Object.keys(SECURITY_SIGNAL_LABELS) as (keyof typeof SECURITY_SIGNAL_LABELS)[]).map(
              (key) => (
                <DirectorKpiTile
                  key={key}
                  label={SECURITY_SIGNAL_LABELS[key]}
                  value={
                    <DirectorCountPercentValue
                      count={data.signalCounts[key]}
                      total={signalTotal}
                      fractionDigits={0}
                    />
                  }
                  status={data.signalCounts[key] > 0 ? "warning" : "ok"}
                />
              ),
            )}
          </div>
            );
          })()}
          <div className="overflow-x-auto rounded-xl ring-1 ring-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Зона</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Время</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.zoneName}</TableCell>
                    <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      {format(new Date(event.occurredAt), "dd.MM HH:mm", { locale: ru })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {SECURITY_WORKFLOW_LABELS[event.workflowStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/director/security/${event.id}`}>
                            Открыть
                          </Link>
                        </Button>
                        {event.workflowStatus !== "closed" ? (
                          <Button type="button" size="sm" onClick={() => advanceStatus(event)}>
                            {event.workflowStatus === "new"
                              ? "Взять"
                              : event.workflowStatus === "reviewing"
                                ? "Передать"
                                : "Закрыть"}
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
            <p className="mb-3 text-sm font-semibold">Зоны мониторинга</p>
            <div className="flex flex-wrap gap-2">
              {directorDetailRepo.getMonitoringZones().map((zone) => (
                <Badge
                  key={zone.id}
                  variant={zone.allowed ? "outline" : "destructive"}
                  className="font-normal"
                >
                  {zone.name}
                  {!zone.allowed ? " · мониторинг запрещён" : ""}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </DirectorSection>
  );
}
