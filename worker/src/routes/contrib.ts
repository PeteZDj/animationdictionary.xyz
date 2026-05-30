import type { Env } from "../types";
import { json, error } from "../lib/http";
import { randomToken } from "../lib/crypto";
import { requireUser } from "../auth";
import { ensureWordId, createClaim, createAnimation } from "../db";

async function wordIdOrCreate(env: Env, word: string): Promise<number> {
  const w = word.trim().toLowerCase();
  const existing = await ensureWordId(env, w);
  if (existing) return existing;
  const res = await env.DB.prepare("INSERT INTO word (word, in_lexicon) VALUES (?, 1)").bind(w).run();
  return Number(res.meta.last_row_id);
}

/** POST /api/claims — reserve a word to animate. */
export async function createClaimRoute(req: Request, env: Env): Promise<Response> {
  const user = await requireUser(req, env);
  if (user instanceof Response) return user;
  const body = (await req.json().catch(() => ({}))) as { word?: string; rigs?: string[]; tags?: string[] };
  if (!body.word) return error(400, "word is required");
  const wordId = await wordIdOrCreate(env, body.word);
  const id = await createClaim(env, user.uid, wordId, body.rigs ?? [], body.tags ?? []);
  return json({ ok: true, claimId: id, word: body.word.toLowerCase() }, { status: 201 });
}

/** PUT /api/uploads — stream an animation bundle into R2, returns its key. */
export async function uploadRoute(req: Request, env: Env): Promise<Response> {
  const user = await requireUser(req, env);
  if (user instanceof Response) return user;
  if (!req.body) return error(400, "Empty body");
  const ext = (new URL(req.url).searchParams.get("ext") ?? "fbx").replace(/[^a-z0-9]/gi, "").slice(0, 8);
  const key = `uploads/${user.uid}/${randomToken(12)}.${ext}`;
  const put = await env.BUCKET.put(key, req.body, {
    httpMetadata: { contentType: req.headers.get("Content-Type") ?? "application/octet-stream" },
  });
  return json({ ok: true, key, bytes: put?.size ?? 0 }, { status: 201 });
}

/** POST /api/animations — register an uploaded clip for a word, with tags. */
export async function createAnimationRoute(req: Request, env: Env): Promise<Response> {
  const user = await requireUser(req, env);
  if (user instanceof Response) return user;
  const body = (await req.json().catch(() => ({}))) as {
    word?: string; title?: string; rigs?: string[]; tags?: string[]; fileKey?: string; bytes?: number;
  };
  if (!body.word || !body.fileKey) return error(400, "word and fileKey are required");
  const wordId = await wordIdOrCreate(env, body.word);
  const animId = await createAnimation(env, {
    wordId,
    authorId: user.uid,
    title: body.title || body.word,
    rigs: body.rigs ?? [],
    fileKey: body.fileKey,
    bytes: body.bytes ?? 0,
    tags: body.tags ?? [],
  });
  return json({ ok: true, animationId: animId, status: "pending" }, { status: 201 });
}

/** GET /api/rig/:engine — stream the standard rig kit for an engine from R2. */
export async function rigRoute(_req: Request, env: Env, engine: string): Promise<Response> {
  const key = `rigs/${engine.toLowerCase().replace(/[^a-z0-9]/g, "")}.zip`;
  const obj = await env.BUCKET.get(key);
  if (!obj) return error(404, `No rig kit uploaded yet for "${engine}". Upload it to R2 at ${key}.`);
  return new Response(obj.body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${engine}-rig.zip"`,
    },
  });
}
