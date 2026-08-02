import postgres from "postgres";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ids = [
  "2ab8558a-b566-4b8e-b8a9-193809ad5eab",
  "d6d3a319-552d-4dc9-a4c4-2b2c4518a9b0",
  "ae845a14-5bb5-4730-ab68-f9dd960ff263",
];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, "..", "qoz-vision-prod-web", ".env.local"), "utf8");
const url = envText.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) throw new Error("DATABASE_URL missing");

const sql = postgres(url, { max: 1, ssl: "require", prepare: false });

const rows = await sql`
  select id, storage_path, category, created_at
  from public.incidents
  where id = any(${ids}::uuid[])
     or storage_path like any(${ids.map((id) => `%${id}%`)}::text[])
  order by created_at desc
`;

const total = await sql`select count(*)::int as n from public.incidents`;
const recent = await sql`
  select id, storage_path, category, created_at
  from public.incidents
  order by created_at desc
  limit 10
`;

console.log(JSON.stringify({ matches: rows, total: total[0].n, recent }, null, 2));
await sql.end();
