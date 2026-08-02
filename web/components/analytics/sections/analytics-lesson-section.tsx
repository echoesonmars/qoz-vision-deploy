"use client";

import { AnalyticsSectionAccordion } from "@/components/analytics/analytics-section-accordion";
import { AnalyticsChartCard } from "@/components/analytics/charts/analytics-chart-card";
import { AnalyticsDonutChart } from "@/components/analytics/charts/analytics-donut-chart";
import { AnalyticsHorizontalBarChart } from "@/components/analytics/charts/analytics-horizontal-bar-chart";
import {
  AnalyticsActionsLineChart,
  AnalyticsEmotionsLineChart,
} from "@/components/analytics/charts/analytics-multi-line-chart";
import { AnalyticsStackedHbar100Chart } from "@/components/analytics/charts/analytics-stacked-hbar-100-chart";
import { AnalyticsStackedVerticalBarChart } from "@/components/analytics/charts/analytics-stacked-vertical-bar-chart";
import { useAnalyticsFilters } from "@/components/analytics/analytics-filters-provider";
import { actionChartConfig, emotionChartConfig } from "@/lib/analytics/chart-config";
import { useDirectorRole } from "@/lib/director/role-context";
import { getDefaultLessonView, getDefaultOpenSections } from "@/lib/analytics/role-presets";
import type { AnalyticsLessonView } from "@/lib/analytics/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnalyticsEmptyState } from "@/components/analytics/analytics-empty-state";
import { useMemo } from "react";

const EMOTION_DAY_KEYS = [
  { key: "calm", label: "Спокойный" },
  { key: "focused", label: "Сосредоточенный" },
  { key: "anxious", label: "Тревожный" },
  { key: "sad", label: "Грустный" },
  { key: "happy", label: "Радостный" },
];

export function AnalyticsLessonSection() {
  const { dataset, filters, setFilter, section, resetFilters } = useAnalyticsFilters();
  const { role } = useDirectorRole();
  const defaultOpen =
    section === "lesson" || getDefaultOpenSections(role).includes("lesson");
  const view: AnalyticsLessonView = filters.view ?? getDefaultLessonView(role);

  const actionRows = useMemo(() => {
    if (!filters.studentId) return dataset.actions.byStudent;
    return dataset.actions.byStudent.filter((r) => r.studentId === filters.studentId);
  }, [dataset.actions.byStudent, filters.studentId]);

  const emotionRows = useMemo(() => {
    if (!filters.studentId) return dataset.emotions.byStudent;
    return dataset.emotions.byStudent.filter((r) => r.studentId === filters.studentId);
  }, [dataset.emotions.byStudent, filters.studentId]);

  return (
    <AnalyticsSectionAccordion
      sectionId="lesson"
      title="Анализ урока"
      description={`Каб. ${filters.room ?? "422"} · урок ${filters.lesson ?? "6"} · класс ${filters.classId ?? "8b"}`}
      defaultOpen={defaultOpen}
    >
      <Tabs
        value={view}
        onValueChange={(v) => setFilter("view", v as AnalyticsLessonView)}
        className="flex flex-col gap-6"
      >
        <TabsList>
          <TabsTrigger value="actions">Действия</TabsTrigger>
          <TabsTrigger value="emotions">Эмоции</TabsTrigger>
        </TabsList>
        <TabsContent value="actions" className="mt-0 flex flex-col gap-4">
          {actionRows.length === 0 ? (
            <AnalyticsEmptyState
              title="Нет данных по выбранному ученику"
              description="Измените фильтр ученика или сбросьте параметры урока."
              onReset={resetFilters}
            />
          ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AnalyticsChartCard
              title="Динамика действий"
              description="Логарифмическая шкала, 0–40 мин"
            >
              <AnalyticsActionsLineChart data={dataset.actions.timeline} logScale />
            </AnalyticsChartCard>
            <AnalyticsChartCard title="Доля действий (donut)">
              <AnalyticsDonutChart
                data={dataset.actions.donut}
                config={actionChartConfig}
              />
            </AnalyticsChartCard>
            <AnalyticsChartCard
              title="По ученикам"
              description="Клик по строке — профиль ученика"
              className="lg:col-span-2"
            >
              <AnalyticsStackedHbar100Chart mode="actions" rows={actionRows} />
            </AnalyticsChartCard>
            <AnalyticsChartCard title="По длительности (тыс. фреймов)" className="lg:col-span-2">
              <AnalyticsHorizontalBarChart data={dataset.actions.byDuration} />
            </AnalyticsChartCard>
          </div>
          )}
        </TabsContent>
        <TabsContent value="emotions" className="mt-0 flex flex-col gap-4">
          {emotionRows.length === 0 ? (
            <AnalyticsEmptyState
              title="Нет эмоциональных данных"
              description="Для выбранного ученика нет записей. Попробуйте другой фильтр."
              onReset={resetFilters}
            />
          ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AnalyticsChartCard title="Эмоции по ученикам" className="lg:col-span-2">
              <AnalyticsStackedHbar100Chart mode="emotions" rows={emotionRows} />
            </AnalyticsChartCard>
            <AnalyticsChartCard title="Динамика эмоций по уроку">
              <AnalyticsEmotionsLineChart data={dataset.emotions.timeline} />
            </AnalyticsChartCard>
            <AnalyticsChartCard title="Преобладающая эмоция">
              <AnalyticsDonutChart
                data={dataset.emotions.donut}
                config={emotionChartConfig}
              />
            </AnalyticsChartCard>
            <AnalyticsChartCard title="По длительности">
              <AnalyticsHorizontalBarChart data={dataset.emotions.byDuration} />
            </AnalyticsChartCard>
            <AnalyticsChartCard title="Средняя продолжительность по дням">
              <AnalyticsStackedVerticalBarChart
                data={dataset.emotions.byDay}
                stackKeys={EMOTION_DAY_KEYS}
                xKey="label"
              />
            </AnalyticsChartCard>
            <AnalyticsChartCard title="Сводная таблица">
              <div className="overflow-x-auto rounded-xl ring-1 ring-border/60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Кабинет</TableHead>
                      <TableHead className="text-right">Спок.</TableHead>
                      <TableHead className="text-right">Соср.</TableHead>
                      <TableHead className="text-right">Трев.</TableHead>
                      <TableHead className="text-right">Груст.</TableHead>
                      <TableHead className="text-right">Рад.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataset.emotions.summaryTable.map((row) => (
                      <TableRow key={row.room}>
                        <TableCell className="font-medium">{row.room}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.calm}%</TableCell>
                        <TableCell className="text-right tabular-nums">{row.focused}%</TableCell>
                        <TableCell className="text-right tabular-nums">{row.anxious}%</TableCell>
                        <TableCell className="text-right tabular-nums">{row.sad}%</TableCell>
                        <TableCell className="text-right tabular-nums">{row.happy}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AnalyticsChartCard>
          </div>
          )}
        </TabsContent>
      </Tabs>
    </AnalyticsSectionAccordion>
  );
}
