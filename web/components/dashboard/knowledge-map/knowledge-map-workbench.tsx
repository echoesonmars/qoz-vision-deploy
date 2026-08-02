"use client";

import { Card, CardContent } from "@/components/ui/card";
import { summaryCardInteractive } from "@/components/dashboard/summary-card-shell";
import { cn } from "@/lib/utils";
import {
  getBlindSpots,
  getPacingSummary,
  type KnowledgeScaleKey,
  type KnowledgeStandardKey,
  type KnowledgeSubjectKey,
} from "@/lib/data/stubs/dashboard/knowledge-map-mock";
import { ReactFlowProvider } from "@xyflow/react";
import { useMemo, useState } from "react";
import { KnowledgeMapAiHub } from "./knowledge-map-ai-hub";
import { KnowledgeMapBlindSpotsPanel } from "./knowledge-map-blind-spots-panel";
import { KnowledgeMapFlow } from "./knowledge-map-flow";
import { KnowledgeMapPacingPanel } from "./knowledge-map-pacing-panel";
import { KnowledgeMapToolbar } from "./knowledge-map-toolbar";

const knowledgeMapAsideCard = cn(
  "gap-0 py-0",
  "min-w-0 rounded-xl border border-border/60 bg-card text-card-foreground shadow-sm",
  "ring-0 !overflow-visible",
);

export function KnowledgeMapWorkbench() {
  const [subject, setSubject] = useState<KnowledgeSubjectKey>("math");
  const [scale, setScale] = useState<KnowledgeScaleKey>("school");
  const [standard, setStandard] = useState<KnowledgeStandardKey>("nish");
  const [focusId, setFocusId] = useState<string | null>(null);

  const blindItems = useMemo(
    () => getBlindSpots(subject, scale, standard),
    [subject, scale, standard],
  );
  const pacing = useMemo(
    () => getPacingSummary(subject, scale, standard),
    [subject, scale, standard],
  );

  return (
    <>
      <Card className={cn(summaryCardInteractive, "gap-0 py-0")}>
        <KnowledgeMapToolbar
          subject={subject}
          onSubjectChange={(next) => {
            setSubject(next);
            setFocusId(null);
          }}
          standard={standard}
          onStandardChange={(next) => {
            setStandard(next);
            setFocusId(null);
          }}
          scale={scale}
          onScaleChange={(value) => {
            setScale(value);
            setFocusId(null);
          }}
        />
      </Card>

      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
        <Card
          className={cn(
            summaryCardInteractive,
            "flex min-h-[320px] flex-col gap-0 overflow-hidden py-0 lg:h-full lg:min-h-0",
          )}
        >
          <CardContent className="flex min-h-0 flex-1 flex-col p-0 sm:p-0">
            <ReactFlowProvider>
              <div className="min-h-0 w-full flex-1">
                <KnowledgeMapFlow
                  subject={subject}
                  scale={scale}
                  standard={standard}
                  focusedNodeId={focusId}
                />
              </div>
            </ReactFlowProvider>
          </CardContent>
        </Card>

        <div className="flex min-h-0 min-w-0 flex-col gap-4 lg:min-h-0">
          <Card className={knowledgeMapAsideCard}>
            <KnowledgeMapBlindSpotsPanel items={blindItems} onFocusNode={setFocusId} />
          </Card>
          <Card className={knowledgeMapAsideCard}>
            <KnowledgeMapPacingPanel
              subject={subject}
              scale={scale}
              standard={standard}
              pacing={pacing}
              onFocusNode={setFocusId}
            />
          </Card>
          <Card className={knowledgeMapAsideCard}>
            <KnowledgeMapAiHub />
          </Card>
        </div>
      </div>
    </>
  );
}
