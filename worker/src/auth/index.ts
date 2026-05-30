import type { Env, SessionUser } from "../types";
import { json, error, redirect } from "../lib/http";
import { signToken, verifyToken, randomToken } from "../lib/crypto";
import { sessionCookie, logoutCookie, readSession } from "../lib/session";
import { upsertUser, listClaims } from "../db";
import { getProvider, exchangeCode, type ProviderId, PROVIDER_IDS } from "./providers";

/** Only allow same-site relative return paths (prevents open redirects). */
function safeReturn(input: string | null): string {
  if (input && input.startsWith("/") && !input.startsWith("//")) return input;
  return "/dictionary/";
}

function redirectUri(env: Env, id: string): string {
  return `${env.API_BASE}/auth/${id}/callback`;
}

export async function authStart(req: Request, env: Env, id: ProviderId): Promise<Response> {
  const p = getProvider(id, env);
  if (!p) return error(503, `Sign-in with ${id} is not configured yet`);
  const url = new URL(req.url);
  const ret = safeReturn(url.searchParams.get("return"));
  const state = await signToken({ p: id, r: ret, n: randomToken(8) }, env.SESSION_SECRET, 600);

  const auth = new URL(p.authorizeUrl);
  auth.searchParams.set("client_id", p.clientId);
  auth.searchParams.set("redirect_uri", redirectUri(env, id));
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("scope", p.scope);
  auth.searchParams.set("state", state);
  for (const [k, v] of Object.entries(p.extraAuthParams ?? {})) auth.searchParams.set(k, v);
  return redirect(auth.toString());
}

export async function authCallback(req: Request, env: Env, id: ProviderId): Promise<Response> {
  const p = getProvider(id, env);
  if (!p) return error(503, `Sign-in with ${id} is not configured yet`);
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return error(400, "Missing code/state");

  const payload = await verifyToken<{ p: ProviderId; r: string }>(state, env.SESSION_SECRET);
  if (!payload || payload.p !== id) return error(400, "Invalid or expired state");

  try {
    const accessToken = await exchangeCode(p, code, redirectUri(env, id));
    const profile = await p.fetchUser(accessToken);
    const uid = await upsertUser(env, { email: profile.email, name: profile.name, provider: id, sub: profile.sub });
    const cookie = await sessionCookie({ uid, email: profile.email, name: profile.name }, env);
    return redirect(`${env.SITE_ORIGIN}${safeReturn(payload.r)}`, { "Set-Cookie": cookie });
  } catch (e) {
    return error(502, `Sign-in failed: ${(e as Error).message}`);
  }
}

export async function emailStart(req: Request, env: Env): Promise<Response> {
  const { email, return: ret } = (await req.json().catch(() => ({}))) as { email?: string; return?: string };
  if (!email || !email.includes("@")) return error(400, "Valid email required");
  const token = await signToken({ e: email.toLowerCase(), r: safeReturn(ret ?? null), m: 1 }, env.SESSION_SECRET, 900);
  const link = `${env.API_BASE}/auth/email/verify?token=${encodeURIComponent(token)}`;

  if (env.RESEND_API_KEY) {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "AnimationDictionary <login@animationdictionary.xyz>",
        to: [email],
        subject: "Your sign-in link",
        html: `<p>Click to sign in to AnimationDictionary.xyz:</p><p><a href="${link}">Sign in</a></p><p>This link expires in 15 minutes.</p>`,
      }),
    });
    return json({ ok: true, delivered: r.ok });
  }
  // No mail provider configured — return the link so dev can complete the flow.
  return json({ ok: true, delivered: false, devLink: link });
}

export async function emailVerify(req: Request, env: Env): Promise<Response> {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return error(400, "Missing token");
  const payload = await verifyToken<{ e: string; r: string; m: number }>(token, env.SESSION_SECRET);
  if (!payload || payload.m !== 1) return error(400, "Invalid or expired link");
  const name = payload.e.split("@")[0];
  const uid = await upsertUser(env, { email: payload.e, name, provider: "email" });
  const cookie = await sessionCookie({ uid, email: payload.e, name }, env);
  return redirect(`${env.SITE_ORIGIN}${safeReturn(payload.r)}`, { "Set-Cookie": cookie });
}

export async function me(req: Request, env: Env): Promise<Response> {
  const user = await readSession(req, env);
  if (!user) return json({ user: null }, { status: 200 });
  const claims = await listClaims(env, user.uid);
  return json({ user, claims });
}

export async function logout(_req: Request, env: Env): Promise<Response> {
  return json({ ok: true }, { status: 200 }, { "Set-Cookie": logoutCookie() });
}

export function configuredProviders(env: Env): { id: string; configured: boolean }[] {
  const list: { id: string; configured: boolean }[] = PROVIDER_IDS.map((id) => ({
    id: id as string,
    configured: !!getProvider(id, env),
  }));
  list.push({ id: "email", configured: true });
  return list;
}

export async function requireUser(req: Request, env: Env): Promise<SessionUser | Response> {
  const user = await readSession(req, env);
  if (!user) return error(401, "Sign in required");
  return user;
}
