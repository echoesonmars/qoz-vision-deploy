"use client";

import type { LessonOverview } from "@/lib/lessons-types";

type LessonOverviewCardsProps = {
  overview: LessonOverview;
};

export function LessonOverviewCards({ overview }: LessonOverviewCardsProps) {
  const items = [
    {
      label: "Вовлечённость",
      value: `${Math.round(overview.overall_engagement_score)}%`,
    },
    { label: "Длительность", value: overview.duration },
    {
      label: "Педагогический стиль",
      value: overview.pedagogical_style,
      multiline: true,
    },
    {
      label: "Синхронизация речи и слайдов",
      value: overview.presentation_sync,
      multiline: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border/70 bg-card p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <p
            className={
              item.multiline
                ? "mt-2 text-sm leading-relaxed text-foreground"
                : "mt-2 text-2xl font-semibold tabular-nums text-foreground"
            }
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
