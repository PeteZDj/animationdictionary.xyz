"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Search, MoveRight } from "lucide-react";
import { VERBS } from "@/data/verbs";
import { NOUNS } from "@/data/nouns";

/**
 * Big hero search bar. Real "semantic" search will land later — for now
 * we do a substring match across verbs + nouns and route to the closest
 * one on submit.
 */
export function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const suggestions = useMemo(() => {
    if (!q.trim()) return [];
    const t = q.trim().toLowerCase();
    const hits: { kind: "verb" | "noun"; slug: string; word: string }[] = [];
    for (const v of VERBS) {
      if (
        v.word.toLowerCase().includes(t) ||
        v.synonyms.some((s) => s.toLowerCase().includes(t))
      ) {
        hits.push({ kind: "verb", slug: v.slug, word: v.word });
        if (hits.length >= 6) break;
      }
    }
    if (hits.length < 6) {
      for (const n of NOUNS) {
        if (n.word.toLowerCase().includes(t)) {
          hits.push({ kind: "noun", slug: n.slug, word: n.word });
          if (hits.length >= 6) break;
        }
      }
    }
    return hits;
  }, [q]);

  function go(kind: "verb" | "noun", slug: string) {
    router.push(`/${kind}s/${slug}/`);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (suggestions.length) go(suggestions[0].kind, suggestions[0].slug);
  }

  return (
    <div className="max-w-3xl mx-auto relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition" />
      <form
        onSubmit={onSubmit}
        className="relative bg-white border-2 border-slate-100 rounded-2xl p-2 flex shadow-2xl shadow-slate-200/40"
      >
        <div className="flex items-center px-4 text-slate-400">
          <Search className="w-6 h-6" />
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="text"
          placeholder="Type a verb: 'Vault', 'Sneak', 'Pounce'..."
          className="w-full bg-transparent outline-none text-lg sm:text-xl py-3 pr-4 font-semibold"
        />
        <button
          type="submit"
          className="bg-slate-900 text-white px-6 sm:px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition active:scale-95"
        >
          <span className="hidden sm:inline">Search</span>
          <MoveRight className="w-5 h-5" />
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="absolute top-full mt-3 inset-x-0 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/40 overflow-hidden z-20">
          {suggestions.map((s) => (
            <button
              key={`${s.kind}-${s.slug}`}
              onClick={() => go(s.kind, s.slug)}
              className="w-full px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition text-left"
              type="button"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 w-12">{s.kind}</span>
              <span className="font-semibold">{s.word}</span>
              <MoveRight className="w-4 h-4 text-slate-300 ml-auto" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-slate-400 px-2">
        <span>Trending:</span>
        {["vault", "land", "sneak", "fly"].map((slug) => (
          <button
            key={slug}
            onClick={() => go("verb", slug)}
            className="hover:text-blue-600 underline underline-offset-4 transition"
          >
            {VERBS.find((v) => v.slug === slug)?.word ?? slug}
          </button>
        ))}
      </div>
    </div>
  );
}
