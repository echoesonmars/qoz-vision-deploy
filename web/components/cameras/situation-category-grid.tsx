"use client";

import {
  buildEngagementSessionHref,
  getCameraLabelByDeviceId,
} from "@/lib/cameras/camera-label-by-device";
import {
  isFleetSituationJournalItem,
  isFleetSituationLiveItem,
  type FleetSituationItem,
} from "@/lib/cameras/live-analysis-types";
import type { IncidentRow } from "@/lib/incidents-types";
import { LiveIncidentMomentCard } from "@/components/cameras/live-incident-moment-card";
import { SituationJournalCard } from "@/components/cameras/situation-journal-card";

type SituationCategoryGridProps = {
  items: FleetSituationItem[];
  journalById: Map<string, IncidentRow>;
  busyIncidentId: string | null;
  onOpenJournal: (incidentId: string) => void;
  onDeleteJournal: (incidentId: string) => void;
};

export function SituationCategoryGrid({
  items,
  journalById,
  busyIncidentId,
  onOpenJournal,
  onDeleteJournal,
}: SituationCategoryGridProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        if (isFleetSituationLiveItem(item)) {
          return (
            <LiveIncidentMomentCard
              key={`live-${item.id}`}
              row={item}
              as="div"
              cameraLabel={getCameraLabelByDeviceId(item.deviceId)}
              detailHref={buildEngagementSessionHref(item.deviceId, item.sessionId)}
              sessionStatus={item.sessionStatus}
            />
          );
        }
        if (isFleetSituationJournalItem(item)) {
          return (
            <SituationJournalCard
              key={`journal-${item.incidentId}-${item.category}`}
              item={item}
              incident={journalById.get(item.incidentId) ?? null}
              actionBusy={busyIncidentId === item.incidentId}
              onOpen={() => onOpenJournal(item.incidentId)}
              onDelete={() => onDeleteJournal(item.incidentId)}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
