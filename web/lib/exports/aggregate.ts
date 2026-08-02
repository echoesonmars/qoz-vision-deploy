import {
  classLedgerRows,
  classPerformanceRows,
} from "@/lib/data/stubs/people/classes-mock";
import {
  attendancePercent,
  engagementByLesson,
  engagementIndex,
  getSozleyBars,
  SOZLEY_PARALLELS,
  type SozleyParallelKey,
} from "@/lib/data/stubs/dashboard/summary-mock";
import {
  forecastSubjectLabels,
  forecastSubjectKeys,
  readinessMatrixRows,
  type ReadinessLevel,
} from "@/lib/data/stubs/dashboard/forecasts-mock";
import {
  exportSchoolNodes,
  labelForParallel,
  labelForQuarter,
  labelForTerritory,
  labelForYear,
} from "@/lib/data/stubs/exports/export-options-mock";
import type {
  ExportBundle,
  ExportFilters,
  ExportKpi,
  ExportPreviewRow,
  ExportRecipientType,
  ExportTableSection,
} from "@/lib/exports/export-types";

function readinessLabel(level: ReadinessLevel): string {
  if (level === "stable") return "Стабильно";
  if (level === "risk") return "Риск";
  return "Критично";
}

function filterShift(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h + seed.charCodeAt(i)) % 3;
  }
  return h - 1;
}

function adjustAbsent(base: number, filters: ExportFilters): number {
  const shift = filterShift(`${filters.year}-${filters.quarter}-${filters.territoryId}`);
  return Math.max(0, base + shift);
}

function buildRonoSections(filters: ExportFilters): ExportTableSection[] {
  const parallel = filters.parallel as SozleyParallelKey;
  const bars = getSozleyBars("math", parallel);
  const attendanceRows = classPerformanceRows.map((row) => [
    row.classLabel,
    row.avgScore.toFixed(1),
    row.blindSpot ?? "—",
    `${(attendancePercent + filterShift(row.id + filters.quarter) * 0.3).toFixed(1)}%`,
  ]);

  const ledgerRows = classLedgerRows.map((row) => [
    row.student,
    row.quarterGrade,
    String(adjustAbsent(row.absentDays, filters)),
    String(row.lateCount),
  ]);

  const sozleyRows = bars.map((b) => [b.grade, String(b.count)]);

  return [
    {
      id: "attendance",
      title: "Посещаемость по классам",
      headers: ["Класс", "Средний балл", "Слепая зона", "Посещаемость"],
      rows: attendanceRows,
    },
    {
      id: "ledger",
      title: "Журнал",
      headers: ["Ученик", "Четвертная", "Пропуски", "Опоздания"],
      rows: ledgerRows,
    },
    {
      id: "sozley",
      title: `Срез Sozley (${labelForParallel(filters.parallel)})`,
      headers: ["Оценка", "Кол-во работ"],
      rows: sozleyRows,
    },
  ];
}

function buildNisSections(filters: ExportFilters): ExportTableSection[] {
  const schoolRows = exportSchoolNodes.map((s) => [
    s.name,
    s.city,
    String(s.students),
    `${(s.attendancePercent + filterShift(s.id + filters.year) * 0.2).toFixed(1)}%`,
    s.avgGpa.toFixed(2),
  ]);

  const matrixRows = readinessMatrixRows.map((row) => {
    const cells = forecastSubjectKeys.map(
      (key) => `${forecastSubjectLabels[key]}: ${readinessLabel(row.cells[key])}`,
    );
    return [row.className, ...cells];
  });

  const engagementRows = engagementByLesson.map((row) => [
    `Урок ${row.lesson}`,
    `${row.focus}%`,
  ]);

  return [
    {
      id: "network",
      title: "Сеть школ НИШ",
      headers: ["Школа", "Город", "Ученики", "Посещаемость", "Ср. GPA"],
      rows: schoolRows,
    },
    {
      id: "readiness",
      title: "Матрица готовности",
      headers: ["Класс", ...forecastSubjectKeys.map((k) => forecastSubjectLabels[k])],
      rows: matrixRows.map((r) => [r[0], r[1], r[2], r[3], r[4]]),
    },
    {
      id: "engagement",
      title: "Вовлечённость по урокам",
      headers: ["Урок", "Фокус, %"],
      rows: engagementRows,
    },
  ];
}

