"use client";

import type { IncidentRow } from "@/lib/incidents-types";
import { IncidentCard } from "@/components/cameras/incident-card";

type IncidentGridProps = {
  incidents: IncidentRow[];
  displayNumbers: Record<string, number>;
  busyIncidentId: string | null;
  onSelect: (incident: IncidentRow) => void;
  onRetry: (incident: IncidentRow) => void;
  onStop: (incident: IncidentRow) => void;
  onDelete: (incident: IncidentRow) => void;
};

export function IncidentGrid({
  incidents,
  displayNumbers,
  busyIncidentId,
  onSelect,
  onRetry,
  onStop,
  onDelete,
}: IncidentGridProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      {incidents.map((inc) => (
        <IncidentCard
          key={inc.id}
          incident={inc}
          displayNumber={displayNumbers[inc.id] ?? 0}
          actionBusy={busyIncidentId === inc.id}
          onOpen={() => onSelect(inc)}
          onRetry={() => onRetry(inc)}
          onStop={() => onStop(inc)}
          onDelete={() => onDelete(inc)}
        />
      ))}
    </div>
  );
}
