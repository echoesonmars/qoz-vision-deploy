"use client";

import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { analyticsRepo } from "@/lib/data";
import { admFocusRingClass } from "@/lib/brand/ui-classes";
import { cn } from "@/lib/utils";

export function AnalyticsPreviewStrip() {
  const { navigate } = useAppNavigation();
  const kpi = analyticsRepo.getDataset().kpi;

  const items = [
    {
      label: "Уроков снято",
      value: String(kpi.totalLessons),
      section: "platform" as const,
    },
    {
      label: "Video path",
      value: `${(kpi.totalVideoPaths / 1_000_000).toFixed(2)} млн`,
      section: "platform" as const,
    },
    {
      label: "Smart Class",
      value: `+${kpi.smartClassGrowthPercent}%`,
      section: "smart-class" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() =>
            navigate({ to: "dashboard", tab: "analytics", section: item.section })
          }
          className={cn(
            "text-left transition-shadow",
            "rounded-2xl focus-visible:outline-none",
            admFocusRingClass,
          )}
        >
          <DirectorKpiTile
            label={item.label}
            value={item.value}
            context="Открыть аналитику →"
            status="ok"
          />
        </button>
      ))}
    </div>
  );
}
