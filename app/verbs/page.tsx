import Link from "next/link";
import { ArrowUpRight, Check, Repeat } from "lucide-react";
import { VERBS, CATEGORIES } from "@/data/verbs";

export const metadata = { title: "Verbs · AnimationDictionary.xyz" };

export default function VerbsIndexPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">The Lexicon</p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-3">Verbs.</h1>
        <p className="text-slate-500 text-lg">
          Every entry is a discrete character action performed by the recurring barracks robot.
          Click a verb to preview it and browse compatible animations for any model.
        </p>
      </div>

      {/* category quick-jump strip */}
      <div className="flex flex-wrap gap-2 mb-12">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`#${c.id}`}
            className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border ${c.tint} hover:scale-105 transition`}
          >
            {c.label}
            <span className="ml-2 font-mono opacity-60">
              {VERBS.filter((v) => v.category === c.id).length}
            </span>
          </Link>
        ))}
      </div>

      {CATEGORIES.map((c) => {
        const items = VERBS.filter((v) => v.category === c.id);
        if (!items.length) return null;
        return (
          <div id={c.id} key={c.id} className="mb-16 scroll-mt-28">
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${c.tint}`}
              >
                {c.label}
              </span>
              <span className="text-xs text-slate-400 font-bold">{items.length} verbs</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.map((v) => (
                <Link
                  key={v.slug}
                  href={`/verbs/${v.slug}/`}
                  className="group bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden hover:border-blue-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-12px_rgba(15,23,42,0.10)] transition duration-300"
                >
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden relative">
                    <img
                      src={`/img/verbs/verb-${v.slug}.png`}
                      alt={`Robot performing ${v.word.toLowerCase()}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tight text-slate-700">
                      Verb
                    </div>
                    <div className="absolute top-2.5 right-2.5 flex gap-1">
                      {v.loopable && (
                        <span title="Loopable" className="bg-emerald-500 text-white rounded-md w-5 h-5 flex items-center justify-center">
                          <Repeat className="w-3 h-3" />
                        </span>
                      )}
                      {v.rootMotion && (
                        <span title="Root motion" className="bg-blue-500 text-white rounded-md w-5 h-5 flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition">{v.word}</h3>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {v.synonyms.length > 0 ? v.synonyms.join(", ") : v.definition}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
