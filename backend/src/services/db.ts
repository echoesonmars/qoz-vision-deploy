import postgres from "postgres";
import { getEnv } from "../config/env.js";

let sql: ReturnType<typeof postgres> | null = null;

function assertPostgresUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(
      "DATABASE_URL is not a valid URL — use postgresql://user:pass@host:5432/db on the backend service",
    );
  }
  if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
    throw new Error(
      `DATABASE_URL must use postgres:// or postgresql:// (got ${parsed.protocol})`,
    );
  }
}

export function getDb() {
  if (!sql) {
    const url = getEnv().DATABASE_URL;
    assertPostgresUrl(url);
    const isSupabase =
      url.includes("supabase.co") || url.includes("pooler.supabase.com");
    sql = postgres(url, {
      max: 4,
      prepare: false,
      connect_timeout: 15,
      idle_timeout: 20,
      ...(isSupabase ? { ssl: "require" as const } : {}),
    });
  }
  return sql;
}

export async function checkDatabase(): Promise<{ ok: boolean; detail: string }> {
  try {
    assertPostgresUrl(getEnv().DATABASE_URL);
    const db = getDb();
    await db`select 1 as ok`;
    return { ok: true, detail: "postgres reachable" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "database error";
    const code =
      e && typeof e === "object" && "code" in e && typeof e.code === "string"
        ? e.code
        : null;
    if (code === "ERR_INVALID_URL") {
      return {
        ok: false,
        detail:
          "DATABASE_URL is invalid on this service — copy the Supabase connection string from the frontend Railway variables",
      };
    }
    return { ok: false, detail: msg };
  }
}
