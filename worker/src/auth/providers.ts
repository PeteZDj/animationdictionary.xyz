import type { Env } from "../types";

export type ProviderId = "google" | "github" | "afrosoftware";
export const PROVIDER_IDS: ProviderId[] = ["google", "github", "afrosoftware"];

export interface NormalizedUser {
  email: string;
  name: string;
  sub: string;
}

export interface ProviderConfig {
  id: ProviderId;
  authorizeUrl: string;
  tokenUrl: string;
  scope: string;
  extraAuthParams?: Record<string, string>;
  clientId: string;
  clientSecret: string;
  fetchUser: (accessToken: string) => Promise<NormalizedUser>;
}

const UA = "animationdictionary.xyz-worker";

async function googleUser(accessToken: string): Promise<NormalizedUser> {
  const r = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!r.ok) throw new Error("google userinfo failed");
  const u = (await r.json()) as any;
  return { email: u.email, name: u.name ?? u.given_name ?? u.email, sub: String(u.sub) };
}

async function githubUser(accessToken: string): Promise<NormalizedUser> {
  const headers = { Authorization: `Bearer ${accessToken}`, "User-Agent": UA, Accept: "application/vnd.github+json" };
  const ur = await fetch("https://api.github.com/user", { headers });
  if (!ur.ok) throw new Error("github user failed");
  const u = (await ur.json()) as any;
  let email: string | undefined = u.email ?? undefined;
  if (!email) {
    const er = await fetch("https://api.github.com/user/emails", { headers });
    if (er.ok) {
      const emails = (await er.json()) as any[];
      email = (emails.find((e) => e.primary && e.verified) ?? emails.find((e) => e.verified) ?? emails[0])?.email;
    }
  }
  if (!email) throw new Error("github email unavailable");
  return { email, name: u.name ?? u.login ?? email, sub: String(u.id) };
}

/** Returns null when the provider's credentials are not configured. */
export function getProvider(id: ProviderId, env: Env): ProviderConfig | null {
  switch (id) {
    case "google":
    case "afrosoftware": // branded button, backed by Google until a3.ke ships
      if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return null;
      return {
        id,
        authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        scope: "openid email profile",
        extraAuthParams: { access_type: "online", prompt: "select_account" },
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        fetchUser: googleUser,
      };
    case "github":
      if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) return null;
      return {
        id,
        authorizeUrl: "https://github.com/login/oauth/authorize",
        tokenUrl: "https://github.com/login/oauth/access_token",
        scope: "read:user user:email",
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        fetchUser: githubUser,
      };
    default:
      return null;
  }
}

export async function exchangeCode(p: ProviderConfig, code: string, redirectUri: string): Promise<string> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: p.clientId,
    client_secret: p.clientSecret,
    redirect_uri: redirectUri,
  });
  const r = await fetch(p.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json", "User-Agent": UA },
    body,
  });
  if (!r.ok) throw new Error(`${p.id} token exchange failed: ${r.status}`);
  const data = (await r.json()) as any;
  if (!data.access_token) throw new Error(`${p.id} token exchange: no access_token`);
  return data.access_token as string;
}
