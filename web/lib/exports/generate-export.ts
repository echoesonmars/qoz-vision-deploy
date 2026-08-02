import { aggregateExportData } from "@/lib/exports/aggregate";
import { buildExcelBuffer } from "@/lib/exports/build-excel";
import { buildMinistryZipBuffer } from "@/lib/exports/build-ministry-zip";
import { buildPdfBuffer } from "@/lib/exports/build-pdf";
import type {
  ExportFileFormat,
  ExportFilters,
  ExportRecipientType,
} from "@/lib/exports/export-types";

export type GeneratedExport = {
  buffer: Buffer;
  contentType: string;
};

export async function generateExportFile(
  type: ExportRecipientType,
  format: ExportFileFormat,
  filters: ExportFilters,
): Promise<GeneratedExport> {
  const bundle = aggregateExportData(type, filters);

  if (type === "ministry" || format === "zip") {
    const buffer = await buildMinistryZipBuffer(bundle);
    return { buffer, contentType: "application/zip" };
  }

  if (format === "xlsx") {
    const buffer = await buildExcelBuffer(bundle);
    return {
      buffer,
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  }

  const buffer = await buildPdfBuffer(bundle);
  return { buffer, contentType: "application/pdf" };
}
