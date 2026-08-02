"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  summaryCardHeaderMuted,
  summaryCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { earlyWarningStudents } from "@/lib/data/stubs/dashboard/forecasts-mock";
import { cn } from "@/lib/utils";
import { MdNotificationsActive, MdSmartToy } from "react-icons/md";

export function ForecastEarlyWarning() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = earlyWarningStudents.find((s) => s.id === activeId);

  return (
    <>
      <Card className={summaryCardInteractive}>
        <CardHeader className={cn(summaryCardHeaderMuted, "space-y-2")}>
          <div className="flex items-start gap-3">
            <span className="bg-destructive/10 text-destructive flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-destructive/20">
              <MdNotificationsActive className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <p className={summaryKicker}>Раннее предупреждение</p>
              <CardTitle className="text-lg font-semibold">
                Группа риска (ранжирование ИИ)
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Ученики, требующие внимания администрации и кураторов. Нажмите карточку для
                обоснования прогноза.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {earlyWarningStudents.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActiveId(s.id);
                setOpen(true);
              }}
              className={cn(
                "rounded-xl border border-border/60 bg-card/80 p-4 text-left ring-1 ring-border/40",
                "transition-all duration-200 hover:border-primary/30 hover:bg-muted/40 hover:ring-primary/20",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium leading-snug">{s.name}</span>
                <Badge variant="destructive" className="shrink-0 tabular-nums">
                  #{s.threatRank}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">{s.className}</p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{s.teaser}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setActiveId(null);
        }}
      >
        <DialogContent className="max-w-lg sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <MdSmartToy className="text-primary size-5" aria-hidden />
              <DialogTitle>{active?.name}</DialogTitle>
            </div>
            <DialogDescription>{active?.className}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 border-t border-border/50 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Обоснование прогноза
            </p>
            <p className="text-foreground text-sm leading-relaxed">{active?.reasoning}</p>
          </div>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Закрыть
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
