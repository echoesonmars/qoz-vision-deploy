import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "qv_session";

function secretKey() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    return null;
  }
  return new TextEncoder().encode(s);
}

export async function signSession(payload: { sub: string; email: string }) {
  const key = secretKey();
  if (!key) {
    throw new Error("AUTH_SECRET must be set and at least 32 characters");
  }
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifySessionToken(token: string) {
  const key = secretKey();
  if (!key) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, key);
    const sub = payload.sub;
    const email = payload.email;
    if (typeof sub !== "string" || typeof email !== "string") {
      return null;
    }
    return { sub, email };
  } catch {
    return null;
  }
}

function sessionCookieSecure() {
  return process.env.SESSION_COOKIE_SECURE === "true";
}

export const sessionCookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
  secure: sessionCookieSecure(),
};
