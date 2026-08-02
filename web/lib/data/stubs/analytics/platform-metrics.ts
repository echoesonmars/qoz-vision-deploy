import type { PlatformMetricsData } from "@/lib/analytics/types";

const dailyRaw: { date: string; videoPathThousands: number; lessons: number }[] = [
  { date: "2026-01-18", videoPathThousands: 0, lessons: 0 },
  { date: "2026-01-19", videoPathThousands: 2, lessons: 3 },
  { date: "2026-01-20", videoPathThousands: 8, lessons: 6 },
  { date: "2026-01-21", videoPathThousands: 45, lessons: 15 },
  { date: "2026-01-22", videoPathThousands: 52, lessons: 12 },
  { date: "2026-01-23", videoPathThousands: 38, lessons: 10 },
  { date: "2026-01-24", videoPathThousands: 12, lessons: 4 },
  { date: "2026-01-25", videoPathThousands: 5, lessons: 2 },
  { date: "2026-01-26", videoPathThousands: 28, lessons: 8 },
  { date: "2026-01-27", videoPathThousands: 55, lessons: 11 },
  { date: "2026-01-28", videoPathThousands: 62, lessons: 13 },
  { date: "2026-01-29", videoPathThousands: 48, lessons: 9 },
  { date: "2026-01-30", videoPathThousands: 35, lessons: 7 },
  { date: "2026-01-31", videoPathThousands: 18, lessons: 5 },
  { date: "2026-02-01", videoPathThousands: 72, lessons: 15 },
  { date: "2026-02-02", videoPathThousands: 68, lessons: 12 },
  { date: "2026-02-03", videoPathThousands: 55, lessons: 10 },
  { date: "2026-02-04", videoPathThousands: 42, lessons: 8 },
  { date: "2026-02-05", videoPathThousands: 58, lessons: 11 },
  { date: "2026-02-06", videoPathThousands: 88, lessons: 13 },
  { date: "2026-02-07", videoPathThousands: 116, lessons: 12 },
  { date: "2026-02-08", videoPathThousands: 140, lessons: 14 },
  { date: "2026-02-09", videoPathThousands: 95, lessons: 11 },
  { date: "2026-02-10", videoPathThousands: 78, lessons: 10 },
  { date: "2026-02-11", videoPathThousands: 65, lessons: 9 },
  { date: "2026-02-12", videoPathThousands: 52, lessons: 8 },
  { date: "2026-02-13", videoPathThousands: 48, lessons: 7 },
  { date: "2026-02-14", videoPathThousands: 22, lessons: 4 },
  { date: "2026-02-15", videoPathThousands: 82, lessons: 14 },
  { date: "2026-02-16", videoPathThousands: 70, lessons: 12 },
  { date: "2026-02-17", videoPathThousands: 58, lessons: 10 },
  { date: "2026-02-18", videoPathThousands: 45, lessons: 8 },
  { date: "2026-02-19", videoPathThousands: 38, lessons: 7 },
  { date: "2026-02-20", videoPathThousands: 32, lessons: 6 },
  { date: "2026-02-21", videoPathThousands: 28, lessons: 5 },
  { date: "2026-02-22", videoPathThousands: 35, lessons: 8 },
];

function formatLabel(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export const platformMetricsData: PlatformMetricsData = {
  daily: dailyRaw.map((row) => ({
    ...row,
    label: formatLabel(row.date),
  })),
  totalVideoPaths: 1_020_000,
  totalLessons: 287,
};
