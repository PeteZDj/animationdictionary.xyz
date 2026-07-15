import type { Env } from "./types";
import { json, error, corsHeaders } from "./lib/http";
import { coverage, words, wordDetail } from "./routes/words";
import { createClaimRoute, uploadRoute, createAnimationRoute, rigRoute } from "./routes/contrib";
import { animators, animatorDetail } from "./routes/animators";
import {
  authStart, authCallback, emailStart, emailVerify, me, logout, configuredProviders,
  register, login, gsiLogin,
} from "./auth";
import { PROVIDER_IDS, type ProviderId } from "./auth/providers";

function withCors(res: Response, req: Request, env: Env): Response {
  const h = corsHeaders(req, env);
  if (!Object.keys(h).length) return res;
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(h)) out.headers.set(k, v);
  return out;
}

function isProvider(x: string): x is ProviderId {
  return (PROVIDER_IDS as string[]).includes(x);
}

async function route(req: Request, env: Env): Promise<Response> {
  const { pathname } = new URL(req.url);
  const seg = pathname.replace(/^\/+|\/+$/g, "").split("/"); // ["api", ...]
  if (seg[0] !== "api") return error(404, "Not found");
  const p = seg.slice(1);
  const m = req.method;

  // ── public reads ──────────────────────────────────────────────
  if (m === "GET" && p[0] === "health") return json({ ok: true, service: "animationdictionary-api" });
  if (m === "GET" && p[0] === "coverage") return coverage(req, env);
  if (m === "GET" && p[0] === "words" && p.length === 1) return words(req, env);
  if (m === "GET" && p[0] === "words" && p[1]) return wordDetail(req, env, decodeURIComponent(p[1]));
  if (m === "GET" && p[0] === "rig" && p[1]) return rigRoute(req, env, p[1]);
  if (m === "GET" && p[0] === "animators" && p.length === 1) return animators(req, env);
  if (m === "GET" && p[0] === "animators" && p[1]) return animatorDetail(req, env, decodeURIComponent(p[1]));

  // ── auth ──────────────────────────────────────────────────────
  if (m === "GET" && p[0] === "auth" && p[1] === "providers") return json({ providers: configuredProviders(env) });
  if (m === "POST" && p[0] === "auth" && p[1] === "register") return register(req, env);
  if (m === "POST" && p[0] === "auth" && p[1] === "login") return login(req, env);
  if (m === "POST" && p[0] === "auth" && p[1] === "email" && p[2] === "start") return emailStart(req, env);
  if (m === "GET" && p[0] === "auth" && p[1] === "email" && p[2] === "verify") return emailVerify(req, env);
  if (p[0] === "auth" && p[1] && isProvider(p[1]) && p[2] === "start" && m === "GET") return authStart(req, env, p[1]);
  if (p[0] === "auth" && p[1] && isProvider(p[1]) && p[2] === "callback" && m === "GET") return authCallback(req, env, p[1]);
  if (m === "POST" && p[0] === "auth" && p[1] === "gsi") return gsiLogin(req, env);
  if (m === "POST" && p[0] === "auth" && p[1] === "logout") return logout(req, env);
  if (m === "GET" && p[0] === "me") return me(req, env);

  // ── contributor (auth-gated inside handlers) ──────────────────
  if (m === "POST" && p[0] === "claims") return createClaimRoute(req, env);
  if (m === "PUT" && p[0] === "uploads") return uploadRoute(req, env);
  if (m === "POST" && p[0] === "animations") return createAnimationRoute(req, env);

  return error(404, "Not found");
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(req, env) });
    }
    try {
      const res = await route(req, env);
      return withCors(res, req, env);
    } catch (e) {
      return withCors(error(500, (e as Error).message), req, env);
    }
  },
} satisfies ExportedHandler<Env>;
