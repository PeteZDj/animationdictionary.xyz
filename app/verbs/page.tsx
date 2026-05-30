import Link from "next/link";
import { ArrowUpRight, Check, Repeat } from "lucide-react";
import { VERBS, CATEGORIES } from "@/data/verbs";

export const metadata = { title: "Verbs · AnimationDictionary.xyz" };

export default function VerbsIndexPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">The Lexicon</p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-3">Verbs.</h1>
        <p className="text-slate-500 text-lg max-w-2xl">
          Every entry is a discrete character action. Click a verb to preview it and browse compatible
          animations for any model.
        </p>
      </div>

      {CATEGORIES.map((c) => {
        const items = VERBS.filter((v) => v.category === c.id);
        if (!items.length) return null;
        return (
          <div id={c.id} key={c.id} className="mb-12 scroll-mt-28">
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${c.tint}`}
              >
                {c.label}
              </span>
              <span className="text-xs text-slate-400 font-bold">{items.length} verbs</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {items.map((v) => (
                <Link
                  key={v.slug}
                  href={`/verbs/${v.slug}/`}
                  className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 hover:-translate-y-0.5 transition"
                >
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Verb
                    {v.loopable && <Repeat className="w-3 h-3 text-emerald-500" />}
                    {v.rootMotion && <Check className="w-3 h-3 text-blue-500" />}
                  </div>
                  <div className="font-bold text-slate-900 group-hover:text-blue-600 transition">{v.word}</div>
                  <ArrowUpRight className="w-3 h-3 float-right -mt-4 opacity-0 group-hover:opacity-100 transition text-blue-600" />
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {v.synonyms.length > 0 ? v.synonyms.join(", ") : v.definition}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
