import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth-session";

export async function getSession() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) {
    return null;
  }
  return verifySessionToken(raw);
}
