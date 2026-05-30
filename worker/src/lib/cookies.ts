export function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

export interface CookieOpts {
  maxAge?: number; // seconds
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Lax" | "Strict" | "None";
}

export function serializeCookie(name: string, value: string, opts: CookieOpts = {}): string {
  const p: string[] = [`${name}=${encodeURIComponent(value)}`];
  p.push(`Path=${opts.path ?? "/"}`);
  if (opts.maxAge !== undefined) p.push(`Max-Age=${opts.maxAge}`);
  if (opts.httpOnly !== false) p.push("HttpOnly");
  if (opts.secure !== false) p.push("Secure");
  p.push(`SameSite=${opts.sameSite ?? "Lax"}`);
  return p.join("; ");
}

export function clearCookie(name: string): string {
  return `${name}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}
