"use client";

import { useCallback, useState } from "react";
import { requestDeleteIncident } from "@/lib/cameras/delete-incident-client";
import type { IncidentRow } from "@/lib/incidents-types";

type UseIncidentDeleteOptions = {
  onDeleted?: (incidentId: string) => void;
};

export function useIncidentDelete(options: UseIncidentDeleteOptions = {}) {
  const { onDeleted } = options;
  const [busyIncidentId, setBusyIncidentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deleteIncident = useCallback(
    async (incident: IncidentRow) => {
      setError(null);
      setBusyIncidentId(incident.id);
      try {
        await requestDeleteIncident(incident);
        onDeleted?.(incident.id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Не удалось удалить");
      } finally {
        setBusyIncidentId(null);
      }
    },
    [onDeleted],
  );

  return {
    deleteIncident,
    busyIncidentId,
    error,
    setError,
  };
}
