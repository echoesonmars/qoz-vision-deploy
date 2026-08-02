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
  if (!email || !password) {
    return NextResponse.json(
      { error: "Укажите почту и пароль" },
      { status: 400 },
    );
  }

  try {
    const sql = getDb();
    const rows = await sql<
      { id: string; email: string; password_hash: string }[]
    >`select id, email, password_hash from public.app_users where lower(email) = ${email} limit 1`;

    const row = rows[0];
    if (!row) {
      return NextResponse.json(
        { error: "Неверная почта или пароль" },
        { status: 401 },
      );
    }

    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) {
      return NextResponse.json(
        { error: "Неверная почта или пароль" },
        { status: 401 },
      );
    }

    const token = await signSession({ sub: row.id, email: row.email });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieBase);
    return res;
  } catch (e: unknown) {
    return jsonFromCaughtError(e, "auth/login");
  }
}
