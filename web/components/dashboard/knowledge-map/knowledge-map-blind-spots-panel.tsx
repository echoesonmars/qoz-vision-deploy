"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  summaryCardHeaderMuted,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import type { BlindSpotItem } from "@/lib/data/stubs/dashboard/knowledge-map-mock";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MdOutlineWarningAmber } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type KnowledgeMapBlindSpotsPanelProps = {
  items: BlindSpotItem[];
  onFocusNode: (nodeId: string) => void;
};

export function KnowledgeMapBlindSpotsPanel({
  items,
  onFocusNode,
}: KnowledgeMapBlindSpotsPanelProps) {
  const [active, setActive] = useState<BlindSpotItem | null>(null);

  return (
    <>
      <div className="flex min-h-0 flex-col">
        <div className={cn(summaryCardHeaderMuted, "space-y-2 border-b px-4 pb-4 pt-4")}>
          <div className="flex items-center gap-2">
            <span className="bg-destructive/10 flex size-9 items-center justify-center rounded-lg border border-destructive/30">
              <MdOutlineWarningAmber className="size-5 text-destructive" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className={summaryKicker}>Системные пробелы</p>
              <p className="font-semibold text-foreground">Слепые зоны параллели</p>
            </div>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Красные узлы по данным Sozley и Qoz — нажмите карточку для сводки; в диалоге доступен фокус
            на графе (демо).
          </p>
        </div>
        <ScrollArea className="h-[240px]">
          <div className="flex flex-col gap-3 p-4 pt-2">
            {items.length === 0 ? (
              <p className="text-muted-foreground text-sm leading-relaxed">
                Критических слепых зон для выбранного среза не обнаружено.
              </p>
            ) : null}
            {items.map((item) => (
              <button
                key={item.nodeId}
                type="button"
                onClick={() => setActive(item)}
                className={cn(
                  "rounded-xl border border-border/60 bg-muted/35 p-3 text-left",
                  "transition-colors hover:bg-muted/50 hover:border-primary/30",
                  "outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <MdOutlineWarningAmber className="text-destructive size-4 shrink-0" aria-hidden />
                  <Badge variant="outline" className="font-normal">
                    {item.subjectLabel}
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    {item.affectedStudents} уч.
                  </Badge>
                </div>
                <p className="mt-2 font-medium leading-snug text-foreground">{item.headline}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-lg rounded-2xl sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>Сводка детекции</DialogTitle>
            <DialogDescription className="text-sm">{active?.headline}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>{active?.detectionSummary}</p>
          </div>
          <DialogFooter className="flex flex-row flex-wrap gap-2 sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setActive(null)}>
              Закрыть
            </Button>
            <Button
              type="button"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                if (active) {
                  onFocusNode(active.nodeId);
                }
                setActive(null);
              }}
              disabled={!active}
            >
              Показать на графе
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