function buildMinistrySections(filters: ExportFilters): ExportTableSection[] {
  const parallel = filters.parallel as SozleyParallelKey;
  const bars = getSozleyBars("math", parallel);
  const attendanceRows = classPerformanceRows.map((row) => [
    row.classLabel,
    `${(attendancePercent + filterShift(row.id)).toFixed(1)}%`,
    row.avgScore.toFixed(1),
  ]);

  const sozleyRows = bars.map((b) => [b.grade, String(b.count)]);

  return [
    {
      id: "attendance-summary",
      title: "Сводка посещаемости",
      headers: ["Класс", "Посещаемость", "Средний балл"],
      rows: attendanceRows,
    },
    {
      id: "sozley-summary",
      title: "Сводка Sozley",
      headers: ["Оценка", "Работ"],
      rows: sozleyRows,
    },
  ];
}

function countRows(sections: ExportTableSection[]): number {
  return sections.reduce((sum, s) => sum + s.rows.length, 0);
}

function classCountForType(type: ExportRecipientType): number {
  if (type === "nis") return exportSchoolNodes.length;
  return classPerformanceRows.length;
}

const titles: Record<ExportRecipientType, string> = {
  ministry: "Пакет для Министерства образования",
  rono: "Региональная выгрузка РОНО",
  nis: "Сводный отчёт головного офиса НИШ",
};

export function aggregateExportData(
  type: ExportRecipientType,
  filters: ExportFilters,
): ExportBundle {
  const sections =
    type === "rono"
      ? buildRonoSections(filters)
      : type === "nis"
        ? buildNisSections(filters)
        : buildMinistrySections(filters);

  const territoryLabel = labelForTerritory(filters.territoryId);
  const schoolLabel =
    type === "nis"
      ? "Сеть НИШ (3 филиала)"
      : `НИШ ФМН — ${territoryLabel.split(",")[0] ?? territoryLabel}`;

  return {
    type,
    meta: {
      title: titles[type],
      schoolLabel,
      territoryLabel,
      yearLabel: labelForYear(filters.year),
      quarterLabel: labelForQuarter(filters.quarter),
      generatedAt: new Date().toISOString(),
      attendancePercent:
        Math.round((attendancePercent + filterShift(filters.territoryId) * 0.4) * 10) /
        10,
      engagementIndex: engagementIndex + filterShift(filters.quarter),
      classCount: classCountForType(type),
      rowCount: countRows(sections),
    },
    sections,
  };
}

export function getExportKpi(bundle: ExportBundle): ExportKpi {
  return {
    attendancePercent: bundle.meta.attendancePercent,
    engagementIndex: bundle.meta.engagementIndex,
    classCount: bundle.meta.classCount,
    rowCount: bundle.meta.rowCount,
  };
}

export function getPreviewRows(
  type: ExportRecipientType,
  filters: ExportFilters,
): ExportPreviewRow[] {
  const bundle = aggregateExportData(type, filters);
  const section = bundle.sections[0];
  if (!section) return [];

  return section.rows.slice(0, 5).map((row) => ({
    col1: row[0] ?? "—",
    col2: row[1] ?? "—",
    col3: row[2] ?? row[3] ?? "—",
  }));
}

export function previewHeaders(
  type: ExportRecipientType,
  filters: ExportFilters,
): [string, string, string] {
  const section = aggregateExportData(type, filters).sections[0];
  const h = section?.headers ?? ["—", "—", "—"];
  return [h[0] ?? "—", h[1] ?? "—", h[2] ?? h[3] ?? "—"];
}

export function defaultParallel(): string {
  return SOZLEY_PARALLELS[2]?.value ?? "10";
}

export function buildExportFileName(
  type: ExportRecipientType,
  format: "xlsx" | "pdf" | "zip",
  filters: ExportFilters,
): string {
  const stamp = new Date().toISOString().slice(0, 10);
  const base = `qoz-export-${type}-${filters.quarter}-${stamp}`;
  if (format === "xlsx") return `${base}.xlsx`;
  if (format === "pdf") return `${base}.pdf`;
  return `${base}.zip`;
}
