import type { HierarchySchoolType } from "@/lib/hierarchy/types";

export const SCHOOL_TYPE_LABELS: Record<HierarchySchoolType, string> = {
  osh: "ОШ",
  gymnasium: "Гимназия",
  lyceum: "Лицей",
};

export function getSchoolTypeLabel(type: HierarchySchoolType): string {
  return SCHOOL_TYPE_LABELS[type];
}
