import postgres from "postgres";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sqlPath = path.join(root, "db", "live-monitor-extended-migration.sql");
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL required");
  process.exit(1);
}
const sql = postgres(url);
const body = readFileSync(sqlPath, "utf8");
await sql.unsafe(body);
await sql.end();
console.log("live-monitor-extended migration applied");
