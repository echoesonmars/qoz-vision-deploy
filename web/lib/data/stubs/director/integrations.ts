import type { IntegrationMeta } from "@/lib/director/types";

export const mockIntegrationMeta: IntegrationMeta[] = [
  {
    source: "journal",
    label: "Электронный журнал",
    mock: true,
    refreshLabel: "Real-time + ночная синхронизация",
  },
  {
    source: "casper",
    label: "CASPER / Qoz",
    mock: true,
    refreshLabel: "Real-time",
  },
  {
    source: "skud",
    label: "СКУД",
    mock: true,
    refreshLabel: "Real-time",
  },
  {
    source: "goso",
    label: "БД ГОСО",
    mock: true,
    refreshLabel: "Раз в неделю",
  },
  {
    source: "nct",
    label: "НЦТ",
    mock: true,
    refreshLabel: "Раз в неделю",
  },
  {
    source: "pk",
    label: "Система ПК",
    mock: true,
    refreshLabel: "Раз в день",
  },
  {
    source: "qoz_vision",
    label: "ADM",
    mock: false,
    refreshLabel: "Real-time",
  },
];
