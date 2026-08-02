"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checksCardHeader, checksCardInteractive, summaryKicker } from "@/components/dashboard/summary-card-shell";
import { cn } from "@/lib/utils";

function pickMock() {
  const attention = 70 + Math.round(Math.sin(Date.now() / 8000) * 15);
  const fatigue = Math.max(0, 100 - attention - 8 + Math.round(Math.random() * 6));
  return { attention, fatigue };
}

export function MetricsConsole() {
  const [a, setA] = useState(85);
  const [f, setF] = useState(15);

  useEffect(() => {
    const t = setInterval(() => {
      const { attention, fatigue } = pickMock();
      setA(attention);
      setF(fatigue);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <Card className={cn(checksCardInteractive, "h-full")}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>ИИ</p>
        <CardTitle className="text-lg font-semibold">Консоль метрик</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Обновление каждые 3 с (мок для питча).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Внимание</p>
          <p className="text-primary text-2xl font-semibold tabular-nums">{a}%</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Усталость</p>
          <p className="text-foreground text-2xl font-semibold tabular-nums">{f}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
