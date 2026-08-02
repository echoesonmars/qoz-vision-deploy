import { getSession } from "@/lib/auth-session.server";
import { buildExportFileName } from "@/lib/exports/aggregate";
import type {
  ExportFileFormat,
  ExportGenerateBody,
  ExportRecipientType,
} from "@/lib/exports/export-types";
import { generateExportFile } from "@/lib/exports/generate-export";
import { NextResponse } from "next/server";

const TYPES: ExportRecipientType[] = ["ministry", "rono", "nis"];
const FORMATS: ExportFileFormat[] = ["xlsx", "pdf", "zip"];

function isValidBody(body: unknown): body is ExportGenerateBody {
  if (!body || typeof body !== "object") return false;
  const b = body as ExportGenerateBody;
  return (
    TYPES.includes(b.type) &&
    FORMATS.includes(b.format) &&
    typeof b.year === "string" &&
    typeof b.quarter === "string" &&
    typeof b.territoryId === "string" &&
    typeof b.parallel === "string"
  );
}

function resolveFormat(
  type: ExportRecipientType,
  format: ExportFileFormat,
): ExportFileFormat {
  if (type === "ministry") return "zip";
  if (type === "rono" || type === "nis") {
    return format === "pdf" ? "pdf" : "xlsx";
  }
  return format;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidBody(body)) {
    return NextResponse.json({ error: "Invalid export request" }, { status: 400 });
  }

  const format = resolveFormat(body.type, body.format);
  const filters = {
    year: body.year,
    quarter: body.quarter,
    territoryId: body.territoryId,
    parallel: body.parallel,
  };

  try {
    const { buffer, contentType } = await generateExportFile(
      body.type,
      format,
      filters,
    );
    const fileName = buildExportFileName(body.type, format, filters);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Export failed";
    if (process.env.NODE_ENV === "development") {
      console.error("[exports/generate]", e);
    }
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
