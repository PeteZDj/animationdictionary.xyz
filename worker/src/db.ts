import type { Env } from "./types";

export interface CoverageRow {
  total_words: number;
  lexicon_words: number;
  covered_words: number;
  total_animations: number;
}

export interface WordRow {
  word: string;
  covered: boolean;
  slug: string | null;
  category: string | null;
  animations: number;
}

export async function getCoverage(env: Env): Promise<CoverageRow> {
  const row = await env.DB.prepare("SELECT * FROM coverage").first<CoverageRow>();
  return row ?? { total_words: 0, lexicon_words: 0, covered_words: 0, total_animations: 0 };
}

export interface ListWordsOpts {
  filter?: "all" | "covered" | "open";
  q?: string;
  limit?: number;
  offset?: number;
}

export async function listWords(env: Env, opts: ListWordsOpts): Promise<WordRow[]> {
  const limit = Math.min(Math.max(opts.limit ?? 200, 1), 500);
  const offset = Math.max(opts.offset ?? 0, 0);
  const where: string[] = ["w.in_lexicon = 1"];
  const binds: unknown[] = [];
  if (opts.q) {
    where.push("w.word LIKE ?");
    binds.push(`%${opts.q.toLowerCase()}%`);
  }
  let having = "";
  if (opts.filter === "covered") having = "HAVING animations > 0";
  else if (opts.filter === "open") having = "HAVING animations = 0";

  const sql = `
    SELECT w.word AS word, w.verb_slug AS slug, w.category AS category,
           COALESCE(wac.animations, 0) AS animations
    FROM word w
    LEFT JOIN word_animation_count wac ON wac.word_id = w.id
    WHERE ${where.join(" AND ")}
    GROUP BY w.id
    ${having}
    ORDER BY w.word
    LIMIT ? OFFSET ?`;
  binds.push(limit, offset);

  const res = await env.DB.prepare(sql).bind(...binds).all<any>();
  return (res.results ?? []).map((r) => ({
    word: r.word,
    covered: r.animations > 0,
    slug: r.slug,
    category: r.category,
    animations: r.animations,
  }));
}

export interface WordDetail extends WordRow {
  tags: string[];
}

export async function getWord(env: Env, word: string): Promise<WordDetail | null> {
  const w = word.trim().toLowerCase();
  const row = await env.DB.prepare(
    `SELECT w.id, w.word, w.verb_slug AS slug, w.category,
            COALESCE(wac.animations, 0) AS animations
     FROM word w LEFT JOIN word_animation_count wac ON wac.word_id = w.id
     WHERE w.word = ? GROUP BY w.id`
  ).bind(w).first<any>();
  if (!row) return null;
  const tagRes = await env.DB.prepare(
    `SELECT DISTINCT t.name FROM tag t
     JOIN animation_tag at ON at.tag_id = t.id
     JOIN animation a ON a.id = at.animation_id
     WHERE a.word_id = COALESCE((SELECT alias_of FROM word WHERE id = ?), ?)
       AND a.status = 'approved' LIMIT 50`
  ).bind(row.id, row.id).all<{ name: string }>();
  return {
    word: row.word,
    covered: row.animations > 0,
    slug: row.slug,
    category: row.category,
    animations: row.animations,
    tags: (tagRes.results ?? []).map((t) => t.name),
  };
}

export async function upsertUser(
  env: Env,
  u: { email: string; name: string; provider: string; sub?: string }
): Promise<number> {
  const email = u.email.trim().toLowerCase();
  await env.DB.prepare(
    `INSERT INTO app_user (email, display_name, oauth_provider, oauth_sub)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       display_name = COALESCE(excluded.display_name, app_user.display_name),
       oauth_provider = excluded.oauth_provider,
       oauth_sub = COALESCE(excluded.oauth_sub, app_user.oauth_sub)`
  ).bind(email, u.name || null, u.provider, u.sub ?? null).run();
  const row = await env.DB.prepare("SELECT id FROM app_user WHERE email = ?").bind(email).first<{ id: number }>();
  return row!.id;
}

export async function ensureWordId(env: Env, word: string): Promise<number | null> {
  const w = word.trim().toLowerCase();
  const row = await env.DB.prepare("SELECT id FROM word WHERE word = ?").bind(w).first<{ id: number }>();
  return row?.id ?? null;
}

export async function createClaim(
  env: Env,
  userId: number,
  wordId: number,
  rigs: string[],
  tags: string[]
): Promise<number> {
  const res = await env.DB.prepare(
    `INSERT INTO claim (word_id, user_id, rigs, tags, status) VALUES (?, ?, ?, ?, 'open')`
  ).bind(wordId, userId, JSON.stringify(rigs), JSON.stringify(tags)).run();
  return Number(res.meta.last_row_id);
}

export async function listClaims(env: Env, userId: number) {
  const res = await env.DB.prepare(
    `SELECT c.id, w.word, c.rigs, c.tags, c.status, c.created_at
     FROM claim c JOIN word w ON w.id = c.word_id
     WHERE c.user_id = ? ORDER BY c.created_at DESC`
  ).bind(userId).all<any>();
  return (res.results ?? []).map((r) => ({
    id: r.id,
    word: r.word,
    rigs: JSON.parse(r.rigs ?? "[]"),
    tags: JSON.parse(r.tags ?? "[]"),
    status: r.status,
    created_at: r.created_at,
  }));
}

export async function createAnimation(
  env: Env,
  args: { wordId: number; authorId: number; title: string; rigs: string[]; fileKey: string; bytes: number; tags: string[] }
): Promise<number> {
  const res = await env.DB.prepare(
    `INSERT INTO animation (word_id, author_id, title, rigs, status, price_usd, file_key, bytes)
     VALUES (?, ?, ?, ?, 'pending', 1, ?, ?)`
  ).bind(args.wordId, args.authorId, args.title, JSON.stringify(args.rigs), args.fileKey, args.bytes).run();
  const animId = Number(res.meta.last_row_id);
  for (const name of args.tags) {
    const t = name.trim().toLowerCase();
    if (!t) continue;
    await env.DB.prepare("INSERT OR IGNORE INTO tag (name) VALUES (?)").bind(t).run();
    const tag = await env.DB.prepare("SELECT id FROM tag WHERE name = ?").bind(t).first<{ id: number }>();
    if (tag) {
      await env.DB.prepare("INSERT OR IGNORE INTO animation_tag (animation_id, tag_id) VALUES (?, ?)")
        .bind(animId, tag.id).run();
    }
  }
  return animId;
}
