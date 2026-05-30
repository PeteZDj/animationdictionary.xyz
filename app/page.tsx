import Link from "next/link";
import {
  ArrowUpRight, ChevronRight, Plus,
} from "lucide-react";
import { MotionRibbon } from "@/components/motion-ribbon";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { AssetCard } from "@/components/asset-card";
import { VERBS, CATEGORIES, getVerb } from "@/data/verbs";
import { NOUNS } from "@/data/nouns";
import { MARKETPLACE } from "@/data/marketplace";
import { ANIMATORS } from "@/data/animators";

// Slugs that have finished robot-character images in /public/img/verbs/.
// Append new slugs here as new images come back from magi.
const ROBOT_SHOWCASE = ["walk", "backflip", "punch", "wave", "crouch"];

// Slugs that have finished noun character images in /public/img/nouns/.
const NOUN_SHOWCASE  = ["knight", "wizard", "ninja", "samurai", "archer", "rogue"];

export default function LandingPage() {
  const featuredVerbs   = VERBS.slice(0, 8);
  const featuredNouns   = NOUNS.filter((n) => NOUN_SHOWCASE.includes(n.slug));
  const featuredMarket  = MARKETPLACE.slice(0, 10);
  const showcaseVerbs   = ROBOT_SHOWCASE
    .map((s) => getVerb(s))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  return (
    <>
      {/* ───────────────── HERO (slideshow) ───────────────── */}
      <HeroSlideshow />

      {/* ───────────────── MOTION RIBBON ───────────────── */}
      <section className="py-6 bg-slate-50 border-y border-slate-100">
        <MotionRibbon />
      </section>

      {/* ───────────────── ROBOT SHOWCASE ───────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
              Featured Animations
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              See the language in motion.
            </h2>
            <p className="text-slate-500 font-medium mt-2 max-w-xl">
              Same rig, different verb. Every animation in the dictionary features the same
              recurring "barracks robot," so cross-asset comparisons stay apples-to-apples.
            </p>
          </div>
          <Link
            href="/verbs/"
            className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline whitespace-nowrap"
          >
            Browse all verbs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {showcaseVerbs.map((v) => (
            <Link
              key={v.slug}
              href={`/verbs/${v.slug}/`}
              className="group bg-white border border-slate-100 rounded-[1.75rem] p-3 hover:-translate-y-1 hover:border-blue-500 hover:shadow-[0_24px_60px_-12px_rgba(15,23,42,0.10)] transition duration-300"
            >
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl overflow-hidden mb-4 relative">
                <img
                  src={`/img/verbs/verb-${v.slug}.png`}
                  alt={`Robot performing ${v.word.toLowerCase()}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight text-slate-700">
                  {v.category}
                </div>
                <div className="absolute top-3 right-3 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight">
                  $1
                </div>
              </div>
              <div className="px-1 pb-1">
                <h3 className="font-bold text-base group-hover:text-blue-600 transition">{v.word}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{v.synonyms.slice(0,3).join(", ") || v.definition}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────────── LEXICON ───────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl font-black">The Lexicon</h2>
          <div className="h-px flex-1 bg-slate-200" />
          <Link
            href="/verbs/"
            className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline"
          >
            All verbs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {featuredVerbs.map((v) => (
            <Link
              key={v.slug}
              href={`/verbs/${v.slug}/`}
              className="p-4 bg-white border border-slate-100 rounded-2xl text-left hover:border-blue-500 hover:text-blue-600 transition group font-bold"
            >
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-black">
                {v.category}
              </span>
              {v.word}
              <ArrowUpRight className="w-3 h-3 float-right opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </div>

        {/* category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/verbs/#${c.id}`}
              className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border ${c.tint}`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────────── NOUNS PREVIEW (with images) ───────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">The Subjects.</h2>
            <p className="text-slate-500 font-medium">Nouns are 3D models. Pair them with any animation.</p>
          </div>
          <Link href="/nouns/" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
            All nouns <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredNouns.map((n) => (
            <Link
              key={n.slug}
              href={`/nouns/${n.slug}/`}
              className="group bg-white border border-slate-100 rounded-[1.75rem] p-3 hover:-translate-y-1 hover:border-blue-500 hover:shadow-[0_24px_60px_-12px_rgba(15,23,42,0.10)] transition duration-300"
            >
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl overflow-hidden mb-3 relative">
                <img
                  src={`/img/nouns/noun-${n.slug}.png`}
                  alt={n.word}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight text-slate-700">
                  {n.category}
                </div>
              </div>
              <div className="px-1 pb-1">
                <h3 className="font-bold text-sm group-hover:text-blue-600 transition">{n.word}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{n.polyHint}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────────── MARKETPLACE PREVIEW ───────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Marketplace</h2>
            <p className="text-slate-500 font-medium">
              Animations <span className="text-blue-600 font-bold">$1</span> · Packs from{" "}
              <span className="text-blue-600 font-bold">$5</span> · Cap{" "}
              <span className="text-blue-600 font-bold">$10</span>.
            </p>
          </div>
          <Link
            href="/marketplace/"
            className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline whitespace-nowrap"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {featuredMarket.map((item) => (
            <AssetCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ───────────────── ANIMATION 300 ───────────────── */}
      <section id="army" className="mx-6 mb-20">
        <div className="max-w-7xl mx-auto army-gradient rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-20 -mt-20" />
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-8">
                The Elite Tier
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-none">
                The <br />
                Animation <span className="text-amber-500">300.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
                An invite-only barracks of the top 300 animators in the industry. Hand-keyed,
                barracks-certified, no jitter. The animations that set the standard.
              </p>
              <div className="flex flex-wrap gap-8 mb-10">
                <Stat label="Elite Artists"     value="300" />
                <Stat label="Unique Actions"    value="12k+" />
                <Stat label="Dev Satisfaction"  value="99%" />
              </div>
              <Link
                href="/animation-300/"
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-black hover:bg-amber-400 transition"
              >
                View The Roster <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {ANIMATORS.slice(0, 3).map((a, i) => (
                <div
                  key={a.rank}
                  className={`bg-white/5 border border-white/10 p-6 rounded-3xl ${i % 2 ? "mt-8" : ""} hover:bg-white/10 transition`}
                >
                  <div className={`w-12 h-12 ${i === 0 ? "bg-amber-500 shadow-amber-500/30" : i === 1 ? "bg-blue-500" : "bg-slate-500"} rounded-full mb-4 shadow-lg`} />
                  <p className="text-sm font-bold">{a.alias}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                    {a.specialty}
                  </p>
                </div>
              ))}
              <div className="bg-white/5 border border-white/10 border-dashed p-6 rounded-3xl flex items-center justify-center text-slate-600 hover:bg-white/10 transition">
                <Plus className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-xs text-slate-500 uppercase font-black tracking-wider">{label}</span>
    </div>
  );
}
