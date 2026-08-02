import { getDb } from "@/lib/db";
import type { IncidentCategoryHit, IncidentRow } from "@/lib/incidents-types";

function parseDetectedCategories(raw: unknown): IncidentCategoryHit[] | undefined {
  if (!Array.isArray(raw)) {
    return undefined;
  }
  const out: IncidentCategoryHit[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    if (typeof row.category !== "string") continue;
    if (typeof row.description !== "string") continue;
    const conf = Number(row.confidence);
    if (!Number.isFinite(conf)) continue;
    out.push({
      category: row.category as IncidentCategoryHit["category"],
      confidence: conf,
      description: row.description,
    });
  }
  return out.length > 0 ? out : undefined;
}

function mapIncidentRow(row: IncidentRow): IncidentRow {
  const status = row.analysis_status
    ?? (row.category === "pending" ? "failed" : "completed");
  return {
    ...row,
    analysis_status: status,
    confidence: row.confidence != null ? Number(row.confidence) : null,
    error_message: row.error_message ?? null,
    detected_categories: parseDetectedCategories(
      (row as IncidentRow & { detected_categories?: unknown }).detected_categories,
    ),
  };
}

export async function listIncidents(): Promise<IncidentRow[]> {
  const sql = getDb();
  const rows = await sql<IncidentRow[]>`
    select
      id,
      category,
      analysis_status,
      error_message,
      storage_path,
      title,
      camera_label,
      description,
      confidence,
      detected_categories,
      created_at
    from public.incidents
    order by created_at desc
  `;
  return rows.map(mapIncidentRow);
}

export async function insertIncident(input: {
  category: string;
  storage_path: string;
}): Promise<IncidentRow> {
  const sql = getDb();
  const [row] = await sql<IncidentRow[]>`
    insert into public.incidents (category, storage_path, analysis_status)
    values (${input.category}, ${input.storage_path}, 'processing')
    returning
      id,
      category,
      analysis_status,
      error_message,
      storage_path,
      title,
      camera_label,
      description,
      confidence,
      detected_categories,
      created_at
  `;
  if (!row) {
    throw new Error("insert failed");
  }
  return mapIncidentRow(row);
}

export async function getIncidentStoragePath(
  id: string,
): Promise<string | null> {
  const sql = getDb();
  const [row] = await sql<{ storage_path: string }[]>`
    select storage_path from public.incidents where id = ${id} limit 1
  `;
  return row?.storage_path ?? null;
}

export async function deleteIncident(id: string): Promise<boolean> {
  const sql = getDb();
  const rows = await sql<{ id: string }[]>`
    delete from public.incidents where id = ${id} returning id
  `;
  return rows.length > 0;
}

export async function resetIncidentForRetry(id: string): Promise<boolean> {
  const sql = getDb();
  const rows = await sql<{ id: string }[]>`
    update public.incidents
    set
      analysis_status = 'processing',
      error_message = null
    where id = ${id} and category = 'pending'
    returning id
  `;
  return rows.length > 0;
}
