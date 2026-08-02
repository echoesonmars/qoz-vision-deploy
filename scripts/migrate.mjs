import { createRequire } from "node:module";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dbDir = process.env.QOZ_DB_DIR?.trim() || join(here, "..", "web", "db");
const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const ordered = [
  "schema.sql",
  "incidents.sql",
  "incidents-migration.sql",
  "incidents-categories-migration.sql",
  "incidents-detected-categories.sql",
  "incidents-analysis-status.sql",
  "live-monitor.sql",
  "lesson-analyses.sql",
  "lesson-analyses-processing.sql",
  "live-monitor-extended-migration.sql",
  "cameras.sql",
];

async function loadPostgres() {
  const candidates = [
    process.env.QOZ_NODE_MODULES,
    "/app/node_modules",
    join(here, "..", "backend", "node_modules"),
    join(here, "..", "node_modules"),
  ].filter((v) => typeof v === "string" && v.length > 0);

  for (const root of candidates) {
    const pkgJson = join(root, "package.json");
    if (existsSync(pkgJson)) {
      try {
        const require = createRequire(pkgJson);
        return require("postgres");
      } catch {
      }
    }
    const esmEntry = join(root, "postgres", "src", "index.js");
    if (existsSync(esmEntry)) {
      const mod = await import(pathToFileURL(esmEntry).href);
      return mod.default;
    }
  }
  throw new Error(
    "Cannot find package 'postgres'. Set QOZ_NODE_MODULES=/app/node_modules",
  );
}

const postgres = await loadPostgres();

const sql = postgres(url, {
  max: 1,
  prepare: false,
  ssl: url.includes("supabase") ? "require" : undefined,
});

const available = new Set(readdirSync(dbDir));

try {
  for (const name of ordered) {
    if (!available.has(name)) {
      console.warn("skip missing", name);
      continue;
    }
    const body = readFileSync(join(dbDir, name), "utf8");
    await sql.unsafe(body);
    console.log("applied", name);
  }
  console.log("migrations complete");
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
} finally {
  await sql.end();
}
