import postgres from "postgres";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) throw new Error("no DATABASE_URL");
const sql = postgres(url, { max: 1, prepare: false, ssl: "require" });

const all = await sql`
  select
    id,
    title,
    status,
    created_at,
    source_live_session_id is not null as has_live_link,
    (analysis is not null) as has_lesson_analysis,
    (title ilike 'Live ·%') as is_live_archive_title
  from public.lesson_analyses
  order by created_at desc
`;

const withLessonAnalysis = all.filter((r) => r.has_lesson_analysis);
const liveArchives = all.filter((r) => r.is_live_archive_title);
const liveWithLessonAnalysis = liveArchives.filter((r) => r.has_lesson_analysis);
const liveWithoutLessonAnalysis = liveArchives.filter((r) => !r.has_lesson_analysis);

console.log(
  JSON.stringify(
    {
      totalLessons: all.length,
      withLessonAnalysisJson: withLessonAnalysis.length,
      liveArchiveTitles: liveArchives.length,
      liveArchiveWithLessonAnalysis: liveWithLessonAnalysis.length,
      liveArchiveWithoutLessonAnalysis: liveWithoutLessonAnalysis.length,
      liveSnapshotsInDb: (await sql`select count(*)::int as n from public.live_analysis_snapshots`)[0].n,
      examplesWithAnalysis: withLessonAnalysis.slice(0, 8).map((r) => ({
        id: r.id,
        title: r.title,
        isLiveArchiveTitle: r.is_live_archive_title,
        hasLiveLink: r.has_live_link,
      })),
      userExamples: all
        .filter((r) =>
          ["7a593312-8490-4000-bc7c-ebbd0831baa8", "25bfae6d-fb2b-485f-8b1d-1beb168333e0"].includes(r.id),
        )
        .map((r) => r),
    },
    null,
    2,
  ),
);

await sql.end();
