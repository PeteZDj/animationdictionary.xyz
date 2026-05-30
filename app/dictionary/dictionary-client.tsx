"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenText,
  Search,
  Check,
  Plus,
  X,
  Sparkles,
  Film,
  PlusCircle,
  Download,
  ArrowUpRight,
  Tag,
  PartyPopper,
} from "lucide-react";
import { LEXICON, COVERAGE, type LexEntry } from "@/data/dictionary";

type Tab = "all" | "covered" | "open";
const RIG_OPTIONS = ["UE5", "Unity", "Mixamo", "Maya", "Blender", "Metahuman"];

function pctText(frac: number, digits = 2) {
  return (frac * 100).toFixed(digits) + "%";
}

export function DictionaryClient() {
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [claim, setClaim] = useState<LexEntry | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LEXICON.filter((e) => {
      if (tab === "covered" && !e.covered) return false;
      if (tab === "open" && e.covered) return false;
      if (q && !e.word.includes(q)) return false;
      return true;
    });
  }, [tab, query]);

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 text-slate-900 min-h-screen pt-10 md:pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Heading ─────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-4 py-1.5 rounded-full text-xs font-bold text-blue-600 uppercase tracking-[0.25em] mb-8">
          <BookOpenText className="w-4 h-4" /> Live Coverage
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
          Animate the whole <span className="text-blue-600">dictionary.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl leading-relaxed mb-12">
          The mission is simple and absurd: a downloadable animation for every word in the English
          language. Here is how far we have come — and the words still open for anyone to claim,
          rig, and animate.
        </p>

        {/* ── Coverage panel ──────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-sm p-7 md:p-9">
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                  Core action lexicon
                </div>
                <div className="text-4xl md:text-5xl font-black tabular-nums">
                  {pctText(COVERAGE.pctLexicon, 0)}
                </div>
              </div>
              <div className="text-right text-sm font-mono text-slate-400">
                {COVERAGE.lexiconCovered} / {COVERAGE.lexiconSize} words
              </div>
            </div>
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                style={{ width: pctText(COVERAGE.pctLexicon) }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-3">
              The everyday verbs people search for most. {COVERAGE.lexiconOpen} still open to claim.
            </p>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl shadow-sm p-7 md:p-9 flex flex-col justify-center">
            <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
              Whole English dictionary
            </div>
            <div className="text-4xl md:text-5xl font-black tabular-nums">
              {pctText(COVERAGE.pctDictionary, 3)}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              {COVERAGE.coveredWords.toLocaleString()} / {COVERAGE.dictionaryTotal.toLocaleString()} words
            </p>
          </div>
        </div>

        {/* ── Stat strip ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Stat icon={Check}      value={COVERAGE.coveredWords.toLocaleString()} label="Words Covered" />
          <Stat icon={Film}       value={COVERAGE.animations.toLocaleString()}   label="Animations Available" accent />
          <Stat icon={PlusCircle} value={COVERAGE.lexiconOpen.toLocaleString()}  label="Words Open to Claim" />
          <Stat icon={Sparkles}   value="$1"                                     label="Per Animation" accent />
        </div>

        {/* ── Search + filter ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <h2 className="text-2xl font-black">The Lexicon</h2>
          <span className="text-xs text-slate-400 font-mono">
            showing {filtered.length} of {COVERAGE.lexiconSize}
          </span>
          <div className="h-px flex-1 bg-slate-200 min-w-[2rem]" />
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a word, e.g. jump..."
              className="bg-transparent outline-none text-sm py-2.5 w-48 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {([
            { id: "all",     label: "All",            n: COVERAGE.lexiconSize },
            { id: "covered", label: "Animated",       n: COVERAGE.lexiconCovered },
            { id: "open",    label: "Open to claim",  n: COVERAGE.lexiconOpen },
          ] as { id: Tab; label: string; n: number }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "px-4 py-2 rounded-full text-sm font-bold border transition " +
                (tab === t.id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-400")
              }
            >
              {t.label}
              <span className="ml-2 text-[10px] font-mono opacity-60">{t.n}</span>
            </button>
          ))}
        </div>

        {/* ── Word grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-16">
          {filtered.map((e) => (
            <WordCard key={e.word} entry={e} onClaim={() => setClaim(e)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-400 py-16 text-sm">
            No words match that search.
          </p>
        )}

        {/* ── How it works ────────────────────────────────────────── */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-8 md:p-12">
          <h2 className="text-3xl font-black tracking-tight mb-2">Animation in bulk, by the crowd.</h2>
          <p className="text-slate-500 max-w-2xl mb-10">
            Pick a word, download the matching 3D rig, animate it, and tag every variation.
            Each clip lists at <span className="font-bold text-slate-900">$1</span>. The more words
            we cover, the more useful the dictionary — and the more you earn.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <Step n="1" title="Claim a word" body="Find an open word and reserve it. Or add a fresh variation to a word that already exists." />
            <Step n="2" title="Download the rig" body="Grab the standard barracks rig in your engine — UE5, Unity, Mixamo, Maya, Blender, Metahuman." />
            <Step n="3" title="Animate + tag" body="Animate the action and tag every nuance: scared jump, back jump, side jump, double jump." />
            <Step n="4" title="Ship + earn" body="Submit for barracks review. Approved clips go live at $1 and the word turns green." />
          </div>
        </div>
      </div>

      {claim && <ClaimModal entry={claim} onClose={() => setClaim(null)} />}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function Stat({ icon: Icon, value, label, accent }: { icon: any; value: string; label: string; accent?: boolean }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <Icon className={"w-5 h-5 mb-3 " + (accent ? "text-blue-600" : "text-slate-400")} />
      <div className="text-3xl font-black mb-1 tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{label}</div>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center mb-4">
        {n}
      </div>
      <h3 className="font-black mb-1">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
    </div>
  );
}

