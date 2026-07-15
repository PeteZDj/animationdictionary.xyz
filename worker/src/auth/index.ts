import type { Env, SessionUser } from "../types";
import { json, error, redirect } from "../lib/http";
import { signToken, verifyToken, randomToken, hashPassword, verifyPassword } from "../lib/crypto";
import { sessionCookie, logoutCookie, readSession } from "../lib/session";
import { upsertUser, listClaims, getUserByEmail, createCredUser, usernameTaken } from "../db";
import { getProvider, exchangeCode, type ProviderId, PROVIDER_IDS, type NormalizedUser } from "./providers";

async function verifyGoogleIdToken(idToken: string, clientId: string): Promise<NormalizedUser> {
  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("malformed token");
  const [headerB64, payloadB64, sigB64] = parts;

  const b64 = (s: string) => s.replace(/-/g, "+").replace(/_/g, "/");
  const payload = JSON.parse(atob(b64(payloadB64)));
  const header = JSON.parse(atob(b64(headerB64)));

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) throw new Error("token expired");
  if (payload.aud !== clientId) throw new Error("invalid audience");
  if (!["https://accounts.google.com", "accounts.google.com"].includes(payload.iss)) throw new Error("invalid issuer");

  const jwksResp = await fetch("https://www.googleapis.com/oauth2/v3/certs", { cf: { cacheTtl: 3600 } } as RequestInit);
  if (!jwksResp.ok) throw new Error("failed to fetch Google public keys");
  const jwks = (await jwksResp.json()) as { keys: { kid: string; n: string; e: string; kty: string }[] };

  const key = jwks.keys.find((k) => k.kid === header.kid);
  if (!key) throw new Error("unknown key ID");

  const cryptoKey = await crypto.subtle.importKey(
    "jwk", key, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]
  );

  const signingInput = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const sig = Uint8Array.from(atob(b64(sigB64)), (c) => c.charCodeAt(0));
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, sig, signingInput);
  if (!valid) throw new Error("invalid signature");

  return {
    email: payload.email,
    name: payload.name ?? payload.given_name ?? (payload.email as string).split("@")[0],
    sub: String(payload.sub),
  };
}

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

function slugifyUsername(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24) || "user"
  );
}

async function uniqueUsername(env: Env, base: string): Promise<string> {
  let candidate = slugifyUsername(base);
  if (!(await usernameTaken(env, candidate))) return candidate;
  for (let i = 2; i < 9999; i++) {
    const next = `${candidate}-${i}`;
    if (!(await usernameTaken(env, next))) return next;
  }
  return `${candidate}-${randomToken(3)}`;
}

/** POST /api/auth/register {email, password, name?, username?} */
export async function register(req: Request, env: Env): Promise<Response> {
  const body = (await req.json().catch(() => ({}))) as {
    email?: string; password?: string; name?: string; username?: string;
  };
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!email.includes("@")) return error(400, "A valid email is required");
  if (password.length < 8) return error(400, "Password must be at least 8 characters");

  const existing = await getUserByEmail(env, email);
  if (existing?.password_hash) return error(409, "An account with that email already exists — sign in instead");

  const name = (body.name ?? "").trim() || email.split("@")[0];
  const username = await uniqueUsername(env, body.username?.trim() || name || email.split("@")[0]);
  const passwordHash = await hashPassword(password);
  const uid = await createCredUser(env, { email, name, username, passwordHash });
  const cookie = await sessionCookie({ uid, email, name }, env);
  return json({ ok: true, user: { uid, email, name, username } }, { status: 201 }, { "Set-Cookie": cookie });
}

/** POST /api/auth/login {email, password} */
export async function login(req: Request, env: Env): Promise<Response> {
  const body = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const user = await getUserByEmail(env, email);
  if (!user || !user.password_hash) return error(401, "Incorrect email or password");
  if (!(await verifyPassword(password, user.password_hash))) return error(401, "Incorrect email or password");
  const name = user.display_name ?? email.split("@")[0];
  const cookie = await sessionCookie({ uid: user.id, email, name }, env);
  return json(
    { ok: true, user: { uid: user.id, email, name, username: user.username } },
    { status: 200 },
    { "Set-Cookie": cookie }
  );
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

/** POST /api/auth/gsi  { credential: <google-id-token>, return?: "/path" } */
export async function gsiLogin(req: Request, env: Env): Promise<Response> {
  const body = (await req.json().catch(() => ({}))) as { credential?: string; return?: string };
  if (!body.credential || typeof body.credential !== "string") return error(400, "Missing credential");
  if (!env.GOOGLE_CLIENT_ID) return error(503, "Google sign-in is not configured");

  try {
    const profile = await verifyGoogleIdToken(body.credential, env.GOOGLE_CLIENT_ID);
    const uid = await upsertUser(env, { email: profile.email, name: profile.name, provider: "google", sub: profile.sub });
    const cookie = await sessionCookie({ uid, email: profile.email, name: profile.name }, env);
    return json({ ok: true, redirectTo: safeReturn(body.return ?? null) }, { status: 200 }, { "Set-Cookie": cookie });
  } catch (e) {
    return error(401, `Google sign-in failed: ${(e as Error).message}`);
  }
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
