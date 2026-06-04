import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Repeat, ChevronRight } from "lucide-react";
import { VERBS, getVerb } from "@/data/verbs";
import { NOUNS } from "@/data/nouns";
import { itemsForVerb } from "@/data/marketplace";
import { AssetCard } from "@/components/asset-card";
import { MediaPanel } from "@/components/media-panel";

export function generateStaticParams() {
  return VERBS.map((v) => ({ verb: v.slug }));
}

export function generateMetadata({ params }: { params: { verb: string } }) {
  const v = getVerb(params.verb);
  if (!v) return { title: "Not found" };
  return {
    title: `${v.word} · AnimationDictionary.xyz`,
    description: v.definition,
  };
}

export default function VerbDetailPage({ params }: { params: { verb: string } }) {
  const v = getVerb(params.verb);
  if (!v) notFound();

  const items = itemsForVerb(v.slug);
  // Models that pair well with this verb
  const compatibleNouns = NOUNS.filter((n) => n.pairsWith.includes(v.slug)).slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* breadcrumb */}
      <nav className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-2">
        <Link href="/verbs/" className="hover:text-blue-600">Verbs</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="uppercase tracking-widest">{v.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900">{v.word}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        {/* left: render still (default) + 3D preview tab */}
        <div>
          <MediaPanel kind="verb" slug={v.slug} alt={`${v.word} animation render`} height={420} />
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-bold">
            <span className="bg-slate-100 px-3 py-2 rounded-lg text-center">
              {v.loopable ? <Repeat className="w-3 h-3 inline mr-1 text-emerald-500" /> : null}
              {v.loopable ? "Loopable" : "Single"}
            </span>
            <span className="bg-slate-100 px-3 py-2 rounded-lg text-center">
              {v.rootMotion ? <Check className="w-3 h-3 inline mr-1 text-blue-500" /> : null}
              {v.rootMotion ? "Root motion" : "In-place"}
            </span>
            <span className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-center uppercase tracking-wide">
              {v.category}
            </span>
          </div>
        </div>

        {/* right: info */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Verb</p>
          <h1 className="text-6xl font-black tracking-tighter mb-4">{v.word}.</h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-6 max-w-prose">{v.definition}</p>

          {v.synonyms.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Synonyms</p>
              <div className="flex flex-wrap gap-2">
                {v.synonyms.map((s) => (
                  <span key={s} className="text-sm font-semibold bg-slate-100 px-3 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Rigs supported</p>
            <div className="flex flex-wrap gap-2">
              {v.rigs.map((r) => (
                <span key={r} className="text-xs font-mono font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md uppercase">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black hover:bg-slate-900 transition shadow-lg shadow-blue-200">
              Buy &middot; $1
            </button>
            <button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition">
              Preview on my rig
            </button>
          </div>
        </div>
      </div>

      {/* Compatible models for this verb */}
      {compatibleNouns.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-black">Best paired with</h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {compatibleNouns.map((n) => (
              <Link
                key={n.slug}
                href={`/nouns/${n.slug}/`}
                className="bg-white border border-slate-100 rounded-2xl p-4 hover:border-blue-500 transition group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 mb-2 flex items-center justify-center font-black text-slate-400">
                  {n.word[0]}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {n.category}
                </div>
                <div className="font-bold text-sm group-hover:text-blue-600 transition">{n.word}</div>
                <ArrowUpRight className="w-3 h-3 float-right -mt-4 opacity-0 group-hover:opacity-100 transition text-blue-600" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Marketplace items featuring this verb */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-black">Animations in stock</h2>
          <span className="text-xs text-slate-400 font-bold">{items.length} listings</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        {items.length === 0 ? (
          <p className="text-slate-400 text-sm">No marketplace listings yet for this verb.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {items.map((it) => (
              <AssetCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
