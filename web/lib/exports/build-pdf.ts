import { PDFDocument, rgb } from "pdf-lib";
import type { ExportBundle } from "@/lib/exports/export-types";
import { embedCyrillicFonts } from "@/lib/exports/pdf-fonts";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 48;
const LINE = 14;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export async function buildPdfBuffer(bundle: ExportBundle): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const { regular: font, bold: fontBold } = await embedCyrillicFonts(doc);

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const drawLine = (text: string, bold = false) => {
    if (y < MARGIN + LINE) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
    page.drawText(truncate(text, 90), {
      x: MARGIN,
      y,
      size: bold ? 11 : 9,
      font: bold ? fontBold : font,
      color: rgb(0.12, 0.14, 0.18),
    });
    y -= LINE;
  };

  drawLine(bundle.meta.title, true);
  drawLine(`${bundle.meta.schoolLabel} · ${bundle.meta.territoryLabel}`);
  drawLine(`${bundle.meta.yearLabel} · ${bundle.meta.quarterLabel}`);
  drawLine(
    `Сформировано: ${new Date(bundle.meta.generatedAt).toLocaleString("ru-RU")}`,
  );
  y -= 6;

  for (const section of bundle.sections) {
    drawLine(section.title, true);
    drawLine(section.headers.join(" | "));
    for (const row of section.rows) {
      drawLine(row.join(" | "));
    }
    y -= 8;
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

export async function buildMinistryPdfBuffer(
  bundle: ExportBundle,
  sectionId: string,
  docTitle: string,
): Promise<Buffer> {
  const section = bundle.sections.find((s) => s.id === sectionId);
  const slim: ExportBundle = {
    ...bundle,
    meta: { ...bundle.meta, title: docTitle },
    sections: section ? [section] : bundle.sections,
  };
  return buildPdfBuffer(slim);
}
