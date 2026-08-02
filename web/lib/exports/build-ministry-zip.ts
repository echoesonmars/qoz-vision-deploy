import JSZip from "jszip";
import type { ExportBundle } from "@/lib/exports/export-types";
import { buildMinistryPdfBuffer } from "@/lib/exports/build-pdf";

export async function buildMinistryZipBuffer(bundle: ExportBundle): Promise<Buffer> {
  const zip = new JSZip();
  const attendancePdf = await buildMinistryPdfBuffer(
    bundle,
    "attendance-summary",
    "Сводка посещаемости",
  );
  const sozleyPdf = await buildMinistryPdfBuffer(
    bundle,
    "sozley-summary",
    "Сводка Sozley",
  );

  zip.file("svodka-poseshchaemosti.pdf", attendancePdf);
  zip.file("sozley-svodka.pdf", sozleyPdf);

  const raw = await zip.generateAsync({ type: "nodebuffer" });
  return Buffer.from(raw);
}
