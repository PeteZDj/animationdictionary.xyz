import Link from "next/link";
import {
  ArrowUpRight, ChevronRight, Award, CheckCircle2,
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

      {/* ───────────────── LEXICON (image grid) ───────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">The Lexicon.</h2>
            <p className="text-slate-500 font-medium mt-1">
              {VERBS.length} verbs across {CATEGORIES.length} categories. Every entry is rendered on
              the same rig.
            </p>
          </div>
          <Link
            href="/verbs/"
            className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline whitespace-nowrap"
          >
            All verbs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-8">
          {VERBS.slice(0, 16).map((v) => (
            <Link
              key={v.slug}
              href={`/verbs/${v.slug}/`}
              className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-blue-500 hover:-translate-y-0.5 transition"
            >
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden relative">
                <img
                  src={`/img/verbs/verb-${v.slug}.png`}
                  alt={v.word}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-2 text-center">
                <h3 className="font-bold text-xs group-hover:text-blue-600 transition truncate">{v.word}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* category chips */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/verbs/#${c.id}`}
              className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border ${c.tint} hover:scale-105 transition`}
            >
              {c.label}
              <span className="ml-2 font-mono opacity-60">
                {VERBS.filter((v) => v.category === c.id).length}
              </span>
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
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2.5rem] bg-slate-950 text-white">
          {/* background image — right-half */}
          <img
            src="/img/hero/hero-army.png"
            alt=""
            aria-hidden="true"
            className="absolute right-0 top-0 h-full w-full md:w-[55%] object-contain object-right opacity-90 pointer-events-none"
          />
          {/* gradient overlays for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/30" />
          <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-amber-500/15 rounded-full blur-[120px]" />

          <div className="relative z-10 p-10 md:p-16 lg:p-20">
            <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-center mb-14">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 border border-amber-500/40 text-amber-400 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.22em] mb-8">
                  <Award className="w-3.5 h-3.5" /> The Elite Tier
                </div>
                <h2 className="font-black tracking-[-0.04em] leading-[0.9] mb-7 text-[clamp(2.75rem,7vw,5.5rem)]">
                  <span className="block">The Animation</span>
                  <span className="block text-amber-500">300.</span>
                </h2>
                <p className="text-slate-300/90 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
                  An invite-only barracks of the world's top 300 character animators. Every asset
                  hand-keyed, barracks-certified, and stress-tested. No jitter, no broken loops —
                  only animations that ship.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/animation-300/"
                    className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    View the Roster <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/animation-300/"
                    className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/15 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-white/15 transition"
                  >
                    Apply for Recruitment
                  </Link>
                </div>
              </div>

              <div className="hidden md:block" />
            </div>

            {/* Stats row — full width */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              <Stat value="300"  label="Elite Artists" />
              <Stat value="12k+" label="Unique Actions" />
              <Stat value="99%"  label="Dev Satisfaction" />
              <Stat value="$0"   label="Refunds Issued" />
            </div>

            {/* Roster strip — actual animators */}
            <div className="pt-10 border-t border-white/10">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-400">Featured Operators</span>
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] font-mono text-white/40">
                  showing 6 of {ANIMATORS.length}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {ANIMATORS.slice(0, 6).map((a) => (
                  <div
                    key={a.rank}
                    className="bg-white/[0.04] border border-white/10 p-4 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={
                          "w-9 h-9 rounded-full font-black flex items-center justify-center text-[11px] " +
                          (a.rank <= 3
                            ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/40"
                            : "bg-white/10 text-white border border-white/15")
                        }
                      >
                        {a.rank}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-sm font-bold leading-tight">{a.alias}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                      {a.specialty}
                    </p>
                  </div>
                ))}
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
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4">
      <span className="block text-2xl md:text-3xl font-black tracking-tight">{value}</span>
      <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-[0.18em] mt-1">{label}</span>
    </div>
  );
}
