"use client";

import { useState } from "react";
import { AnalyticsSectionAccordion } from "@/components/analytics/analytics-section-accordion";
import { AnalyticsGroupedBarChart } from "@/components/analytics/charts/analytics-grouped-bar-chart";
import { useAnalyticsFilters } from "@/components/analytics/analytics-filters-provider";
import { useDirectorRole } from "@/lib/director/role-context";
import { admStatusSuccessTextClass } from "@/lib/brand/ui-classes";
import { getDefaultOpenSections } from "@/lib/analytics/role-presets";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type WaveMode = "wave1" | "wave4" | "wave8" | "all";

export function AnalyticsSmartClassSection() {
  const { dataset, section } = useAnalyticsFilters();
  const { role } = useDirectorRole();
  const [waveMode, setWaveMode] = useState<WaveMode>("all");
  const defaultOpen =
    section === "smart-class" || getDefaultOpenSections(role).includes("smart-class");

  return (
    <AnalyticsSectionAccordion
      sectionId="smart-class"
      title="Речевая аналитика Smart Class"
      description="9 педагогических критериев по 8 волнам наблюдения"
      defaultOpen={defaultOpen}
    >
      <div className="flex flex-col gap-6">
        <Tabs
          value={waveMode}
          onValueChange={(v) => setWaveMode(v as WaveMode)}
          className="w-fit"
        >
          <TabsList>
            <TabsTrigger value="all">Все волны</TabsTrigger>
            <TabsTrigger value="wave1">Wave 1</TabsTrigger>
            <TabsTrigger value="wave4">Wave 4</TabsTrigger>
            <TabsTrigger value="wave8">Wave 8</TabsTrigger>
          </TabsList>
        </Tabs>
        <AnalyticsGroupedBarChart data={dataset.smartClass} waveMode={waveMode} />
        <div className="overflow-x-auto rounded-xl ring-1 ring-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Критерий</TableHead>
                <TableHead className="text-right">Wave 1</TableHead>
                <TableHead className="text-right">Wave 8</TableHead>
                <TableHead className="text-right">Δ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataset.smartClass.criteria.map((c) => {
                const delta = c.waves[7] - c.waves[0];
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.label}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {c.waves[0].toFixed(2)}%
                    </TableCell>
                    <TableCell className={cn("text-right tabular-nums", admStatusSuccessTextClass)}>
                      {c.waves[7].toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {delta >= 0 ? "+" : ""}
                      {delta.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AnalyticsSectionAccordion>
  );
}
