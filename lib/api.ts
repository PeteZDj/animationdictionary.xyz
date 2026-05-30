// Browser client for the Cloudflare Worker API (animationdictionary.xyz/api/*).
// In production the API is same-origin under /api (Cloudflare route -> Worker).
// Override with NEXT_PUBLIC_API_BASE for local dev (e.g. http://localhost:8787/api).
// Every call is best-effort: callers fall back to the static lexicon when the
// API is not yet deployed.

export const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) || "/api";

export interface ApiCoverage {
  dictionaryTotal: number;
  coveredWords: number;
  animations: number;
  lexiconSize: number;
  lexiconCovered: number;
  lexiconOpen: number;
  pctDictionary: number;
  pctLexicon: number;
}

export interface ApiWord {
  word: string;
  covered: boolean;
  slug: string | null;
  category: string | null;
  animations: number;
}

export interface ApiUser {
  uid: number;
  email: string;
  name: string;
}

async function get<T>(path: string): Promise<T | null> {
  try {
    const r = await fetch(`${API_BASE}${path}`, { credentials: "include" });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

export const api = {
  base: API_BASE,
  signInUrl(provider: string, returnTo = "/dictionary/") {
    return `${API_BASE}/auth/${provider}/start?return=${encodeURIComponent(returnTo)}`;
  },
  rigUrl(engine: string) {
    return `${API_BASE}/rig/${encodeURIComponent(engine)}`;
  },
  getCoverage: () => get<ApiCoverage>("/coverage"),
  getWords: (filter: "all" | "covered" | "open" = "all") =>
    get<{ words: ApiWord[] }>(`/words?filter=${filter}&limit=500`),
  getMe: () => get<{ user: ApiUser | null }>("/me"),
  async startEmail(email: string, returnTo = "/dictionary/"): Promise<{ ok: boolean; devLink?: string }> {
    try {
      const r = await fetch(`${API_BASE}/auth/email/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, return: returnTo }),
      });
      return (await r.json()) as { ok: boolean; devLink?: string };
    } catch {
      return { ok: false };
    }
  },
  async claim(word: string, rigs: string[], tags: string[]): Promise<{ ok: boolean; status?: number }> {
    try {
      const r = await fetch(`${API_BASE}/claims`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ word, rigs, tags }),
      });
      return { ok: r.ok, status: r.status };
    } catch {
      return { ok: false };
    }
  },
};
