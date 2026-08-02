"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLiveFleetStatus } from "@/lib/cameras/use-live-fleet-status";

export function LiveCaptureIntervalControl() {
  const { fleet, refresh } = useLiveFleetStatus();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!fleet) return null;

  const floorMs = fleet.captureIntervalMinFloorMs ?? 250;
  const minSec = floorMs / 1000;
  const currentIntervalSec = fleet.baseCaptureIntervalMs / 1000;

  async function apply() {
    const sec = Number.parseFloat(value.replace(",", "."));
    if (!Number.isFinite(sec) || sec < minSec || sec > 120) {
      setMsg(`${minSec}–120 с`);
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const captureIntervalMs = Math.round(sec * 1000);
      if (captureIntervalMs < floorMs) {
        setMsg(`${minSec}–120 с`);
        setBusy(false);
        return;
      }
      const res = await fetch("/api/live/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captureIntervalMs }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? res.statusText);
      setMsg(`Интервал: ${sec < 1 ? sec.toFixed(2) : Math.round(sec)} с`);
      await refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-2 text-sm">
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs">
          Интервал снимков (сек, мин. {minSec})
        </span>
        <input
          type="number"
          min={minSec}
          max={120}
          step={minSec < 1 ? "0.25" : "1"}
          placeholder={currentIntervalSec < 1 ? currentIntervalSec.toFixed(2) : String(Math.round(currentIntervalSec))}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border-input bg-background h-9 w-24 rounded-md border px-2 tabular-nums"
        />
      </label>
      <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void apply()}>
        {busy ? "…" : "Применить"}
      </Button>
      {msg ? <span className="text-muted-foreground text-xs">{msg}</span> : null}
    </div>
  );
}
