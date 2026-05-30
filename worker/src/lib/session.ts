import type { Env, SessionUser } from "../types";
import { parseCookies, serializeCookie, clearCookie } from "./cookies";
import { signToken, verifyToken } from "./crypto";

const SESSION_COOKIE = "adx_session";
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days

export async function readSession(req: Request, env: Env): Promise<SessionUser | null> {
  const token = parseCookies(req.headers.get("Cookie"))[SESSION_COOKIE];
  if (!token) return null;
  const payload = await verifyToken<SessionUser & { exp: number }>(token, env.SESSION_SECRET);
  if (!payload) return null;
  return { uid: payload.uid, email: payload.email, name: payload.name };
}

export async function sessionCookie(user: SessionUser, env: Env): Promise<string> {
  const token = await signToken({ uid: user.uid, email: user.email, name: user.name }, env.SESSION_SECRET, SESSION_TTL);
  return serializeCookie(SESSION_COOKIE, token, { maxAge: SESSION_TTL });
}

export function logoutCookie(): string {
  return clearCookie(SESSION_COOKIE);
}
