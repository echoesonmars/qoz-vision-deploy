import { getDb } from "@/lib/db";
import type { LessonAnalysisReport, LessonRow } from "@/lib/lessons-types";
import { isLessonAnalysisReport } from "@/lib/lessons-types";

async function repairLiveArchiveLessonsInDb(): Promise<void> {
  const sql = getDb();
  await sql`
    update public.lesson_analyses
    set status = 'ready', error_message = null
    where source_live_session_id is not null
      and (status = 'failed' or error_message is not null)
  `;
}

function mapRow(row: LessonRow): LessonRow {
  let analysis: LessonAnalysisReport | null = null;
  if (row.analysis != null) {
    if (isLessonAnalysisReport(row.analysis)) {
      analysis = row.analysis;
    } else if (typeof row.analysis === "string") {
      try {
        const parsed = JSON.parse(row.analysis) as unknown;
        if (isLessonAnalysisReport(parsed)) analysis = parsed;
      } catch {
        analysis = null;
      }
    }
  }
  return {
    ...row,
    analysis,
    source_live_session_id: row.source_live_session_id ?? null,
    source_live_device_id: row.source_live_device_id ?? null,
  };
}

export async function listLessons(): Promise<LessonRow[]> {
  await repairLiveArchiveLessonsInDb();
  const sql = getDb();
  const rows = await sql<LessonRow[]>`
    select
      l.id,
      l.status,
      l.storage_path,
      l.title,
      l.detected_language,
      l.analysis,
      l.error_message,
      l.created_at,
      l.source_live_session_id,
      s.device_id as source_live_device_id
    from public.lesson_analyses l
    left join public.live_monitor_sessions s on s.id = l.source_live_session_id
    order by l.created_at desc
  `;
  return rows.map((row) => mapRow(row));
}

export async function getLessonById(id: string): Promise<LessonRow | null> {
  await repairLiveArchiveLessonsInDb();
  const sql = getDb();
  const [row] = await sql<LessonRow[]>`
    select
      l.id,
      l.status,
      l.storage_path,
      l.title,
      l.detected_language,
      l.analysis,
      l.error_message,
      l.created_at,
      l.source_live_session_id,
      s.device_id as source_live_device_id
    from public.lesson_analyses l
    left join public.live_monitor_sessions s on s.id = l.source_live_session_id
    where l.id = ${id}
    limit 1
  `;
  if (!row) return null;
  return mapRow(row);
}

export async function insertLesson(input: {
  storage_path: string;
  title?: string | null;
}): Promise<LessonRow> {
  const sql = getDb();
  const [row] = await sql<LessonRow[]>`
    insert into public.lesson_analyses (status, storage_path, title)
    values ('pending', ${input.storage_path}, ${input.title ?? null})
    returning
      id,
      status,
      storage_path,
      title,
      detected_language,
      analysis,
      error_message,
      created_at,
      source_live_session_id
  `;
  if (!row) {
    throw new Error("insert failed");
  }
  return mapRow({ ...row, source_live_device_id: null });
}

export async function getLessonStoragePath(id: string): Promise<string | null> {
  const sql = getDb();
  const [row] = await sql<{ storage_path: string }[]>`
    select storage_path from public.lesson_analyses where id = ${id} limit 1
  `;
  return row?.storage_path ?? null;
}

export async function resetLessonForRetry(id: string): Promise<void> {
  const sql = getDb();
  await sql`
    update public.lesson_analyses
    set status = 'pending', error_message = null
    where id = ${id}
  `;
}
