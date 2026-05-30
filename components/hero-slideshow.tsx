"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles, Award, Library, Upload,
  ChevronLeft, ChevronRight, ArrowRight,
} from "lucide-react";
import { SearchBar } from "./search-bar";

type Accent = "amber" | "blue";

interface Slide {
  image: string;
  badge: string;
  badgeIcon: React.ElementType;
  badgeAccent: Accent;
  headline: [string, string];
  headlineAccent: Accent;
  tagline: React.ReactNode;
  cta?: { label: string; href: string };
  showSearch?: boolean;
}

const SLIDES: Slide[] = [
  {
    image: "/img/hero/hero-vocab.png",
    badge: "The Language of Motion",
    badgeIcon: Sparkles,
    badgeAccent: "amber",
    headline: ["Motion", "Vocabulary."],
    headlineAccent: "blue",
    tagline: (
      <>
        Search 10,000+ hand-keyed and mo-cap actions. Rigged for UE5, Unity,
        and Metahuman. <span className="text-white font-bold">$1</span> each.
      </>
    ),
    showSearch: true,
  },
  {
    image: "/img/hero/hero-army.png",
    badge: "The Elite Tier",
    badgeIcon: Award,
    badgeAccent: "amber",
    headline: ["Animation", "300."],
    headlineAccent: "amber",
    tagline: (
      <>
        Hand-picked. Barracks-certified. No jitter, no broken loops — only
        animations that ship. Submit a twelve-second reel.
      </>
    ),
    cta: { label: "Apply for Recruitment", href: "/animation-300/" },
  },
  {
    image: "/img/hero/hero-stockpile.png",
    badge: "Pricing Manifesto",
    badgeIcon: Library,
    badgeAccent: "blue",
    headline: ["10,000+", "actions."],
    headlineAccent: "blue",
    tagline: (
      <>
        Every animation <span className="text-white font-bold">$1</span>.
        Combat and locomotion packs <span className="text-white font-bold">$5</span>.
        Anything bigger capped at <span className="text-white font-bold">$10</span>. Forever.
      </>
    ),
    cta: { label: "Open Marketplace", href: "/marketplace/" },
  },
  {
    image: "/img/hero/hero-upload.png",
    badge: "For Animators",
    badgeIcon: Upload,
    badgeAccent: "blue",
    headline: ["Upload &", "earn."],
    headlineAccent: "blue",
    tagline: (
      <>
        Sell your motion library to indie devs and AAA studios. Keep{" "}
        <span className="text-white font-bold">70%</span> per sale. Payouts weekly.
      </>
    ),
    cta: { label: "Become a Seller", href: "/animation-300/" },
  },
];

const HEADLINE_ACCENT: Record<Accent, string> = {
  amber: "text-amber-400",
  blue:  "text-blue-400",
};
const BADGE_ACCENT: Record<Accent, string> = {
  amber: "border-amber-500/40 text-amber-400",
  blue:  "border-blue-500/40 text-blue-400",
};
const CTA_STYLE: Record<Accent, string> = {
  amber: "bg-amber-500 text-slate-900 hover:bg-amber-400",
  blue:  "bg-white text-slate-900 hover:bg-blue-100",
};

const ADVANCE_MS = 6000;

export function HeroSlideshow() {
  const [idx, setIdx]       = useState(0);
  const [paused, setPaused] = useState(false);
  // tick is bumped each interval so the progress bar can reset its CSS animation
  const [tick, setTick]     = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % SLIDES.length);
      setTick((t) => t + 1);
    }, ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const goto = (i: number) => { setIdx(((i % SLIDES.length) + SLIDES.length) % SLIDES.length); setTick((t) => t + 1); };
  const next = () => goto(idx + 1);
  const prev = () => goto(idx - 1);

  return (
    <section
      className="relative w-full -mt-20 h-[92vh] min-h-[660px] max-h-[920px] overflow-hidden bg-slate-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Stacked background images — object-contain so the robot stays full-height. */}
      {SLIDES.map((s, i) => (
        <img
          key={s.image}
          src={s.image}
          alt=""
          aria-hidden="true"
          className={
            "absolute inset-0 w-full h-full object-contain object-right transition-opacity duration-[900ms] ease-out " +
            (i === idx ? "opacity-100" : "opacity-0")
          }
        />
      ))}

      {/* Soft atmospheric blur ring around the robot, masks any harsh edge from object-contain */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_55%,rgba(37,99,235,0.18),transparent_55%)]" />

      {/* Readability gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/0" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-transparent to-slate-950/40" />

      {/* Content overlays — each slide layered absolutely so transitions don't reflow */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center pt-20">
        <div className="relative w-full">
          {SLIDES.map((s, i) => {
            const Icon = s.badgeIcon;
            const active = i === idx;
            return (
              <div
                key={s.image}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${SLIDES.length}`}
                aria-hidden={!active}
                className={
                  "max-w-xl text-white absolute inset-x-0 transition-all duration-700 ease-out " +
                  (active
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none")
                }
              >
                <div
                  className={
                    "inline-flex items-center gap-2 bg-white/[0.07] border backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-7 " +
                    BADGE_ACCENT[s.badgeAccent]
                  }
                >
                  <Icon className="w-4 h-4" /> {s.badge}
                </div>

                <h1 className="font-black tracking-[-0.04em] mb-6 leading-[0.9] text-[clamp(2.75rem,7vw,6.5rem)]">
                  <span className="block">{s.headline[0]}</span>
                  <span className={"block " + HEADLINE_ACCENT[s.headlineAccent]}>{s.headline[1]}</span>
                </h1>

                <p className="text-slate-300/90 text-base md:text-lg max-w-lg mb-8 leading-relaxed">
                  {s.tagline}
                </p>

                {s.showSearch ? (
                  <SearchBar />
                ) : s.cta ? (
                  <Link
                    href={s.cta.href}
                    className={
                      "inline-flex items-center gap-2 px-7 py-4 rounded-xl font-black transition shadow-lg active:scale-95 " +
                      CTA_STYLE[s.headlineAccent]
                    }
                  >
                    {s.cta.label} <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom controls bar */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        {/* progress bar — restarts on every tick */}
        <div className="h-0.5 w-full bg-white/5">
          <div
            key={tick}
            className={
              "h-full origin-left " +
              (paused ? "bg-white/20" : "bg-white/60")
            }
            style={
              paused
                ? { transform: "scaleX(0)" }
                : {
                    animation: `magi-progress ${ADVANCE_MS}ms linear forwards`,
                    transform: "scaleX(0)",
                  }
            }
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-white/70 text-xs font-mono">
          {/* slide indicators (clickable) */}
          <div className="flex items-center gap-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goto(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === idx ? "true" : undefined}
                className={
                  "transition-all rounded-full " +
                  (i === idx
                    ? "w-8 h-1 bg-white"
                    : "w-2.5 h-1 bg-white/25 hover:bg-white/60")
                }
              />
            ))}
            <span className="font-bold ml-3 text-white">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="text-white/30">/</span>
            <span className="text-white/40">{String(SLIDES.length).padStart(2, "0")}</span>
          </div>

          {/* prev/next arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur text-white hover:bg-white/15 transition flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur text-white hover:bg-white/15 transition flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* keyframes for the slide-progress bar (scoped via styled-jsx not available in static export,
          so the animation is defined globally in globals.css via @layer utilities) */}
    </section>
  );
}
