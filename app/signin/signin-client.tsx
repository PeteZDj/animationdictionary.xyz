"use client";

import { useEffect, useRef, useState } from "react";
import { Github, Mail, ArrowRight, BookOpenText, Check, Lock, User, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: object) => void;
          renderButton: (el: HTMLElement, cfg: object) => void;
        };
      };
    };
  }
}

type Mode = "signin" | "register";

export function SignInClient() {
  const [returnTo, setReturnTo] = useState("/dictionary/");
  const [mode, setMode] = useState<Mode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<null | { devLink?: string }>(null);
  const [busy, setBusy] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("return");
    if (r && r.startsWith("/")) setReturnTo(r);
  }, []);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          setError(null);
          const res = await api.gsiSignIn(response.credential, returnTo);
          if (res.ok) {
            window.location.href = returnTo;
          } else {
            setError(res.error || "Google sign-in failed");
          }
        },
      });
      if (googleBtnRef.current) {
        window.google?.accounts.id.renderButton(googleBtnRef.current, {
          type: "standard",
          text: "continue_with",
          theme: "outline",
          size: "large",
          width: "384",
          logo_alignment: "left",
        });
      }
    };
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, [returnTo]);

  const emailOk = email.includes("@");
  const pwOk = password.length >= 8;
  const canSubmit = emailOk && pwOk && (mode === "signin" || name.trim().length > 0);

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSubmit) return;
    setPwBusy(true);
    const res =
      mode === "register"
        ? await api.register({ email, password, name })
        : await api.login({ email, password });
    setPwBusy(false);
    if (res.ok) {
      window.location.href = returnTo;
      return;
    }
    setError(res.error || "Something went wrong");
  }

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
        <h1 className="text-4xl font-black tracking-tight mb-2">
          {mode === "register" ? "Create your account." : "Welcome back."}
        </h1>
        <p className="text-slate-500 mb-8">
          Claim words, download rigs, upload animations, and earn. One account, any method.
        </p>

        {/* segmented tab */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-sm font-bold">
          {(["register", "signin"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(null); }}
              className={"py-2 rounded-lg transition " + (mode === m ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
            >
              {m === "register" ? "Create account" : "Sign in"}
            </button>
          ))}
        </div>

        {/* email + password */}
        <form onSubmit={submitPassword} className="space-y-3 mb-7">
          {mode === "register" && (
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3">
              <User className="w-4 h-4 text-slate-400 mr-2" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Display name"
                className="bg-transparent outline-none text-sm py-3 w-full placeholder:text-slate-400"
              />
            </div>
          )}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3">
            <Mail className="w-4 h-4 text-slate-400 mr-2" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@studio.com"
              className="bg-transparent outline-none text-sm py-3 w-full placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3">
            <Lock className="w-4 h-4 text-slate-400 mr-2" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              placeholder={mode === "register" ? "Create a password (8+ chars)" : "Your password"}
              className="bg-transparent outline-none text-sm py-3 w-full placeholder:text-slate-400"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={pwBusy || !canSubmit}
            className={"w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition " +
              (pwBusy || !canSubmit
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700")}
          >
            {pwBusy
              ? "Working…"
              : mode === "register"
              ? (<>Create account <ArrowRight className="w-4 h-4" /></>)
              : (<>Sign in <ArrowRight className="w-4 h-4" /></>)}
          </button>
        </form>

        <div className="flex items-center gap-3 my-7">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">or continue with</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="space-y-3">
          <div ref={googleBtnRef} className="flex justify-center min-h-[44px]" />

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
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">or a passwordless link</span>
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
          By continuing you agree to the AnimationDictionary terms. Email + password works against the
          live API; the OAuth and magic-link options activate once their providers are configured.
        </p>
      </div>
    </div>
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
