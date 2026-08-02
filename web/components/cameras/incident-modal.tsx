"use client";

import { useEffect, useRef, useState } from "react";
import { IncidentCategoryBadges } from "@/components/cameras/incident-category-badges";
import { IncidentDeleteControl } from "@/components/cameras/incident-delete-control";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { incidentCategoryBadge } from "@/lib/incidents-category-meta";
import { incidentDetectedCategories } from "@/lib/incidents-detected";
import type { IncidentRow } from "@/lib/incidents-types";
import { cn } from "@/lib/utils";

type IncidentModalProps = {
  incident: IncidentRow | null;
  displayNumber?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
  deleteBusy?: boolean;
};

export function IncidentModal({
  incident,
  displayNumber,
  open,
  onOpenChange,
  onDelete,
  deleteBusy = false,
}: IncidentModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !incident) {
      setVideoUrl(null);
      setError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setError(null);
      setVideoUrl(null);
      try {
        const res = await fetch(`/api/incidents/${incident.id}/signed-url`);
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? res.statusText);
        }
        if (!cancelled && data.url) {
          setVideoUrl(data.url);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Не удалось загрузить видео");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, incident]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoUrl) return;
    el.src = videoUrl;
    void el.play().catch(() => {});
    return () => {
      el.removeAttribute("src");
      el.load();
    };
  }, [videoUrl]);

  if (!incident) return null;

  const hits = incidentDetectedCategories(incident);
  const confidenceLabel =
    hits.length > 1
      ? hits.map((h) => `${Math.round(h.confidence)}%`).join(" · ")
      : incident.confidence != null
        ? `${Math.round(incident.confidence)}%`
        : "—";
  const title =
    displayNumber != null ? `Инцидент #${displayNumber}` : "Инцидент";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl [&_[data-slot=dialog-close]]:top-3 [&_[data-slot=dialog-close]]:right-3 [&_[data-slot=dialog-close]]:z-20 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-background/90 [&_[data-slot=dialog-close]]:shadow-sm">
        <div className="relative shrink-0">
          {error ? (
            <div className="flex aspect-video items-center justify-center bg-muted px-4">
              <p className="text-destructive text-center text-sm">{error}</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="aspect-video w-full bg-black object-contain"
              controls
              playsInline
            />
          )}
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto px-6 pb-6 pt-4">
          <DialogHeader className="gap-3 space-y-0 pr-8 text-left">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <DialogTitle className="text-lg">{title}</DialogTitle>
              <IncidentCategoryBadges incident={incident} className="max-w-none" />
            </div>
            <DialogDescription className="text-sm">
              {incident.camera_label ?? "Запись из Storage"} ·{" "}
              {new Date(incident.created_at).toLocaleString("ru-RU")}
            </DialogDescription>
            <p className="text-sm font-medium text-muted-foreground">
              Точность:{" "}
              <span className="font-semibold text-foreground">{confidenceLabel}</span>
            </p>
            {hits.length > 1 ? (
              <div className="flex flex-col gap-3">
                {hits.map((hit) => {
                  const { label, className: badgeClassName } = incidentCategoryBadge(hit.category);
                  return (
                    <div
                      key={hit.category}
                      className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5"
                    >
                      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                        <Badge className={cn("font-medium", badgeClassName)}>{label}</Badge>
                        <span className="text-xs font-semibold text-foreground">
                          {Math.round(hit.confidence)}%
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {hit.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {incident.description ?? "Описание появится после анализа"}
              </p>
            )}
          </DialogHeader>
          <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Аудит просмотра
            </p>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>
                {new Date().toLocaleString("ru-RU")} — Сессия директора: открыт просмотр видео
              </li>
              <li>Запись будет добавлена в журнал аудита (§16)</li>
            </ul>
          </div>
          {onDelete ? (
            <IncidentDeleteControl
              busy={deleteBusy}
              onConfirm={onDelete}
              className="w-full"
              confirmClassName="w-full"
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
