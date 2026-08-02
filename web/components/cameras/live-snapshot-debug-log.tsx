"use client";

import { useState } from "react";
import type { LiveAnalysisSnapshot } from "@/lib/cameras/live-analysis-types";
import { formatLiveClock } from "@/lib/cameras/format-live-time";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

type LiveSnapshotDebugLogProps = {
  snapshots: LiveAnalysisSnapshot[];
};

export function LiveSnapshotDebugLog({ snapshots }: LiveSnapshotDebugLogProps) {
  const [open, setOpen] = useState(false);

  if (snapshots.length === 0) return null;

  return (
    <section className="rounded-xl border border-dashed border-border/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium"
      >
        <span>Лог снимков (отладка)</span>
        {open ? (
          <MdExpandLess className="size-5 shrink-0" aria-hidden />
        ) : (
          <MdExpandMore className="size-5 shrink-0" aria-hidden />
        )}
      </button>
      {open ? (
        <ul className="max-h-64 space-y-1 overflow-y-auto border-t border-border/50 px-4 py-3 font-mono text-xs">
          {snapshots.slice(0, 40).map((s) => (
            <li key={s.id} className="text-muted-foreground tabular-nums">
              {formatLiveClock(s.capturedAt)} · score {s.engagementScore ?? "—"} · inc{" "}
              {s.incidentCount} · off {s.sessionOffsetSec ?? "—"}s
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
