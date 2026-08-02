import ExcelJS from "exceljs";
import type { ExportBundle } from "@/lib/exports/export-types";

export async function buildExcelBuffer(bundle: ExportBundle): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Almaty Digital Mektebi";
  workbook.created = new Date(bundle.meta.generatedAt);

  for (const section of bundle.sections) {
    const sheetName = section.title.slice(0, 31);
    const sheet = workbook.addWorksheet(sheetName);
    sheet.views = [{ state: "frozen", ySplit: 4 }];

    sheet.mergeCells(1, 1, 1, section.headers.length);
    const titleCell = sheet.getCell(1, 1);
    titleCell.value = bundle.meta.title;
    titleCell.font = { bold: true, size: 14 };

    sheet.mergeCells(2, 1, 2, section.headers.length);
    sheet.getCell(2, 1).value =
      `${bundle.meta.schoolLabel} · ${bundle.meta.yearLabel} · ${bundle.meta.quarterLabel}`;

    sheet.mergeCells(3, 1, 3, section.headers.length);
    sheet.getCell(3, 1).value = `Сформировано: ${new Date(bundle.meta.generatedAt).toLocaleString("ru-RU")}`;

    const headerRow = sheet.addRow(section.headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE8EEF4" },
    };

    for (const row of section.rows) {
      sheet.addRow(row);
    }

    sheet.columns.forEach((col) => {
      let max = 12;
      col.eachCell?.({ includeEmpty: false }, (cell) => {
        const len = String(cell.value ?? "").length;
        if (len > max) max = len;
      });
      col.width = Math.min(max + 2, 42);
    });
  }

  const raw = await workbook.xlsx.writeBuffer();
  return Buffer.from(raw);
}
