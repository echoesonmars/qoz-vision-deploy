"use client";

import { Badge } from "@/components/ui/badge";
import {
  summaryCardHeaderMuted,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import type {
  KnowledgeScaleKey,
  KnowledgeStandardKey,
  KnowledgeSubjectKey,
  PacingSummary,
} from "@/lib/data/stubs/dashboard/knowledge-map-mock";
import { getResolvedTopics } from "@/lib/data/stubs/dashboard/knowledge-map-mock";
import { cn } from "@/lib/utils";
import { MdOutlineTrendingFlat, MdOutlineTrendingDown, MdOutlineTrendingUp } from "react-icons/md";
import { Button } from "@/components/ui/button";

type KnowledgeMapPacingPanelProps = {
  subject: KnowledgeSubjectKey;
  scale: KnowledgeScaleKey;
  standard: KnowledgeStandardKey;
  pacing: PacingSummary;
  onFocusNode: (nodeId: string) => void;
};

export function KnowledgeMapPacingPanel({
  subject,
  scale,
  standard,
  pacing,
  onFocusNode,
}: KnowledgeMapPacingPanelProps) {
  const topics = getResolvedTopics(subject, scale, standard);
  const labels = pacing.bottleneckRefs
    .map((nodeId) => topics.find((topic) => topic.id === nodeId))
    .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));

  const ToneIcon =
    pacing.tone === "ahead"
      ? MdOutlineTrendingUp
      : pacing.tone === "behind"
        ? MdOutlineTrendingDown
        : MdOutlineTrendingFlat;

  return (
    <div className="flex flex-col">
      <div className={cn(summaryCardHeaderMuted, "space-y-2 border-b px-4 pb-4 pt-4")}>
        <div className="flex items-start gap-2">
          <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30">
            <ToneIcon className="size-5" aria-hidden />
          </span>
          <div className="space-y-1">
            <p className={summaryKicker}>Ритм и синхронизация</p>
            <p className="font-semibold text-foreground">{pacing.statusLabel}</p>
            <Badge variant="outline" className="font-normal">
              {pacing.varianceLabel}
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Узлы, где занятость превышает норматив времени календарно-тематического плана (заторы).
        </p>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {labels.length === 0 ? (
          <p className="text-muted-foreground text-sm leading-relaxed">Заторы не найдены.</p>
        ) : null}
        {labels.map((topic) => (
          <Button
            key={topic.id}
            type="button"
            variant="outline"
            size="sm"
            className="h-auto min-h-10 justify-between gap-3 py-3 text-xs font-semibold shadow-none sm:text-sm"
            onClick={() => onFocusNode(topic.id)}
          >
            <span className="line-clamp-2 text-left leading-snug">{topic.label}</span>
            <span className="text-muted-foreground shrink-0 text-[10px] uppercase tracking-wide">
              затор
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
