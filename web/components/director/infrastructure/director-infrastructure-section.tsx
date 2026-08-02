"use client";

import Link from "next/link";
import { MetricInfrastructureCard } from "@/components/dashboard/metrics/metric-infrastructure-card";
import { DirectorCountPercentValue } from "@/components/director/shared/director-count-percent-value";
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
import type { InfrastructureBlock } from "@/lib/director/types";
import { DIRECTOR_SCHOOL_ROOM_COUNT } from "@/lib/director/school-scale";
import { Skeleton } from "@/components/ui/skeleton";

const WIFI_LABELS = {
  stable: "Стабильно",
  unstable: "Нестабильно",
  offline: "Офлайн",
} as const;

type DirectorInfrastructureSectionProps = {
  data: InfrastructureBlock | undefined;
  loading: boolean;
};

export function DirectorInfrastructureSection({
  data,
  loading,
}: DirectorInfrastructureSectionProps) {
  return (
    <DirectorSection
      id={DIRECTOR_SECTION_ANCHORS.infrastructure}
      kicker="Блок 5"
      title="Инфраструктура и цифровая готовность"
      description="Техническая готовность школы к AI Classroom"
      action={
        <Button asChild variant="outline" size="sm">
          <Link href={DIRECTOR_PATHS.managementMap}>Карта кабинетов</Link>
        </Button>
      }
    >
      {loading || !data ? (
        <Skeleton className="h-56 rounded-2xl" />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DirectorKpiTile
              label="Покрытие Wi-Fi"
              value={`${data.wifiCoveragePercent}%`}
              context="Порог ≥95%"
              status={data.wifiCoveragePercent >= 95 ? "ok" : "warning"}
            />
            <DirectorKpiTile
              label="AI Classroom"
              value={`${data.aiClassroomReadyPercent}%`}
              context="Порог ≥75%"
              status={data.aiClassroomReadyPercent >= 75 ? "ok" : "warning"}
            />
            <DirectorKpiTile
              label="Заявок на ремонт"
              value={
                <DirectorCountPercentValue
                  count={data.openRepairTickets}
                  total={DIRECTOR_SCHOOL_ROOM_COUNT}
                  fractionDigits={0}
                />
              }
              context="Цель <5"
              status={data.openRepairTickets < 5 ? "ok" : "warning"}
            />
            <DirectorKpiTile
              label="Камеры онлайн"
              value={`${data.camerasOnlinePercent}%`}
              context="Порог ≥95%"
              status={data.camerasOnlinePercent >= 95 ? "ok" : "warning"}
            />
          </div>
          <DirectorKpiTile
            label="Скорость интернета"
            value={`${data.internetSpeedMbps} Мбит/с`}
            context="Медиана за день · порог ≥50"
            status={data.internetSpeedMbps >= 50 ? "ok" : "warning"}
            className="max-w-sm"
          />
          <div className="overflow-x-auto rounded-xl ring-1 ring-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Кабинет</TableHead>
                  <TableHead>Интернет</TableHead>
                  <TableHead>Оборудование</TableHead>
                  <TableHead>Готовность</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/director/rooms/${room.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {room.number}
                      </Link>
                    </TableCell>
                    <TableCell>{WIFI_LABELS[room.wifiStatus]}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {room.equipment}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          room.readiness === "ready"
                            ? "default"
                            : room.readiness === "critical"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {directorDetailRepo.getRoomStatusLabels()[room.readiness]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="max-w-2xl">
            <MetricInfrastructureCard />
          </div>
        </div>
      )}
    </DirectorSection>
  );
}
