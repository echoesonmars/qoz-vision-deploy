"use client";

import type { ReactNode } from "react";
import { DirectorCountPercentValue } from "@/components/director/shared/director-count-percent-value";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { useAnalyticsFilters } from "@/components/analytics/analytics-filters-provider";
import type { AnalyticsSection } from "@/lib/analytics/types";
import { admFocusRingClass } from "@/lib/brand/ui-classes";
import { cn } from "@/lib/utils";

type KpiItem = {
  key: string;
  label: string;
  value: ReactNode;
  context?: string;
  section: AnalyticsSection;
  status?: "ok" | "warning" | "critical";
};

export function AnalyticsKpiHub() {
  const { dataset, setSection } = useAnalyticsFilters();
  const { kpi } = dataset;

  const items: KpiItem[] = [
    {
      key: "students",
      label: "Учеников в школе",
      value: kpi.totalStudents.toLocaleString("ru-RU"),
      context: "ОШ №147",
      section: "performance",
      status: "ok",
    },
    {
      key: "lessons",
      label: "Уроков снято",
      value: String(kpi.totalLessons),
      context: "За период пилота",
      section: "platform",
      status: "ok",
    },
    {
      key: "video",
      label: "Video path",
      value: `${(kpi.totalVideoPaths / 1_000_000).toFixed(2)} млн`,
      context: "Обработано кадров",
      section: "platform",
    },
    {
      key: "incidents",
      label: "Инцидентов",
      value: String(kpi.totalIncidents),
      context: "Анти-буллинг система",
      section: "safety",
      status: "warning",
    },
    {
      key: "smart-class",
      label: "Smart Class",
      value: `+${kpi.smartClassGrowthPercent}%`,
      context: "Рост по волнам",
      section: "smart-class",
      status: "ok",
    },
    {
      key: "analyzed",
      label: "На уроке",
      value: (
        <DirectorCountPercentValue
          count={kpi.analyzedStudents}
          total={kpi.totalStudents}
        />
      ),
      context: "Учеников в анализе",
      section: "lesson",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.key}
          role="button"
          tabIndex={0}
          onClick={() => setSection(item.section)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSection(item.section);
            }
          }}
          className={cn(
            "cursor-pointer text-left transition-shadow",
            "rounded-2xl focus-visible:outline-none",
            admFocusRingClass,
          )}
        >
          <DirectorKpiTile
            label={item.label}
            value={item.value}
            context={item.context}
            status={item.status}
          />
        </div>
      ))}
    </div>
  );
}
