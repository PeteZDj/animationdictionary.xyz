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
        and Metahuman. <span className="text-white font-semibold">$1</span> each.
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
        Every animation <span className="text-white font-semibold">$1</span>.
        Packs <span className="text-white font-semibold">$5</span>.
        Anything bigger capped at <span className="text-white font-semibold">$10</span>. Forever.
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
        <span className="text-white font-semibold">70%</span> per sale. Payouts weekly.
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

const ADVANCE_MS = 6500;

export function HeroSlideshow() {
  const [idx, setIdx]       = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick]     = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % SLIDES.length);
      setTick((t) => t + 1);
    }, ADVANCE_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  const goto = (i: number) => {
    setIdx(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setTick((t) => t + 1);
  };
  const next = () => goto(idx + 1);
  const prev = () => goto(idx - 1);

  return (
    <section
      className="relative w-full -mt-20 h-[88vh] min-h-[640px] max-h-[880px] overflow-hidden bg-slate-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Background images — object-contain so robots show full-height. */}
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

      {/* Atmospheric glow behind the robot */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_55%,rgba(37,99,235,0.16),transparent_55%)]" />

      {/* Readability gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/0" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/70 to-transparent" />

      {/* Content overlays — generous bottom padding so the controls bar
          doesn't visually compete with the tagline. */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center pt-24 pb-36">
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
                    : "opacity-0 translate-y-3 pointer-events-none")
                }
              >
                <div
                  className={
                    "inline-flex items-center gap-2 bg-white/[0.06] border backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.22em] mb-7 " +
                    BADGE_ACCENT[s.badgeAccent]
                  }
                >
                  <Icon className="w-3.5 h-3.5" /> {s.badge}
                </div>

                <h1 className="font-black tracking-[-0.035em] mb-6 leading-[0.95] text-[clamp(2.25rem,5.5vw,5rem)]">
                  <span className="block">{s.headline[0]}</span>
                  <span className={"block " + HEADLINE_ACCENT[s.headlineAccent]}>
                    {s.headline[1]}
                  </span>
                </h1>

                <p className="text-slate-300/90 text-[15px] md:text-base max-w-md mb-8 leading-relaxed">
                  {s.tagline}
                </p>

                {s.showSearch ? (
                  <SearchBar />
                ) : s.cta ? (
                  <Link
                    href={s.cta.href}
                    className={
                      "inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition shadow-lg active:scale-95 " +
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

      {/* Bottom controls — no full-width line. Progress lives inside the active dot. */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Indicators */}
          <div className="flex items-center gap-3 text-white/70 text-xs font-mono">
            {SLIDES.map((_, i) => {
              const active = i === idx;
              return (
                <button
                  key={i}
                  onClick={() => goto(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active ? "true" : undefined}
                  className={
                    "h-1 rounded-full overflow-hidden transition-all " +
                    (active ? "w-10 bg-white/20" : "w-2.5 bg-white/25 hover:bg-white/60")
                  }
                >
                  {active ? (
                    <span
                      key={tick}
                      className="block h-full bg-white origin-left"
                      style={
                        paused
                          ? { transform: "scaleX(0)" }
                          : { animation: `magi-progress ${ADVANCE_MS}ms linear forwards`, transform: "scaleX(0)" }
                      }
                    />
                  ) : null}
                </button>
              );
            })}
            <span className="font-bold ml-4 text-white">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="text-white/30">/</span>
            <span className="text-white/40">{String(SLIDES.length).padStart(2, "0")}</span>
          </div>

          {/* Prev / next arrows */}
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
    </section>
  );
}
