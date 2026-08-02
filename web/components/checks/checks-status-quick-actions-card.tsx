"use client";

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
import { MdDownloading, MdRefresh, MdTextsms } from "react-icons/md";

export function ChecksStatusQuickActionsCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Операции</p>
        <CardTitle className="text-lg font-semibold">Быстрые действия</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Управление сессией проверки (демо, без API).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0">
        <Button type="button" variant="outline" className="h-auto min-h-11 justify-start gap-3 py-3">
          <MdRefresh className="text-primary size-5 shrink-0" aria-hidden />
          Запустить повторный OCR-анализ сессии
        </Button>
        <Button type="button" variant="outline" className="h-auto min-h-11 justify-start gap-3 py-3">
          <MdTextsms className="text-primary size-5 shrink-0" aria-hidden />
          Отправить push учителю
        </Button>
        <Button type="button" variant="outline" className="h-auto min-h-11 justify-start gap-3 py-3">
          <MdDownloading className="text-primary size-5 shrink-0" aria-hidden />
          Выгрузить промежуточный лог
        </Button>
      </CardContent>
    </Card>
  );
}
