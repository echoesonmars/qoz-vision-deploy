import postgres from "postgres";

let sql: ReturnType<typeof postgres> | null = null;

function connectionOptions(url: string) {
  const isSupabase =
    url.includes("supabase.co") || url.includes("pooler.supabase.com");
  return {
    max: 1,
    prepare: false,
    connect_timeout: 15,
    idle_timeout: 20,
    ...(isSupabase ? { ssl: "require" as const } : {}),
  };
}

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
  if (!sql) {
    sql = postgres(url, connectionOptions(url));
  }
  return sql;
}
