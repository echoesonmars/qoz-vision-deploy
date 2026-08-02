import fontkit from "@pdf-lib/fontkit";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import type { PDFDocument, PDFFont } from "pdf-lib";

const NOTO_REGULAR = "NotoSans-Regular.ttf";
const NOTO_BOLD = "NotoSans-Bold.ttf";

let regularBytes: Uint8Array | null = null;
let boldBytes: Uint8Array | null = null;

function fontDirectories(): string[] {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  return [
    path.join(process.cwd(), "lib", "exports", "fonts"),
    path.join(process.cwd(), "public", "fonts"),
    path.join(moduleDir, "fonts"),
  ];
}

function findFontPath(fileName: string): string | null {
  for (const dir of fontDirectories()) {
    const filePath = path.join(dir, fileName);
    if (existsSync(filePath)) return filePath;
  }
  return null;
}

async function readNotoFont(fileName: string): Promise<Uint8Array> {
  const filePath = findFontPath(fileName);
  if (!filePath) {
    throw new Error(
      `Не найден ${fileName}. Выполните: npm run fonts:export`,
    );
  }
  const buffer = await readFile(filePath);
  return new Uint8Array(buffer);
}

async function loadNotoPair(): Promise<{ regular: Uint8Array; bold: Uint8Array }> {
  const regularPath = findFontPath(NOTO_REGULAR);
  const boldPath = findFontPath(NOTO_BOLD);
  if (!regularPath || !boldPath) {
    throw new Error(
      "Не найдены Noto Sans (Regular/Bold). Выполните: npm run fonts:export",
    );
  }
  return {
    regular: await readNotoFont(NOTO_REGULAR),
    bold: await readNotoFont(NOTO_BOLD),
  };
}

export async function embedCyrillicFonts(
  doc: PDFDocument,
): Promise<{ regular: PDFFont; bold: PDFFont }> {
  doc.registerFontkit(fontkit);
  if (!regularBytes || !boldBytes) {
    const pair = await loadNotoPair();
    regularBytes = pair.regular;
    boldBytes = pair.bold;
  }
  const regular = await doc.embedFont(regularBytes);
  const bold = await doc.embedFont(boldBytes);
  return { regular, bold };
}
