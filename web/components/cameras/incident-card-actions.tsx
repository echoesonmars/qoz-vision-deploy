"use client";

import { IncidentDeleteControl } from "@/components/cameras/incident-delete-control";
import { Button } from "@/components/ui/button";
import {
  canRetryIncidentAnalysis,
  canStopIncidentAnalysis,
} from "@/lib/incidents-analysis-meta";
import type { IncidentRow } from "@/lib/incidents-types";
import { MdRefresh, MdStop } from "react-icons/md";

type IncidentCardActionsProps = {
  incident: IncidentRow;
  busy: boolean;
  onRetry?: () => void;
  onStop?: () => void;
  onDelete: () => void;
};

export function IncidentCardActions({
  incident,
  busy,
  onRetry,
  onStop,
  onDelete,
}: IncidentCardActionsProps) {
  const showRetry = Boolean(onRetry) && canRetryIncidentAnalysis(incident);
  const showStop = Boolean(onStop) && canStopIncidentAnalysis(incident);

  return (
    <div className="flex flex-wrap gap-2">
      {showStop ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 flex-1 min-w-[7rem] gap-1.5"
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation();
            onStop?.();
          }}
        >
          <MdStop className="size-4" aria-hidden />
          Остановить
        </Button>
      ) : null}
      {showRetry ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 flex-1 min-w-[7rem] gap-1.5"
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation();
            onRetry?.();
          }}
        >
          <MdRefresh className="size-4" aria-hidden />
          Повторить
        </Button>
      ) : null}
      <IncidentDeleteControl
        busy={busy}
        onConfirm={onDelete}
        className="flex-1 min-w-[7rem]"
        confirmClassName="w-full"
      />
    </div>
  );
}
