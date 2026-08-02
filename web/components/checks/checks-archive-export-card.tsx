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
import { MdArchive, MdPictureAsPdf } from "react-icons/md";

export function ChecksArchiveExportCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Экспорт</p>
        <CardTitle className="text-lg font-semibold">Массовая выгрузка</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Архив оригиналов и протоколов для комиссий (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0">
        <Button type="button" className="h-auto min-h-11 justify-start gap-3 bg-primary py-3 text-primary-foreground hover:bg-primary/90">
          <MdArchive className="size-5 shrink-0" aria-hidden />
          Скачать ZIP по текущим фильтрам
        </Button>
        <Button type="button" variant="outline" className="h-auto min-h-11 justify-start gap-3 py-3">
          <MdPictureAsPdf className="text-primary size-5 shrink-0" aria-hidden />
          Собрать PDF отчёты по классу
        </Button>
      </CardContent>
    </Card>
  );
}
