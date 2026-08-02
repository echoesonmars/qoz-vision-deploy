import { admIncidentPreviewToneClass } from "@/lib/brand/ui-classes";
import type { IncidentCategory } from "@/lib/incidents-types";

export type IncidentCategoryMeta = {
  id: Exclude<IncidentCategory, "pending">;
  label: string;
  badgeClassName: string;
  previewTone: string;
};

export const INCIDENT_CATEGORY_REGISTRY: IncidentCategoryMeta[] = [
  {
    id: "fight",
    label: "Драка",
    badgeClassName: "border-none bg-orange-500/10 text-orange-600 dark:text-orange-400",
    previewTone: "from-orange-950/80 via-orange-900/40 to-muted",
  },
  {
    id: "weapon",
    label: "Оружие",
    badgeClassName: "border-none bg-red-500/10 text-red-600 dark:text-red-400",
    previewTone: "from-red-950/80 via-red-900/40 to-muted",
  },
  {
    id: "fall",
    label: "Падение",
    badgeClassName: "border-none bg-rose-500/10 text-rose-600 dark:text-rose-400",
    previewTone: "from-rose-950/70 via-rose-900/35 to-muted",
  },
  {
    id: "smoking",
    label: "Курение",
    badgeClassName: "border-none bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    previewTone: "from-yellow-950/80 via-yellow-900/30 to-muted",
  },
  {
    id: "phone_usage",
    label: "Телефон",
    badgeClassName: "border-none bg-violet-500/10 text-violet-600 dark:text-violet-400",
    previewTone: "from-violet-950/70 via-violet-900/35 to-muted",
  },
  {
    id: "sleep",
    label: "Сон",
    badgeClassName: "border-none bg-slate-500/10 text-slate-600 dark:text-slate-300",
    previewTone: admIncidentPreviewToneClass,
  },
  {
    id: "lost_property",
    label: "Забытые вещи",
    badgeClassName: "border-none bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
    previewTone: "from-cyan-950/60 via-cyan-900/30 to-muted",
  },
  {
    id: "crowd",
    label: "Сбор людей",
    badgeClassName: "border-none bg-blue-500/10 text-blue-600 dark:text-blue-400",
    previewTone: "from-blue-950/70 via-blue-900/35 to-muted",
  },
  {
    id: "wanted_person",
    label: "Разыскиваемые",
    badgeClassName: "border-none bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
    previewTone: "from-fuchsia-950/70 via-fuchsia-900/35 to-muted",
  },
  {
    id: "fence_climbing",
    label: "Перелезание",
    badgeClassName: "border-none bg-amber-500/10 text-amber-700 dark:text-amber-400",
    previewTone: "from-amber-950/70 via-amber-900/35 to-muted",
  },
  {
    id: "anpr",
    label: "ГРНЗ",
    badgeClassName: "border-none bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    previewTone: "from-emerald-950/60 via-emerald-900/30 to-muted",
  },
  {
    id: "fire",
    label: "Огонь",
    badgeClassName: "border-none bg-red-600/15 text-red-700 dark:text-red-400",
    previewTone: "from-red-950/90 via-red-800/50 to-muted",
  },
  {
    id: "smoke",
    label: "Дым",
    badgeClassName: "border-none bg-stone-500/10 text-stone-700 dark:text-stone-300",
    previewTone: "from-stone-800/80 via-stone-700/40 to-muted",
  },
];

const REGISTRY_BY_ID = new Map(
  INCIDENT_CATEGORY_REGISTRY.map((item) => [item.id, item]),
);

const LEGACY_CATEGORY_LABELS: Record<string, string> = {
  intruder: "Посторонний",
};

export function getIncidentCategoryMeta(
  category: IncidentCategory,
): IncidentCategoryMeta | null {
  if (category === "pending") return null;
  return REGISTRY_BY_ID.get(category) ?? null;
}

export function incidentCategoryLabel(category: IncidentCategory): string {
  if (category === "pending") return "Анализ…";
  const meta = REGISTRY_BY_ID.get(category);
  if (meta) return meta.label;
  return LEGACY_CATEGORY_LABELS[category] ?? category;
}
