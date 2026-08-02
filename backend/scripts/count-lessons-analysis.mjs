import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const url = envText.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) throw new Error("DATABASE_URL missing");
const sql = postgres(url, { max: 1, prepare: false, ssl: "require" });

const rows = await sql`
  select
    id,
    title,
    status,
    analysis is not null as has_analysis,
    error_message,
    created_at
  from public.lesson_analyses
  order by created_at desc
`;

const missing = rows.filter((r) => !r.has_analysis);
const withAnalysis = rows.filter((r) => r.has_analysis);
const withError = rows.filter((r) => r.error_message && !r.has_analysis);

console.log(
  JSON.stringify(
    {
      total: rows.length,
      withAnalysis: withAnalysis.length,
      missingAnalysis: missing.length,
      missingWithError: withError.length,
      missing: missing.map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        error: r.error_message,
      })),
    },
    null,
    2,
  ),
);
await sql.end();
