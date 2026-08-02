"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IncidentGrid } from "@/components/cameras/incident-grid";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { IncidentModal } from "@/components/cameras/incident-modal";
import { IncidentsToolbar } from "@/components/cameras/incidents-toolbar";
import { UploadDialog } from "@/components/cameras/upload-dialog";
import { buildEngagementListPath, ENGAGEMENT_INCIDENT_QUERY_KEY } from "@/lib/cameras/engagement-incident-url";
import { useIncidentDelete } from "@/lib/cameras/use-incident-delete";
import { buildIncidentDisplayNumbers } from "@/lib/incidents-display";
import { filterIncidents, type IncidentCategoryFilter } from "@/lib/incidents-filter";
import { incidentsSnapshot } from "@/lib/incidents-snapshot";
import type { IncidentRow } from "@/lib/incidents-types";

const POLL_INTERVAL_MS = 5_000;
const MAX_POLL_TICKS = 72;

function applyIncidents(
  prev: IncidentRow[],
  next: IncidentRow[],
): IncidentRow[] {
  return incidentsSnapshot(prev) === incidentsSnapshot(next) ? prev : next;
}

export function IncidentsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const incidentIdFromUrl = searchParams.get(ENGAGEMENT_INCIDENT_QUERY_KEY);
  const [incidents, setIncidents] = useState<IncidentRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<IncidentRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<IncidentCategoryFilter>("all");
  const [date, setDate] = useState<Date | undefined>();
  const [operationBusyId, setOperationBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const pollTicksRef = useRef(0);

  const fetchIncidents = useCallback(async (): Promise<IncidentRow[] | null> => {
    try {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? res.statusText);
      }
      setLoadError(null);
      return data as IncidentRow[];
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Не удалось загрузить список");
      return null;
    }
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    const data = await fetchIncidents();
    if (data) {
      setIncidents((prev) => applyIncidents(prev, data));
    }
    setLoading(false);
  }, [fetchIncidents]);

  const reloadList = useCallback(async () => {
    const data = await fetchIncidents();
    if (data) {
      setIncidents((prev) => applyIncidents(prev, data));
    }
  }, [fetchIncidents]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  const clearIncidentFromUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has(ENGAGEMENT_INCIDENT_QUERY_KEY)) return;
    params.delete(ENGAGEMENT_INCIDENT_QUERY_KEY);
    router.replace(buildEngagementListPath(params));
  }, [router, searchParams]);

  const openIncident = useCallback(
    (row: IncidentRow) => {
      setSelected(row);
      setModalOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "incidents");
      if (params.get(ENGAGEMENT_INCIDENT_QUERY_KEY) === row.id) return;
      params.set(ENGAGEMENT_INCIDENT_QUERY_KEY, row.id);
      router.push(buildEngagementListPath(params));
    },
    [router, searchParams],
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
    if (loading) return;
    const row = incidents.find((item) => item.id === incidentIdFromUrl);
    if (row) {
      setSelected(row);
      setModalOpen(true);
    }
  }, [incidentIdFromUrl, incidents, loading]);

  const handleDeleted = useCallback(
    (incidentId: string) => {
      if (selected?.id === incidentId) {
        setModalOpen(false);
        setSelected(null);
        clearIncidentFromUrl();
      }
      setIncidents((prev) => prev.filter((row) => row.id !== incidentId));
    },
    [clearIncidentFromUrl, selected],
  );

  const {
    deleteIncident,
    busyIncidentId: deleteBusyId,
    error: deleteError,
  } = useIncidentDelete({
    onDeleted: handleDeleted,
  });

  const busyIncidentId = operationBusyId ?? deleteBusyId;

  const processingKey = useMemo(() => {
    return incidents
      .filter((row) => row.analysis_status === "processing")
      .map((row) => row.id)
      .sort()
      .join(",");
  }, [incidents]);

  useEffect(() => {
    if (!processingKey) {
      pollTicksRef.current = 0;
      return;
    }

    const timer = setInterval(() => {
      if (pollTicksRef.current >= MAX_POLL_TICKS) return;
      pollTicksRef.current += 1;
      void reloadList();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [processingKey, reloadList]);

  const handleRetry = useCallback(
    async (incident: IncidentRow) => {
      setActionError(null);
      setOperationBusyId(incident.id);
      try {
        const res = await fetch("/api/incidents/retry-analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ incidentId: incident.id }),
        });
        const data = (await res.json()) as { error?: string; status?: string };
        if (!res.ok) {
          throw new Error(data.error ?? res.statusText);
        }
        pollTicksRef.current = 0;
        await reloadList();
      } catch (e) {
        setActionError(e instanceof Error ? e.message : "Не удалось запустить анализ");
      } finally {
        setOperationBusyId(null);
      }
    },
    [reloadList],
  );

  const handleStop = useCallback(
    async (incident: IncidentRow) => {
      setActionError(null);
      setOperationBusyId(incident.id);
      try {
        const res = await fetch("/api/incidents/cancel-analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ incidentId: incident.id }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? res.statusText);
        }
        await reloadList();
      } catch (e) {
        setActionError(e instanceof Error ? e.message : "Не удалось остановить анализ");
      } finally {
        setOperationBusyId(null);
      }
    },
    [reloadList],
  );

  const handleDelete = useCallback(
    (incident: IncidentRow) => {
      setActionError(null);
      void deleteIncident(incident);
    },
    [deleteIncident],
  );

  const displayNumbers = useMemo(
    () => buildIncidentDisplayNumbers(incidents),
    [incidents],
  );

  const filteredIncidents = useMemo(
    () => filterIncidents(incidents, { search, category, date }),
    [incidents, search, category, date],
  );

  const selectedDisplayNumber = selected ? displayNumbers[selected.id] : undefined;

  return (
    <div className="flex flex-col gap-4">
      <IncidentsToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        date={date}
        onDateChange={setDate}
        onUploadClick={() => setUploadOpen(true)}
      />
      {loadError ? (
        <p className="text-destructive text-sm">{loadError}</p>
      ) : null}
      {actionError || deleteError ? (
        <p className="text-destructive text-sm">{actionError ?? deleteError}</p>
      ) : null}
      {loading && incidents.length === 0 ? (
        <AdmLoadingScreen variant="inline" />
      ) : incidents.length === 0 ? (
        <p className="text-muted-foreground text-sm">Нет инцидентов. Загрузите первое видео.</p>
      ) : filteredIncidents.length === 0 ? (
        <p className="text-muted-foreground text-sm">Ничего не найдено по выбранным фильтрам.</p>
      ) : (
        <IncidentGrid
          incidents={filteredIncidents}
          displayNumbers={displayNumbers}
          busyIncidentId={busyIncidentId}
          onSelect={openIncident}
          onRetry={handleRetry}
          onStop={handleStop}
          onDelete={handleDelete}
        />
      )}
      <IncidentModal
        incident={selected}
        displayNumber={selectedDisplayNumber}
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        onDelete={
          selected
            ? () => {
                handleDelete(selected);
              }
            : undefined
        }
        deleteBusy={selected ? busyIncidentId === selected.id : false}
      />
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploaded={() => {
          pollTicksRef.current = 0;
          void reloadList();
        }}
      />
    </div>
  );
}
