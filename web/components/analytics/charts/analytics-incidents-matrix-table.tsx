"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { INCIDENT_TYPE_LABELS } from "@/lib/analytics/chart-config";
import type { SafetyAntibullyingData } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";
import { MdCircle } from "react-icons/md";

function statusIcon(status: "ok" | "warning" | "critical") {
  const colors = {
    ok: "text-[var(--status-success)]",
    warning: "text-[var(--status-warning)]",
    critical: "text-destructive",
  };
  return <MdCircle className={cn("size-3", colors[status])} aria-hidden />;
}

type AnalyticsIncidentsMatrixTableProps = {
  data: SafetyAntibullyingData;
  locationFilter?: string;
};

export function AnalyticsIncidentsMatrixTable({
  data,
  locationFilter,
}: AnalyticsIncidentsMatrixTableProps) {
  const locations = locationFilter
    ? data.locations.filter((l) => l.locationId === locationFilter)
    : data.locations;

  const types = [...new Set(data.matrix.map((m) => m.incidentType))];

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Локация</TableHead>
            {types.map((t) => (
              <TableHead key={t} className="text-center text-xs">
                {INCIDENT_TYPE_LABELS[t] ?? t}
              </TableHead>
            ))}
            <TableHead className="text-right">Всего</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((loc) => (
            <TableRow key={loc.locationId}>
              <TableCell className="font-medium">{loc.label}</TableCell>
              {types.map((t) => {
                const cell = data.matrix.find(
                  (m) => m.locationId === loc.locationId && m.incidentType === t,
                );
                return (
                  <TableCell key={t} className="text-center">
                    {cell ? (
                      <span className="inline-flex items-center justify-center gap-1 tabular-nums">
                        {statusIcon(cell.status)}
                        {cell.count}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                );
              })}
              <TableCell className="text-right">
                <Badge variant="secondary">{loc.incidents}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
