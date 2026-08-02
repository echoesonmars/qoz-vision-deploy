import type { LessonRow } from "@/lib/lessons-types";
import { format, isSameDay } from "date-fns";

export function filterLessons(
  lessons: LessonRow[],
  opts: { search: string; date?: Date },
): LessonRow[] {
  const q = opts.search.trim().toLowerCase();
  return lessons.filter((row) => {
    if (opts.date) {
      const created = new Date(row.created_at);
      if (!isSameDay(created, opts.date)) return false;
    }
    if (!q) return true;
    const title = row.title?.toLowerCase() ?? "";
    const dateStr = format(new Date(row.created_at), "dd.MM.yyyy");
    return title.includes(q) || dateStr.includes(q) || row.id.includes(q);
  });
}
