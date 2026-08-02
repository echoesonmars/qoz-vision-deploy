"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  summaryCardHeaderMuted,
  summaryCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { ExportGenerateDialog } from "@/components/dashboard/exports/export-generate-dialog";
import { ExportPreviewTable } from "@/components/dashboard/exports/export-preview-table";
import { ExportRecentList } from "@/components/dashboard/exports/export-recent-list";
import { ExportRecipientCard } from "@/components/dashboard/exports/export-recipient-card";
import {
  aggregateExportData,
  defaultParallel,
  getExportKpi,
} from "@/lib/exports/aggregate";
import { loadRecentExports } from "@/lib/exports/export-client";
import {
  exportParallels,
  exportQuarters,
  exportTerritories,
  exportYears,
} from "@/lib/data/stubs/exports/export-options-mock";
import {
  exportRecipientConfigs,
  type ExportRecipientConfig,
} from "@/lib/exports/export-recipients";
import type {
  ExportFilters,
  ExportRecipientType,
  RecentExportEntry,
} from "@/lib/exports/export-types";
import { cn } from "@/lib/utils";

function KpiTile({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl bg-muted/35 p-3 ring-1 ring-border/45 transition-colors hover:bg-muted/50">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
        {value}
        {suffix ? (
          <span className="text-muted-foreground ml-0.5 text-sm font-normal">{suffix}</span>
        ) : null}
      </p>
    </div>
  );
}

export function ExportsHub() {
  const [filters, setFilters] = useState<ExportFilters>(() => ({
    year: exportYears[0]?.value ?? "2025-2026",
    quarter: exportQuarters[2]?.value ?? "q3",
    territoryId: exportTerritories[0]?.value ?? "astana",
    parallel: defaultParallel(),
  }));
  const [previewType, setPreviewType] = useState<ExportRecipientType>("rono");
  const [dialogConfig, setDialogConfig] = useState<ExportRecipientConfig | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recent, setRecent] = useState<RecentExportEntry[]>([]);

  useEffect(() => {
    setRecent(loadRecentExports());
  }, []);

  const previewBundle = useMemo(
    () => aggregateExportData(previewType, filters),
    [previewType, filters],
  );
  const kpi = useMemo(() => getExportKpi(previewBundle), [previewBundle]);

  const patchFilters = (patch: Partial<ExportFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const openGenerate = (config: ExportRecipientConfig) => {
    setPreviewType(config.id);
    setDialogConfig(config);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Посещаемость" value={kpi.attendancePercent} suffix="%" />
        <KpiTile label="Вовлечённость" value={kpi.engagementIndex} suffix="%" />
        <KpiTile label="Классов / школ" value={kpi.classCount} />
        <KpiTile label="Строк в отчёте" value={kpi.rowCount} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,300px)_1fr]">
        <Card className={cn(summaryCardInteractive, "h-fit")}>
          <CardHeader className={summaryCardHeaderMuted}>
            <p className={summaryKicker}>Фильтры</p>
            <CardTitle className="text-lg font-semibold">Параметры выгрузки</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Период и территория влияют на заголовки и демо-вариацию цифр.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-2">
            <div className="grid gap-2">
              <Label htmlFor="export-year">Учебный год</Label>
              <Select
                value={filters.year}
                onValueChange={(v) => patchFilters({ year: v })}
              >
                <SelectTrigger id="export-year" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportYears.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="export-quarter">Четверть</Label>
              <Select
                value={filters.quarter}
                onValueChange={(v) => patchFilters({ quarter: v })}
              >
                <SelectTrigger id="export-quarter" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportQuarters.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="export-territory">Территория</Label>
              <Select
                value={filters.territoryId}
                onValueChange={(v) => patchFilters({ territoryId: v })}
              >
                <SelectTrigger id="export-territory" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportTerritories.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="export-parallel">Параллель (Sozley)</Label>
              <Select
                value={filters.parallel}
                onValueChange={(v) => patchFilters({ parallel: v })}
              >
                <SelectTrigger id="export-parallel" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportParallels.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="export-preview-type">Превью для</Label>
              <Select
                value={previewType}
                onValueChange={(v) => setPreviewType(v as ExportRecipientType)}
              >
                <SelectTrigger id="export-preview-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportRecipientConfigs.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className={summaryCardInteractive}>
            <CardHeader className="border-b border-border/60 bg-muted/30">
              <p className={summaryKicker}>Получатели</p>
              <CardTitle className="text-xl font-semibold">Выгрузка документов</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-relaxed">
                Официальные PDF и Excel для Министерства, РОНО и головного офиса НИШ на основе
                сводки видеоаналитики / Sozley.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
              {exportRecipientConfigs.map((config) => (
                <ExportRecipientCard
                  key={config.id}
                  config={config}
                  onGenerate={() => openGenerate(config)}
                />
              ))}
            </CardContent>
          </Card>

          <ExportRecentList items={recent} />
        </div>
      </div>

      <ExportPreviewTable previewType={previewType} filters={filters} />

      <ExportGenerateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        config={dialogConfig}
        filters={filters}
        onRecentUpdate={setRecent}
      />
    </>
  );
}
