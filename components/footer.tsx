"use client";

import Link from "next/link";
import {
  Box, Twitter, Instagram, Github, Youtube, Mail, MapPin, Download,
} from "lucide-react";

const COLS = [
  {
    title: "Browse",
    links: [
      { label: "Verbs",       href: "/verbs/" },
      { label: "Nouns",       href: "/nouns/" },
      { label: "Marketplace", href: "/marketplace/" },
      { label: "Dictionary",  href: "/dictionary/" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "The Animation 300", href: "/animation-300/" },
      { label: "AI-300 Army",        href: "/ai300/" },
      { label: "Recruitment",        href: "/animation-300/" },
      { label: "Discord",            href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About",   href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Blog",    href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms",   href: "#" },
    ],
  },
];

const SOCIAL = [
  { Icon: Twitter,   label: "Twitter",   href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Youtube,   label: "YouTube",   href: "#" },
  { Icon: Github,    label: "GitHub",    href: "https://github.com/PeteZDj/animationdictionary.xyz" },
];

export function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-300 mt-20 overflow-hidden">
      {/* subtle ambient glow */}
      <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand column */}
          <div className="col-span-2 max-w-sm">
            <Link href="/" className="flex items-center gap-3 group mb-5">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <Box className="w-6 h-6" strokeWidth={2.4} />
              </div>
              <span className="text-xl font-extrabold tracking-tight italic text-white">
                Animation<span className="text-blue-400">Dictionary</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The Language of Motion. A semantic marketplace for 3D animations and rigged
              character models. <span className="text-white font-semibold">$1</span> per animation,
              packs capped at <span className="text-white font-semibold">$10</span>.
            </p>

            {/* Newsletter */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2 mb-6"
              aria-label="Newsletter signup"
            >
              <div className="flex-1 flex items-center bg-white/[0.04] border border-white/10 rounded-lg pl-3">
                <Mail className="w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="hello@yourstudio.com"
                  className="bg-transparent outline-none text-sm py-2.5 px-2 w-full text-white placeholder:text-slate-500"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition"
              >
                Notify me
              </button>
            </form>

            {/* Social */}
            <div className="flex gap-2">
              {SOCIAL.map(({ Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/15 hover:text-white transition"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>

            {/* Download Android app (APK) */}
            <a
              href="/downloads/animationdictionary-android.apk"
              download
              className="mt-5 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition"
            >
              <Download className="w-4 h-4" /> Get the <span className="underline underline-offset-2">Android app</span>
            </a>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-300 hover:text-white transition"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Big wordmark */}
        <div className="relative border-t border-white/5 mb-8 pb-2">
          <p
            aria-hidden="true"
            className="absolute -top-8 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-white/[0.03] font-black tracking-tighter italic"
            style={{ fontSize: "clamp(5rem, 14vw, 14rem)", lineHeight: 1 }}
          >
            animation.dictionary
          </p>
        </div>

        {/* Bottom row */}
        <div className="relative z-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            &copy; 2026 AnimationDictionary.xyz · Developed by{" "}
            <span className="text-white font-semibold">AfroSoftware Limited</span>
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Nairobi · Toronto</span>
            <span className="font-mono text-slate-600">v0.1.0</span>
            <span className="font-mono text-emerald-500">● status: operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
