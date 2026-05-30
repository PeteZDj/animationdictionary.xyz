import type { Env } from "../types";

/** Same-origin in prod (Cloudflare route). CORS is only needed for local dev. */
export function corsHeaders(req: Request, env: Env): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const allow = origin === env.SITE_ORIGIN || /^http:\/\/localhost:\d+$/.test(origin);
  if (!allow) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Vary": "Origin",
  };
}

export function json(data: unknown, init: ResponseInit = {}, extra: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extra },
  });
}

export function error(status: number, message: string, extra: HeadersInit = {}): Response {
  return json({ error: message }, { status }, extra);
}

export function redirect(location: string, extra: HeadersInit = {}): Response {
  return new Response(null, { status: 302, headers: { Location: location, ...extra } });
}