function WordCard({ entry, onClaim }: { entry: LexEntry; onClaim: () => void }) {
  if (entry.covered) {
    return (
      <div className="group bg-white border border-emerald-200 rounded-2xl p-4 hover:shadow-[0_18px_40px_-18px_rgba(16,185,129,0.35)] transition flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <Check className="w-3.5 h-3.5" /> Animated
          </span>
          <span className="text-[10px] font-mono text-slate-400">{entry.category}</span>
        </div>
        <div className="text-lg font-black capitalize mb-1">{entry.word}</div>
        <div className="text-xs text-slate-500 mb-4">
          <span className="font-bold text-slate-900">{entry.animations}</span> animations
        </div>
        <div className="mt-auto flex gap-2">
          <Link
            href={`/verbs/${entry.slug}/`}
            className="flex-1 text-center py-2 rounded-lg text-xs font-black bg-slate-900 text-white hover:bg-blue-600 transition"
          >
            Browse
          </Link>
          <button
            onClick={onClaim}
            title="Add a tagged variation"
            className="w-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <button
      onClick={onClaim}
      className="group text-left bg-white border border-dashed border-slate-200 rounded-2xl p-4 hover:border-blue-400 hover:bg-blue-50/40 transition flex flex-col"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Open</span>
      </div>
      <div className="text-lg font-black capitalize mb-1">{entry.word}</div>
      <div className="text-xs text-slate-400 mb-4">No animation yet — be the first.</div>
      <span className="mt-auto inline-flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-black bg-blue-600 text-white group-hover:bg-blue-700 transition">
        <Plus className="w-4 h-4" /> Animate this
      </span>
    </button>
  );
}

function ClaimModal({ entry, onClose }: { entry: LexEntry; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rigs, setRigs] = useState<string[]>(["UE5"]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [done, setDone] = useState(false);

  function toggleRig(r: string) {
    setRigs((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }
  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }
  const canSubmit = name.trim() && email.includes("@") && rigs.length > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
              <PartyPopper className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black mb-2 capitalize">“{entry.word}” claimed</h3>
            <p className="text-slate-500 text-sm mb-6">
              We’ve reserved <span className="font-bold capitalize">{entry.word}</span> for you and emailed your rig
              kit + upload link{tags.length > 0 && <> with {tags.length} tag{tags.length > 1 ? "s" : ""}</>}.
            </p>
            <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-sm hover:bg-blue-600 transition">
              <Download className="w-4 h-4" /> Download rig kit
            </button>
            <p className="text-[11px] text-slate-400 mt-4">
              Preview flow — accounts, real rig downloads, and uploads land with the API.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                {entry.covered ? "Add a variation" : "Claim & animate"}
              </div>
              <h3 className="text-3xl font-black leading-none capitalize">{entry.word}</h3>
              <p className="text-slate-500 text-sm mt-2">
                {entry.covered
                  ? <>Currently <span className="font-bold text-slate-900">{entry.animations}</span> animations. Add your own tagged take.</>
                  : "No animation yet — claim it, download the rig, and be the first."}
              </p>
            </div>

            <div className="space-y-4">
              <Field label="Your name">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Animator"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
              </Field>
              <Field label="Email">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@studio.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
              </Field>

              <Field label="Target rigs">
                <div className="flex flex-wrap gap-2">
                  {RIG_OPTIONS.map((r) => (
                    <button key={r} type="button" onClick={() => toggleRig(r)}
                      className={"px-3 py-1.5 rounded-full text-xs font-bold border transition " +
                        (rigs.includes(r) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400")}>
                      {r}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Tags — every variation counts">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3">
                    <Tag className="w-4 h-4 text-slate-400 mr-2" />
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                      placeholder={`scared ${entry.word}, back ${entry.word}, side ${entry.word}...`}
                      className="bg-transparent outline-none text-sm py-2.5 w-full placeholder:text-slate-400"
                    />
                  </div>
                  <button type="button" onClick={addTag}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-bold transition">Add</button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-bold">
                        {t}
                        <button onClick={() => setTags((prev) => prev.filter((x) => x !== t))}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </Field>
            </div>

            <button
              disabled={!canSubmit}
              onClick={() => setDone(true)}
              className={"mt-7 w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition " +
                (canSubmit ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95" : "bg-slate-100 text-slate-400 cursor-not-allowed")}
            >
              <Download className="w-4 h-4" /> Claim & get the rig kit
            </button>
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              Preview — no account needed yet. Sign-up, rig downloads & uploads arrive with the API.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">{label}</label>
      {children}
    </div>
  );
}
