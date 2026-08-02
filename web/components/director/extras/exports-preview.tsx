"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import { DirectorMockFeedback } from "@/components/director/shared/director-mock-feedback";

const TEMPLATES = [
  { id: "rono", label: "Районное управление" },
  { id: "city", label: "Городской отчёт" },
  { id: "quarter", label: "Сводка за четверть" },
] as const;

export function ExportsPreview() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleGenerate(id: string) {
    setGenerating(id);
    setProgress(0);
    setFeedback(null);
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / 28000) * 100));
      setProgress(pct);
      if (elapsed >= 28000) {
        clearInterval(timer);
        setGenerating(null);
        setFeedback("Отчёт сформирован за 28 сек");
      }
    }, 400);
  }

  return (
    <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
      <p className="mb-3 text-sm font-semibold">Шаблоны отчётов УО</p>
      <div className="flex flex-col gap-3">
        {TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="flex flex-col gap-2 rounded-lg bg-card/60 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm">{tpl.label}</span>
            <Button
              type="button"
              size="sm"
              disabled={generating !== null}
              onClick={() => handleGenerate(tpl.id)}
            >
              {generating === tpl.id ? "Формирование…" : "Сформировать"}
            </Button>
          </div>
        ))}
      </div>
      {generating ? (
        <div className="mt-4 space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-muted-foreground text-xs">Цель ≤30 сек</p>
        </div>
      ) : null}
      <DirectorMockFeedback message={feedback} className="mt-4" />
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link href={DIRECTOR_PATHS.exports}>Полный модуль отчётности</Link>
      </Button>
    </div>
  );
}
