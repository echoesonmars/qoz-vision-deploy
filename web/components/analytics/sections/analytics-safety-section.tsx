"use client";

import { AnalyticsSectionAccordion } from "@/components/analytics/analytics-section-accordion";
import { AnalyticsChartCard } from "@/components/analytics/charts/analytics-chart-card";
import { AnalyticsDonutChart } from "@/components/analytics/charts/analytics-donut-chart";
import { AnalyticsFloorPlanHeatmap } from "@/components/analytics/charts/analytics-floor-plan-heatmap";
import { AnalyticsIncidentsMatrixTable } from "@/components/analytics/charts/analytics-incidents-matrix-table";
import { AnalyticsStackedHorizontalBarChart } from "@/components/analytics/charts/analytics-stacked-horizontal-bar-chart";
import { AnalyticsStackedVerticalBarChart } from "@/components/analytics/charts/analytics-stacked-vertical-bar-chart";
import { AnalyticsTreemapChart } from "@/components/analytics/charts/analytics-treemap-chart";
import { useAnalyticsFilters } from "@/components/analytics/analytics-filters-provider";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useDirectorRole } from "@/lib/director/role-context";
import { getDefaultOpenSections } from "@/lib/analytics/role-presets";
import { MdExpandMore, MdVideocam } from "react-icons/md";
import { useState } from "react";
import { cn } from "@/lib/utils";

const INCIDENT_STACK_KEYS = [
  { key: "playing", label: "Playing" },
  { key: "normal", label: "Normal" },
  { key: "fight-3", label: "Fight-3" },
  { key: "bullying-3", label: "Bullying-3" },
];

export function AnalyticsSafetySection() {
  const { dataset, filters, setFilter, section } = useAnalyticsFilters();
  const { role } = useDirectorRole();
  const { navigate } = useAppNavigation();
  const [treemapOpen, setTreemapOpen] = useState(false);
  const defaultOpen =
    section === "safety" || getDefaultOpenSections(role).includes("safety");
  const { safety } = dataset;

  return (
    <AnalyticsSectionAccordion
      sectionId="safety"
      title="Анти-буллинг и безопасность"
      description="Инциденты по дням, типам и локациям школы"
      defaultOpen={defaultOpen}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "cameras", tab: "incidents", from: "analytics-safety" })}
          >
            <MdVideocam className="mr-1 size-4" aria-hidden />
            Журнал инцидентов
          </Button>
        </div>
        <AnalyticsChartCard
          title="Инциденты по дням"
          description="Янв 19 — март 1"
        >
          <AnalyticsStackedVerticalBarChart
            data={safety.byDay}
            stackKeys={INCIDENT_STACK_KEYS}
          />
        </AnalyticsChartCard>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AnalyticsChartCard title="Типы инцидентов">
            <AnalyticsDonutChart data={safety.byType} />
          </AnalyticsChartCard>
          <AnalyticsChartCard title="По локациям">
            <AnalyticsDonutChart data={safety.byLocation} />
          </AnalyticsChartCard>
        </div>
        <AnalyticsChartCard
          title="План этажей — горячие зоны"
          description="Нажмите зону для фильтра матрицы"
        >
          <AnalyticsFloorPlanHeatmap
            locations={safety.locations}
            selectedLocationId={filters.location}
            onSelectLocation={(id) => {
              setFilter("location", id);
              document.getElementById("safety-matrix")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </AnalyticsChartCard>
        <AnalyticsChartCard title="Среднее по локациям × классификация">
          <AnalyticsStackedHorizontalBarChart locations={safety.locations} />
        </AnalyticsChartCard>
        <Collapsible open={treemapOpen} onOpenChange={setTreemapOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-fit gap-1">
              Подробнее: Treemap видеозаписей
              <MdExpandMore
                className={cn("size-5 transition-transform", treemapOpen && "rotate-180")}
                aria-hidden
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <AnalyticsChartCard title="Видеозаписи по локациям">
              <AnalyticsTreemapChart locations={safety.locations} />
            </AnalyticsChartCard>
          </CollapsibleContent>
        </Collapsible>
        <div id="safety-matrix">
          <AnalyticsChartCard title="Матрица: локация × тип инцидента">
            <AnalyticsIncidentsMatrixTable
              data={safety}
              locationFilter={filters.location}
            />
          </AnalyticsChartCard>
        </div>
      </div>
    </AnalyticsSectionAccordion>
  );
}
