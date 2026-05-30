"use client";

import { useEffect, useState } from "react";
import { Github, Mail, ArrowRight, BookOpenText, Check } from "lucide-react";
import { api } from "@/lib/api";

export function SignInClient() {
  const [returnTo, setReturnTo] = useState("/dictionary/");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState<null | { devLink?: string }>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("return");
    if (r && r.startsWith("/")) setReturnTo(r);
  }, []);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setBusy(true);
    const res = await api.startEmail(email, returnTo);
    setBusy(false);
    setSent({ devLink: res.devLink });
  }

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 text-slate-900 min-h-screen pt-16 pb-24">
      <div className="max-w-md mx-auto px-6">
        <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-4 py-1.5 rounded-full text-xs font-bold text-blue-600 uppercase tracking-[0.25em] mb-8">
          <BookOpenText className="w-4 h-4" /> Join the dictionary
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Sign in to animate.</h1>
        <p className="text-slate-500 mb-10">
          Claim words, download rigs, upload animations, and earn. One account, any method.
        </p>

        <div className="space-y-3">
          <a href={api.signInUrl("google", returnTo)}
             className="flex items-center gap-3 w-full border border-slate-200 bg-white rounded-xl px-4 py-3 font-bold hover:border-slate-400 hover:shadow-sm transition">
            <GoogleMark /> Continue with Google
            <ArrowRight className="w-4 h-4 ml-auto text-slate-300" />
          </a>

          <a href={api.signInUrl("github", returnTo)}
             className="flex items-center gap-3 w-full border border-slate-200 bg-white rounded-xl px-4 py-3 font-bold hover:border-slate-400 hover:shadow-sm transition">
            <Github className="w-5 h-5" /> Continue with GitHub
            <ArrowRight className="w-4 h-4 ml-auto text-slate-300" />
          </a>

          <a href={api.signInUrl("afrosoftware", returnTo)}
             className="flex items-center gap-3 w-full border border-slate-300 bg-slate-900 text-white rounded-xl px-4 py-3 font-bold hover:bg-slate-800 transition">
            <AfroMark /> Sign in with AfroSoftware
            <ArrowRight className="w-4 h-4 ml-auto text-white/40" />
          </a>
        </div>

        <div className="flex items-center gap-3 my-7">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {sent ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-2 font-black text-emerald-700 mb-1">
              <Check className="w-5 h-5" /> Check your inbox
            </div>
            <p className="text-sm text-emerald-700/80">
              We sent a sign-in link to <span className="font-bold">{email}</span>.
            </p>
            {sent.devLink && (
              <a href={sent.devLink} className="text-xs font-mono text-blue-600 underline break-all mt-2 block">
                Dev link (no mail provider configured): {sent.devLink}
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={sendLink} className="space-y-3">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3">
              <Mail className="w-4 h-4 text-slate-400 mr-2" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@studio.com"
                className="bg-transparent outline-none text-sm py-3 w-full placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={busy || !email.includes("@")}
              className={"w-full py-3 rounded-xl font-black text-sm transition " +
                (busy || !email.includes("@")
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700")}
            >
              {busy ? "Sending…" : "Email me a sign-in link"}
            </button>
          </form>
        )}

        <p className="text-[11px] text-slate-400 mt-8 text-center leading-relaxed">
          By continuing you agree to the AnimationDictionary terms. Sign-in requires the API
          (Cloudflare Worker) to be live; until then these buttons return a friendly “not configured” notice.
        </p>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

function AfroMark() {
  return (
    <span className="grid grid-cols-2 gap-0.5 w-5 h-5" aria-hidden>
      <span className="bg-amber-400 rounded-[2px]" />
      <span className="bg-rose-400 rounded-[2px]" />
      <span className="bg-emerald-400 rounded-[2px]" />
      <span className="bg-sky-400 rounded-[2px]" />
    </span>
  );
}
