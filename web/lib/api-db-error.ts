import { NextResponse } from "next/server";

export function jsonFromCaughtError(e: unknown, context: string) {
  console.error(`[api ${context}]`, e);
  const msg = e instanceof Error ? e.message : String(e);
  const code =
    e && typeof e === "object" && "code" in e
      ? String((e as { code: unknown }).code)
      : "";

  if (code === "23505") {
    return NextResponse.json(
      { error: "Этот email уже зарегистрирован" },
      { status: 409 },
    );
  }

  const isConn =
    /timeout|ETIMEDOUT|ECONNREFUSED|ENOTFOUND|getaddrinfo|ConnectTimeout|closed the connection/i.test(
      msg,
    ) ||
    ["ETIMEDOUT", "ECONNREFUSED", "ENOTFOUND"].includes(
      e && typeof e === "object" && e !== null && "code" in e
        ? String((e as { code: unknown }).code)
        : "",
    );

  const body: Record<string, string> = {
    error: isConn
      ? "Нет связи с базой. В Supabase: Database → Connection string → скопируйте URI для Session pooler или Transaction pooler (IPv4) и подставьте в DATABASE_URL."
      : "Ошибка сервера",
  };
  if (process.env.NODE_ENV === "development") {
    body.detail = msg;
  }
  return NextResponse.json(body, { status: isConn ? 503 : 500 });
}
