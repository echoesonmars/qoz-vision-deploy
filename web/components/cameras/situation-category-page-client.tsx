"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IncidentModal } from "@/components/cameras/incident-modal";
import { SituationCategoryGrid } from "@/components/cameras/situation-category-grid";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { Button } from "@/components/ui/button";
import {
  buildSituationCategoryPath,
  ENGAGEMENT_INCIDENT_QUERY_KEY,
} from "@/lib/cameras/engagement-incident-url";
import { useFleetSituationCategory } from "@/lib/cameras/use-fleet-situation-category";
import { fleetHistoryPeriodLabel } from "@/lib/cameras/fleet-history-period";
import { incidentCategoryLabel } from "@/lib/incident-categories";
import { buildIncidentDisplayNumbers } from "@/lib/incidents-display";
import { useIncidentDelete } from "@/lib/cameras/use-incident-delete";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import type { KnownIncidentCategory, IncidentRow } from "@/lib/incidents-types";

type SituationCategoryPageClientProps = {
  category: KnownIncidentCategory;
};

export function SituationCategoryPageClient({ category }: SituationCategoryPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const incidentIdFromUrl = searchParams.get(ENGAGEMENT_INCIDENT_QUERY_KEY);
  const fleet = useFleetSituationCategory(category);
  const [journalRows, setJournalRows] = useState<IncidentRow[]>([]);
  const [journalLoading, setJournalLoading] = useState(true);
  const [selected, setSelected] = useState<IncidentRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setJournalLoading(true);
      try {
        const res = await fetch("/api/incidents");
        const data = (await res.json()) as IncidentRow[] | { error?: string };
        if (!res.ok || !Array.isArray(data)) return;
        if (!cancelled) setJournalRows(data);
      } catch {
        if (!cancelled) setJournalRows([]);
      } finally {
        if (!cancelled) setJournalLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const journalById = useMemo(() => {
    const map = new Map<string, IncidentRow>();
    for (const row of journalRows) {
      map.set(row.id, row);
    }
    return map;
  }, [journalRows]);

  const displayNumbers = useMemo(
    () => buildIncidentDisplayNumbers(journalRows),
    [journalRows],
  );

  const clearIncidentFromUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has(ENGAGEMENT_INCIDENT_QUERY_KEY)) return;
    params.delete(ENGAGEMENT_INCIDENT_QUERY_KEY);
    router.replace(buildSituationCategoryPath(category, params));
  }, [category, router, searchParams]);

  const openJournal = useCallback(
    (incidentId: string) => {
      const row = journalById.get(incidentId);
      if (!row) return;
      setSelected(row);
      setModalOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(ENGAGEMENT_INCIDENT_QUERY_KEY) === incidentId) return;
      params.set(ENGAGEMENT_INCIDENT_QUERY_KEY, incidentId);
      router.push(buildSituationCategoryPath(category, params));
    },
    [category, journalById, router, searchParams],
  );

  const handleModalOpenChange = useCallback(
    (open: boolean) => {
      setModalOpen(open);
      if (!open) {
        setSelected(null);
        clearIncidentFromUrl();
      }
    },
    [clearIncidentFromUrl],
  );

  useEffect(() => {
    if (!incidentIdFromUrl) {
      setModalOpen(false);
      setSelected(null);
      return;
    }
    if (journalLoading) return;
    const row = journalById.get(incidentIdFromUrl);
    if (row) {
      setSelected(row);
      setModalOpen(true);
    }
  }, [incidentIdFromUrl, journalById, journalLoading]);

  const handleDeleted = useCallback(
    (incidentId: string) => {
      if (selected?.id === incidentId) {
        setModalOpen(false);
        setSelected(null);
        clearIncidentFromUrl();
      }
      setJournalRows((prev) => prev.filter((row) => row.id !== incidentId));
      fleet.removeJournalIncident(incidentId);
    },
    [clearIncidentFromUrl, fleet, selected],
  );

  const { deleteIncident, busyIncidentId, error: deleteError } = useIncidentDelete({
    onDeleted: handleDeleted,
  });

  const deleteJournalIncident = useCallback(
    (incidentId: string) => {
      const row = journalById.get(incidentId);
      if (!row) return;
      void deleteIncident(row);
    },
    [deleteIncident, journalById],
  );

  const label = incidentCategoryLabel(category);
  const period = fleetHistoryPeriodLabel(fleet.retentionDays);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{label}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {fleet.total > 0
              ? `${fleet.total} событий ${period}`
              : `Нет событий типа «${label}» ${period}`}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={DIRECTOR_PATHS.camerasEngagement}>Назад к вовлечённости</Link>
        </Button>
      </div>

      {fleet.error ? <p className="text-destructive text-sm">{fleet.error}</p> : null}
      {deleteError ? <p className="text-destructive text-sm">{deleteError}</p> : null}

      {fleet.loading && fleet.items.length === 0 ? (
        <AdmLoadingScreen variant="inline" message="Загрузка событий…" />
      ) : null}

      {!fleet.loading && fleet.items.length === 0 && !fleet.error ? (
        <p className="text-muted-foreground text-sm">Нет событий этого типа за выбранный период.</p>
      ) : null}

      {fleet.items.length > 0 ? (
        <SituationCategoryGrid
          items={fleet.items}
          journalById={journalById}
          busyIncidentId={busyIncidentId}
          onOpenJournal={openJournal}
          onDeleteJournal={deleteJournalIncident}
        />
      ) : null}

      {fleet.hasMore ? (
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          disabled={fleet.loadingMore}
          onClick={fleet.loadMore}
        >
          {fleet.loadingMore ? "Загрузка…" : "Загрузить ещё"}
        </Button>
      ) : null}

      <IncidentModal
        incident={selected}
        displayNumber={selected ? displayNumbers[selected.id] : undefined}
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        onDelete={
          selected
            ? () => {
                void deleteIncident(selected);
              }
            : undefined
        }
        deleteBusy={selected ? busyIncidentId === selected.id : false}
      />
    </div>
  );
}
