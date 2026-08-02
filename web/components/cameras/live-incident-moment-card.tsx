"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { normalizeLiveIncidentType } from "@/lib/cameras/live-incident-normalize";
import { formatLiveClock } from "@/lib/cameras/format-live-time";
import type { LiveIncidentMoment } from "@/lib/cameras/live-analysis-types";
import { incidentCategoryBadge } from "@/lib/incidents-category-meta";
import { cn } from "@/lib/utils";

type LiveIncidentMomentCardProps = {
  row: LiveIncidentMoment;
  active?: boolean;
  cameraLabel?: string;
  detailHref?: string;
  sessionStatus?: string | null;
  as?: "li" | "div";
};

export function LiveIncidentMomentCard({
  row,
  active = false,
  cameraLabel,
  detailHref,
  sessionStatus,
  as = "li",
}: LiveIncidentMomentCardProps) {
  const category = normalizeLiveIncidentType(row.type);
  const { label, className: badgeClass } = incidentCategoryBadge(category);
  const Root = as;

  return (
    <Root
      className={cn(
        "rounded-xl border bg-card p-4 ring-1",
        active
          ? "border-primary ring-primary/30 bg-primary/5"
          : "border-border/70 ring-border/40",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={cn("border-none", badgeClass)}>{label}</Badge>
        <Badge variant="outline" className="text-xs capitalize">
          {row.confidence}
        </Badge>
        {sessionStatus ? (
          <Badge variant="secondary" className="text-xs capitalize">
            {sessionStatus}
          </Badge>
        ) : null}
        <span className="text-muted-foreground ml-auto font-mono text-xs tabular-nums">
          {formatLiveClock(row.capturedAt)}
          {row.timestampMarker ? ` · ${row.timestampMarker}` : null}
        </span>
      </div>
      {cameraLabel ? (
        <p className="text-muted-foreground mt-2 text-xs font-medium">{cameraLabel}</p>
      ) : null}
      {row.evidenceUrl ? (
        <a
          href={row.evidenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block overflow-hidden rounded-lg border border-border/70 ring-1 ring-border/40"
        >
          <img src={row.evidenceUrl} alt="" className="aspect-video w-full object-cover" />
        </a>
      ) : null}
      <p className="text-foreground mt-3 text-sm leading-relaxed">{row.description}</p>
      {row.locationContext ? (
        <p className="text-muted-foreground mt-2 text-xs">{row.locationContext}</p>
      ) : null}
      <div className="text-primary mt-2 flex flex-wrap gap-3 text-xs font-medium">
        {row.evidenceUrl ? (
          <a
            href={row.evidenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Кадр-доказательство
          </a>
        ) : (
          <span className="text-muted-foreground">Кадр недоступен</span>
        )}
        {row.timestampMarker ? (
          <span className="text-muted-foreground">Момент в записи · {row.timestampMarker}</span>
        ) : null}
        {detailHref ? (
          <Link href={detailHref} className="hover:underline">
            Открыть сессию
          </Link>
        ) : null}
      </div>
    </Root>
  );
}
