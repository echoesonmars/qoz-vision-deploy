import { buildExportFileName } from "@/lib/exports/aggregate";
import type {
  ExportFilters,
  ExportGenerateBody,
  RecentExportEntry,
} from "@/lib/exports/export-types";
import { exportTypeLabels } from "@/lib/exports/export-recipients";

const RECENT_KEY = "qv-export-recent";
const RECENT_MAX = 8;

export async function requestExportDownload(
  body: ExportGenerateBody,
): Promise<{ fileName: string }> {
  const res = await fetch("/api/exports/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Не удалось сформировать файл";
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition");
  let fileName = buildExportFileName(body.type, body.format, body);
  const match = disposition?.match(/filename="([^"]+)"/);
  if (match?.[1]) fileName = match[1];

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);

  return { fileName };
}

export function loadRecentExports(): RecentExportEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentExportEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function pushRecentExport(entry: Omit<RecentExportEntry, "id">): RecentExportEntry[] {
  const next: RecentExportEntry = {
    ...entry,
    id: crypto.randomUUID(),
  };
  const list = [next, ...loadRecentExports()].slice(0, RECENT_MAX);
  sessionStorage.setItem(RECENT_KEY, JSON.stringify(list));
  return list;
}

export function formatRecentEntry(
  type: ExportGenerateBody["type"],
  fileName: string,
): Omit<RecentExportEntry, "id"> {
  return {
    type,
    typeLabel: exportTypeLabels[type],
    fileName,
    createdAt: new Date().toISOString(),
  };
}

export type { ExportFilters };
