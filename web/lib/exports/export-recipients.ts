import type { ExportFileFormat, ExportRecipientType } from "@/lib/exports/export-types";
import type { LucideIcon } from "lucide-react";
import { Building2, FileDown, FileSpreadsheet } from "lucide-react";

export type ExportRecipientConfig = {
  id: ExportRecipientType;
  title: string;
  formatLabel: string;
  desc: string;
  bullets: string[];
  icon: LucideIcon;
  badges: string[];
  formats: ExportFileFormat[];
  defaultFormat: ExportFileFormat;
};

export const exportRecipientConfigs: ExportRecipientConfig[] = [
  {
    id: "ministry",
    title: "Министерство образования",
    formatLabel: "PDF / пакет документов",
    desc: "Официальные формы и сводки для государственной отчётности.",
    bullets: [
      "Сводка посещаемости по классам",
      "Сводка Sozley по выбранной параллели",
      "ZIP с двумя PDF-документами",
    ],
    icon: FileDown,
    badges: ["ZIP", "PDF"],
    formats: ["zip"],
    defaultFormat: "zip",
  },
  {
    id: "rono",
    title: "РОНО и территориальные органы",
    formatLabel: "Excel, PDF",
    desc: "Региональные выгрузки посещаемости и контрольные срезы.",
    bullets: [
      "Лист «Посещаемость по классам»",
      "Лист «Журнал» (пропуски, опоздания)",
      "Лист «Срез Sozley»",
    ],
    icon: FileSpreadsheet,
    badges: ["Excel", "PDF"],
    formats: ["xlsx", "pdf"],
    defaultFormat: "xlsx",
  },
  {
    id: "nis",
    title: "Головной офис НИШ",
    formatLabel: "PDF / Excel",
    desc: "Сводные отчёты для сети школ и центрального аппарата.",
    bullets: [
      "Сеть из 3 филиалов НИШ",
      "Матрица готовности по предметам",
      "Вовлечённость по урокам (Qoz)",
    ],
    icon: Building2,
    badges: ["Excel", "PDF"],
    formats: ["xlsx", "pdf"],
    defaultFormat: "xlsx",
  },
];

export const exportTypeLabels: Record<ExportRecipientType, string> = {
  ministry: "Министерство",
  rono: "РОНО",
  nis: "НИШ",
};
