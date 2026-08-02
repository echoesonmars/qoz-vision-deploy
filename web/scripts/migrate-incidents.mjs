import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = postgres(url, {
  max: 1,
  prepare: false,
  ssl: url.includes("supabase") ? "require" : undefined,
});

const schema = readFileSync(join(root, "db", "incidents.sql"), "utf8");

try {
  await sql.unsafe(schema);
  console.log("public.incidents is ready");
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
} finally {
  await sql.end();
}
