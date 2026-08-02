"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { aggregateExportData, getExportKpi } from "@/lib/exports/aggregate";
import {
  formatRecentEntry,
  pushRecentExport,
  requestExportDownload,
} from "@/lib/exports/export-client";
import type { ExportRecipientConfig } from "@/lib/exports/export-recipients";
import type {
  ExportFileFormat,
  ExportFilters,
  RecentExportEntry,
} from "@/lib/exports/export-types";
import { cn } from "@/lib/utils";
import { MdCheckCircle, MdDownload } from "react-icons/md";

const STEPS = ["Сбор данных", "Формирование файла", "Готово к скачиванию"] as const;

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

type ExportGenerateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: ExportRecipientConfig | null;
  filters: ExportFilters;
  onRecentUpdate: (items: RecentExportEntry[]) => void;
};

export function ExportGenerateDialog({
  open,
  onOpenChange,
  config,
  filters,
  onRecentUpdate,
}: ExportGenerateDialogProps) {
  const [format, setFormat] = useState<ExportFileFormat>("xlsx");
  const [stepIndex, setStepIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (config && open) {
      setFormat(config.defaultFormat);
      setStepIndex(0);
      setRunning(false);
      setDone(false);
      setError(null);
      setFileName(null);
    }
  }, [config, open]);

  const kpi = config
    ? getExportKpi(aggregateExportData(config.id, filters))
    : null;

  const runExport = useCallback(async () => {
    if (!config) return;
    setRunning(true);
    setError(null);
    setDone(false);
    setStepIndex(0);

    try {
      await delay(500);
      setStepIndex(1);
      await delay(500);

      const result = await requestExportDownload({
        type: config.id,
        format,
        ...filters,
      });

      setStepIndex(2);
      setFileName(result.fileName);
      setDone(true);
      const recent = pushRecentExport(formatRecentEntry(config.id, result.fileName));
      onRecentUpdate(recent);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка выгрузки");
      setStepIndex(0);
    } finally {
      setRunning(false);
    }
  }, [config, format, filters, onRecentUpdate]);

  const progressValue = done ? 100 : running ? (stepIndex + 1) * 33 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!running}>
        <DialogHeader>
          <DialogTitle>{config?.title ?? "Выгрузка"}</DialogTitle>
          <DialogDescription>
            {config?.desc ?? "Формирование отчёта по текущим фильтрам."}
          </DialogDescription>
        </DialogHeader>

        {config && config.formats.length > 1 ? (
          <div className="grid gap-2">
            <Label htmlFor="export-format">Формат</Label>
            <Select
              value={format}
              onValueChange={(v) => setFormat(v as ExportFileFormat)}
              disabled={running}
            >
              <SelectTrigger id="export-format" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.formats.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f === "xlsx" ? "Excel (.xlsx)" : "PDF (.pdf)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Формат: ZIP-пакет (2 PDF)</p>
        )}

        {kpi ? (
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-3 ring-1 ring-border/40">
            <div>
              <p className="text-muted-foreground text-xs">Посещаемость</p>
              <p className="text-lg font-semibold tabular-nums">{kpi.attendancePercent}%</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Вовлечённость</p>
              <p className="text-lg font-semibold tabular-nums">{kpi.engagementIndex}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">В выборке</p>
              <p className="text-lg font-semibold tabular-nums">{kpi.classCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Строк в отчёте</p>
              <p className="text-lg font-semibold tabular-nums">{kpi.rowCount}</p>
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {running || done ? STEPS[Math.min(stepIndex, 2)] : "Ожидание"}
            </span>
            <span className="font-medium tabular-nums">{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
          <ul className="space-y-1">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className={cn(
                  "flex items-center gap-2 text-xs",
                  i <= stepIndex ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {done && i === 2 ? (
                  <MdCheckCircle className="text-primary size-3.5 shrink-0" aria-hidden />
                ) : (
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      i <= stepIndex ? "bg-primary" : "bg-muted-foreground/40",
                    )}
                  />
                )}
                {label}
              </li>
            ))}
          </ul>
        </div>

        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        {done && fileName ? (
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <MdDownload className="text-primary size-4 shrink-0" aria-hidden />
            <span className="truncate">{fileName}</span>
          </p>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={running}
            onClick={() => onOpenChange(false)}
          >
            {done ? "Закрыть" : "Отмена"}
          </Button>
          {!done ? (
            <Button type="button" disabled={running || !config} onClick={() => void runExport()}>
              {running ? "Формирование…" : "Скачать"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
