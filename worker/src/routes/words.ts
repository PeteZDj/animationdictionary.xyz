import type { Env } from "../types";
import { json, error } from "../lib/http";
import { getCoverage, listWords, getWord } from "../db";

export async function coverage(_req: Request, env: Env): Promise<Response> {
  const c = await getCoverage(env);
  return json({
    dictionaryTotal: c.total_words,
    coveredWords: c.covered_words,
    animations: c.total_animations,
    lexiconSize: c.lexicon_words,
    lexiconCovered: Math.min(c.covered_words, c.lexicon_words),
    lexiconOpen: Math.max(c.lexicon_words - c.covered_words, 0),
    pctDictionary: c.total_words ? c.covered_words / c.total_words : 0,
    pctLexicon: c.lexicon_words ? Math.min(c.covered_words, c.lexicon_words) / c.lexicon_words : 0,
  });
}

export async function words(req: Request, env: Env): Promise<Response> {
  const u = new URL(req.url);
  const filter = (u.searchParams.get("filter") ?? "all") as "all" | "covered" | "open";
  const rows = await listWords(env, {
    filter: ["all", "covered", "open"].includes(filter) ? filter : "all",
    q: u.searchParams.get("q") ?? undefined,
    limit: Number(u.searchParams.get("limit")) || undefined,
    offset: Number(u.searchParams.get("offset")) || undefined,
  });
  return json({ words: rows });
}

export async function wordDetail(_req: Request, env: Env, word: string): Promise<Response> {
  const detail = await getWord(env, word);
  if (!detail) return error(404, "Word not found");
  return json(detail);
}
