import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NOUNS, NOUN_CATEGORIES } from "@/data/nouns";

export const metadata = { title: "Nouns · AnimationDictionary.xyz" };

export default function NounsIndexPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">The Subjects</p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-3">Nouns.</h1>
        <p className="text-slate-500 text-lg max-w-2xl">
          Every entry is a 3D model. A castle, a bird, a sword. Pair any noun with any compatible verb
          to preview the animation on the model.
        </p>
      </div>

      {NOUN_CATEGORIES.map((c) => {
        const items = NOUNS.filter((n) => n.category === c.id);
        if (!items.length) return null;
        return (
          <div key={c.id} className="mb-12 scroll-mt-28" id={c.id}>
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${c.tint}`}
              >
                {c.label}
              </span>
              <span className="text-xs text-slate-400 font-bold">{items.length} models</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.map((n) => (
                <Link
                  key={n.slug}
                  href={`/nouns/${n.slug}/`}
                  className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-500 transition group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 mb-3 flex items-center justify-center text-xl font-black text-slate-400">
                    {n.word[0]}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                    {n.category}
                  </div>
                  <div className="font-bold text-sm group-hover:text-blue-600 transition">{n.word}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{n.polyHint}</div>
                  <ArrowUpRight className="w-3 h-3 float-right -mt-4 opacity-0 group-hover:opacity-100 transition text-blue-600" />
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
