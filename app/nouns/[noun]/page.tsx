import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { NOUNS, getNoun } from "@/data/nouns";
import { VERBS, getVerb } from "@/data/verbs";
import { itemsForNoun } from "@/data/marketplace";
import { AssetCard } from "@/components/asset-card";
import { MediaPanel } from "@/components/media-panel";

export function generateStaticParams() {
  return NOUNS.map((n) => ({ noun: n.slug }));
}

export function generateMetadata({ params }: { params: { noun: string } }) {
  const n = getNoun(params.noun);
  if (!n) return { title: "Not found" };
  return {
    title: `${n.word} · AnimationDictionary.xyz`,
    description: n.definition,
  };
}

export default function NounDetailPage({ params }: { params: { noun: string } }) {
  const n = getNoun(params.noun);
  if (!n) notFound();

  const animations = n.pairsWith
    .map((slug) => getVerb(slug))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const items = itemsForNoun(n.slug);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-2">
        <Link href="/nouns/" className="hover:text-blue-600">Nouns</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="uppercase tracking-widest">{n.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900">{n.word}</span>
      </nav>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 mb-16">
        {/* left: render still (default) + 3D preview tab for the MODEL */}
        <div>
          <MediaPanel kind="noun" slug={n.slug} alt={`${n.word} model render`} height={460} />
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-bold">
            <span className="bg-slate-100 px-3 py-2 rounded-lg text-center uppercase tracking-wide">
              {n.category}
            </span>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg text-center font-mono">
              {n.formats.join(" · ")}
            </span>
            <span className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-center font-mono">
              {n.polyHint ?? "—"}
            </span>
          </div>
        </div>

        {/* right: info */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Noun</p>
          <h1 className="text-6xl font-black tracking-tighter mb-4">{n.word}.</h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-prose">{n.definition}</p>

          <div className="flex gap-3 mb-8">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black hover:bg-slate-900 transition shadow-lg shadow-blue-200">
              Buy model &middot; $1
            </button>
            <button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition">
              Retarget animation
            </button>
          </div>

          {/* animation picker — the section below or to the right */}
          {animations.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-lg font-black">Choose an animation</h2>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {animations.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/verbs/${a.slug}/`}
                    className="group p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-500 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {a.category}
                      </div>
                      <div className="font-bold text-sm group-hover:text-blue-600 transition">{a.word}</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Marketplace listings for this model */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-black">Listings</h2>
          <span className="text-xs text-slate-400 font-bold">{items.length} for this model</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        {items.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No marketplace listings yet — this model is awaiting upload by a verified 300 animator.
          </p>
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
