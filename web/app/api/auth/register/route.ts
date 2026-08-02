import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  sessionCookieBase,
  signSession,
} from "@/lib/auth-session";
import { jsonFromCaughtError } from "@/lib/api-db-error";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let email = "";
  let password = "";
  try {
    const body: unknown = await req.json();
    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      "password" in body
    ) {
      email =
        typeof (body as { email: unknown }).email === "string"
          ? (body as { email: string }).email.trim().toLowerCase()
          : "";
      password =
        typeof (body as { password: unknown }).password === "string"
          ? (body as { password: string }).password
          : "";
    }
  } catch {
    return NextResponse.json({ error: "Неверный запрос" }, { status: 400 });
  }
  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Нужны почта и пароль не короче 8 символов" },
      { status: 400 },
    );
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const sql = getDb();
    const inserted = await sql<{ id: string; email: string }[]>`
      insert into public.app_users (email, password_hash)
      values (${email}, ${hash})
      returning id, email
    `;
    const row = inserted[0];
    if (!row) {
      return NextResponse.json(
        { error: "Не удалось создать пользователя" },
        { status: 500 },
      );
    }
    const token = await signSession({ sub: row.id, email: row.email });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieBase);
    return res;
  } catch (e: unknown) {
    return jsonFromCaughtError(e, "auth/register");
  }
}
