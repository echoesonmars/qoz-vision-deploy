"use client";

import type { LiveAnalysisPayload } from "@/lib/cameras/live-analysis-types";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import type { IconType } from "react-icons";
import { MdGroups, MdHotel, MdPhoneIphone, MdTrendingUp } from "react-icons/md";
import { cn } from "@/lib/utils";

type LiveAnalysisSummaryProps = {
  payload: LiveAnalysisPayload | null;
  loading: boolean;
};

type SummaryItem = {
  label: string;
  value: string;
  icon: IconType;
};

export function LiveAnalysisSummary({ payload, loading }: LiveAnalysisSummaryProps) {
  if (loading && !payload) {
    return <AdmLoadingScreen variant="inline" message="Загрузка аналитики…" />;
  }
  if (!payload) {
    return (
      <p className="text-muted-foreground text-sm">
        Нет снимков анализа. Запустите отслеживание.
      </p>
    );
  }

  const { analytics_meta, classroom_visual_behavior } = payload;
  const items: SummaryItem[] = [
    {
      label: "Вовлечённость",
      value: `${Math.round(analytics_meta.overall_engagement_score)}%`,
      icon: MdTrendingUp,
    },
    {
      label: "Учеников в кадре",
      value: String(classroom_visual_behavior.students_count_detected),
      icon: MdGroups,
    },
    {
      label: "Телефоны",
      value: String(classroom_visual_behavior.active_phone_users),
      icon: MdPhoneIphone,
    },
    {
      label: "Сон",
      value: String(classroom_visual_behavior.sleeping_count),
      icon: MdHotel,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(
                "group/card relative rounded-xl border border-border/70 bg-card p-4 shadow-sm ring-1 ring-border/40",
                "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 hover:ring-primary/25",
              )}
            >
              <span
                className={cn(
                  "absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20",
                  "opacity-0 transition-all duration-200 group-hover/card:scale-105 group-hover/card:opacity-100",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground pr-10">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-primary">{item.value}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Фокус класса
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          {classroom_visual_behavior.general_focus_description}
        </p>
      </div>
    </div>
  );
}
