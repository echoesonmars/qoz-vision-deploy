"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { KnowledgeMapTopicFlowNode } from "@/components/dashboard/knowledge-map/knowledge-map-node-types";
import type { ResolvedTopic } from "@/lib/data/stubs/dashboard/knowledge-map-mock";
import { cn } from "@/lib/utils";
import { Handle, type NodeProps, Position } from "@xyflow/react";

const levelAccent: Record<
  ResolvedTopic["masteryLevel"],
  { ring: string; bg: string; chip: string }
> = {
  green: {
    ring: "ring-primary/60 ring-2 ring-offset-2 ring-offset-background",
    bg: "bg-primary/15",
    chip: "text-primary",
  },
  yellow: {
    ring: "ring-[var(--status-warning)]/70 ring-2 ring-offset-2 ring-offset-background",
    bg: "bg-[var(--status-warning)]/15",
    chip: "text-[var(--status-warning)]",
  },
  red: {
    ring: "ring-destructive/65 ring-2 ring-offset-2 ring-offset-background",
    bg: "bg-destructive/10",
    chip: "text-destructive",
  },
};

export function KnowledgeMapTopicNode(props: NodeProps<KnowledgeMapTopicFlowNode>) {
  const { data } = props;
  const accents = levelAccent[data.masteryLevel];
  const shortLabel =
    data.label.length > 22 ? `${data.label.slice(0, 21)}…` : data.label;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="size-3 border border-border bg-background"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="size-3 border border-border bg-background"
      />
      <HoverCard openDelay={80} closeDelay={80}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className={cn(
              "nodrag nopan w-48 rounded-xl border border-border/80 px-3 py-2 text-left text-xs shadow-sm transition-colors",
              accents.bg,
              accents.ring,
              data.graphSelected && "outline outline-2 outline-primary/70",
              data.isBottleneck &&
                "after:absolute after:right-3 after:top-2 after:size-2 after:rounded-full after:bg-orange-400 after:ring-2 after:ring-background",
              "relative",
            )}
          >
            <span className="font-semibold leading-snug text-foreground">
              {shortLabel}
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={cn("text-[11px] font-medium", accents.chip)}>
                {data.masteryPercent}%
              </span>
              <span className="text-muted-foreground text-[10px] uppercase tracking-wide">
                {data.redZoneStudents} в красном
              </span>
            </div>
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-72 space-y-3 p-4" sideOffset={8}>
          <div>
            <p className="text-base font-semibold leading-snug text-foreground">
              {data.label}
            </p>
            <p className={cn("mt-2 text-sm font-semibold", accents.chip)}>
              Усвоение: {data.masteryPercent}%
            </p>
          </div>
          <div className="space-y-1 border-t border-border/60 pt-2 text-xs text-muted-foreground">
            <p>Учитель: {data.teacher}</p>
            <p>В красной зоне: {data.redZoneStudents} учеников</p>
            {data.isBottleneck ? (
              <p className="text-orange-600 dark:text-orange-400">
                Затор: фактическое время на тему выше норматива
              </p>
            ) : null}
          </div>
        </HoverCardContent>
      </HoverCard>
      <Handle
        type="source"
        position={Position.Right}
        className="size-3 border border-border bg-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="size-3 border border-border bg-background"
      />
    </>
  );
}
