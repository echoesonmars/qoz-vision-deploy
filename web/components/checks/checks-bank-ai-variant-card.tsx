"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { aiVariantShufflePool } from "@/lib/data/stubs/checks/bank-mock";
import { MdAutoAwesome } from "react-icons/md";

export function ChecksBankAiVariantCard() {
  const [pick, setPick] = useState(0);
  const text = aiVariantShufflePool[pick] ?? aiVariantShufflePool[0];

  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Генерация</p>
        <CardTitle className="text-lg font-semibold">Рабочая область варианта</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Черновик условия и перефразирование под контроль рубрики (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        <div className="min-h-[8rem] rounded-xl border border-border/60 bg-muted/20 p-4">
          <p className="text-sm leading-relaxed text-foreground">{text}</p>
        </div>
        <Button
          type="button"
          className="h-auto min-h-10 gap-2 bg-primary py-2.5 text-primary-foreground hover:bg-primary/90"
          onClick={() => setPick((i) => (i + 1) % aiVariantShufflePool.length)}
        >
          <MdAutoAwesome className="size-5 shrink-0" aria-hidden />
          Сгенерировать новый черновик
        </Button>
      </CardContent>
    </Card>
  );
}
