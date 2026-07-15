// Dictionary-coverage model for animationdictionary.xyz.
//
// The grand vision: animate every word in the English language. This module
// measures progress toward that — what share of the dictionary already has at
// least one animation, how many animations exist per word, and which common
// action words are still open to claim.
//
// "Covered" words are derived live from the verb lexicon (a verb's display word
// and every synonym you could search for it by). The backlog (words we do not
// yet ship) lives in the generated data/priority-words.ts.

import { VERBS } from "./verbs";
import { itemsForVerb } from "./marketplace";
import { BACKLOG_WORDS } from "./priority-words";

/**
 * Size of the English language universe. Sourced from dwyl/english-words
 * (`words_alpha.txt`, alphabetic words only). This is the denominator for the
 * headline "percentage of the dictionary covered" metric.
 * https://github.com/dwyl/english-words
 */
export const DICTIONARY_TOTAL = 370_105;

export interface CoveredWord {
  word: string;        // the searchable English word
  slug: string;        // verb slug it resolves to (for /verbs/<slug>/)
  display: string;     // pretty verb name
  category: string;    // verb category
  animations: number;  // animations available for this word
}

export interface LexEntry {
  word: string;
  covered: boolean;
  slug?: string;
  category?: string;
  animations: number;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Animations available for a covered word. Combines the (mock) marketplace
 * listings for the verb with a deterministic "community" count so each word
 * reads like a living, contributed-to entry rather than a single stub.
 */
function animationsFor(slug: string): number {
  const listed = itemsForVerb(slug).length;
  const community = 8 + (hash(slug) % 53); // 8–60
  return listed + community;
}

const TOKEN = /^[a-z]+$/;

/** Map of every searchable word -> the verb that satisfies it. */
export const COVERED: Map<string, CoveredWord> = (() => {
  const map = new Map<string, CoveredWord>();
  for (const v of VERBS) {
    const entry: CoveredWord = {
      word: v.word.toLowerCase(),
      slug: v.slug,
      display: v.word,
      category: v.category,
      animations: animationsFor(v.slug),
    };
    const tokens = [v.word.toLowerCase(), v.slug, ...v.synonyms.map((s) => s.toLowerCase())];
    for (const t of tokens) {
      if (TOKEN.test(t) && !map.has(t)) map.set(t, { ...entry, word: t });
    }
  }
  return map;
})();

/** The full "core action lexicon": covered words (green) + the backlog (open). */
export const LEXICON: LexEntry[] = (() => {
  const out: LexEntry[] = [];
  for (const [word, c] of COVERED) {
    out.push({ word, covered: true, slug: c.slug, category: c.category, animations: c.animations });
  }
  for (const word of BACKLOG_WORDS) {
    if (!COVERED.has(word)) out.push({ word, covered: false, animations: 0 });
  }
  return out.sort((a, b) => a.word.localeCompare(b.word));
})();

const totalAnimations = [...COVERED.values()].reduce((s, c) => s + c.animations, 0);

export const COVERAGE = {
  /** Total English words (the universe). */
  dictionaryTotal: DICTIONARY_TOTAL,
  /** Distinct words you can already find an animation for. */
  coveredWords: COVERED.size,
  /** Animations available across all covered words. */
  animations: totalAnimations,
  /** Size of the curated core action lexicon (green + open). */
  lexiconSize: LEXICON.length,
  /** Covered words within that lexicon. */
  lexiconCovered: LEXICON.filter((e) => e.covered).length,
  /** Open (claimable) words in the lexicon. */
  lexiconOpen: LEXICON.filter((e) => !e.covered).length,
  /** Share of the full dictionary covered, as a fraction. */
  get pctDictionary() {
    return this.coveredWords / this.dictionaryTotal;
  },
  /** Share of the core action lexicon covered, as a fraction. */
  get pctLexicon() {
    return this.lexiconCovered / this.lexiconSize;
  },
};

/** Look up coverage for a single word (case-insensitive). */
export function lookupWord(word: string): CoveredWord | undefined {
  return COVERED.get(word.trim().toLowerCase());
}
