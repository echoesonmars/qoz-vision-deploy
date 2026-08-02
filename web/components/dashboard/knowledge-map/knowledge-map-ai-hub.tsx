"use client";

import {
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  summaryCardHeaderMuted,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { knowledgeAiPackages } from "@/lib/data/stubs/dashboard/knowledge-map-mock";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MdPsychology } from "react-icons/md";

export function KnowledgeMapAiHub() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <div className={cn(summaryCardHeaderMuted, "space-y-3 border-b px-4 pb-4 pt-4")}>
        <div className="flex items-start gap-2">
          <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30">
            <MdPsychology className="size-5" aria-hidden />
          </span>
          <div className="space-y-1">
            <p className={summaryKicker}>Центр интервенций</p>
            <CardTitle className="text-lg font-semibold leading-snug">
              ИИ-корректировки
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Автоматический пакет управленческих шагов для красных узлов и заторов.
            </CardDescription>
          </div>
        </div>
        <Button
          type="button"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={open}
          onClick={() => setOpen(true)}
        >
          Сгенерировать корректировку
        </Button>
      </div>
      <div className="flex flex-col gap-3 p-4">
        {!open ? (
          <p className="text-muted-foreground text-xs leading-relaxed">
            Нажмите кнопку, чтобы получить рекомендации Sozley и фокус для следующих уроков (демо).
          </p>
        ) : null}
        {open ? (
          <>
            {knowledgeAiPackages.map((pack) => (
              <div
                key={pack.id}
                className={cn(
                  "rounded-xl border border-border/60 border-l-4 border-l-primary bg-muted/40 p-4",
                  "shadow-sm",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <MdPsychology className="text-primary size-4 shrink-0" aria-hidden />
                  <Badge variant="outline" className="font-normal">
                    ИИ-сценарий
                  </Badge>
                </div>
                <p className="mt-2 font-semibold text-foreground">{pack.title}</p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{pack.body}</p>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}
