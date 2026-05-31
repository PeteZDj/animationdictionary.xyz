import Link from "next/link";
import { Award, CheckCircle2, ArrowUpRight } from "lucide-react";
import { ANIMATOR_PROFILES } from "@/data/profiles";

export const metadata = {
  title: "The Animation 300 · AnimationDictionary.xyz",
  description: "An invite-only barracks of the top 300 character animators.",
};

export default function ArmyPage() {
  return (
    <div className="bg-gradient-to-b from-white to-slate-50 text-slate-900 min-h-screen pt-10 md:pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 border border-amber-200 bg-amber-50 px-4 py-1.5 rounded-full text-xs font-bold text-amber-600 uppercase tracking-[0.25em] mb-8">
          <Award className="w-4 h-4" /> Elite Tier
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
          The Animation <span className="text-amber-500">300.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl leading-relaxed mb-16">
          Three hundred hand-picked animators who set the standard. Barracks-certified means no
          jitter, no broken root motion, no half-baked loops — only assets that ship.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <Stat value="300" label="Elite Artists" />
          <Stat value="12k+" label="Unique Actions" />
          <Stat value="99%" label="Dev Satisfaction" />
          <Stat value="0" label="Returns" />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-black">The Roster</h2>
          <span className="text-xs text-slate-400 font-mono">
            showing {ANIMATOR_PROFILES.length} of 300
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
          {ANIMATOR_PROFILES.map((a) => (
            <Link
              key={a.rank}
              href={`/army/${a.username}/`}
              className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-amber-300 hover:shadow-[0_18px_40px_-16px_rgba(15,23,42,0.18)] transition"
            >
              <div className="flex items-center gap-4">
                <div
                  className={
                    "w-10 h-10 rounded-full font-black flex items-center justify-center text-[11px] shadow-lg " +
                    (a.rank <= 3
                      ? "bg-amber-500 text-slate-900 shadow-amber-500/40"
                      : a.rank <= 10
                      ? "bg-blue-500 text-white"
                      : "bg-slate-200 text-slate-700")
                  }
                >
                  {a.rank}
                </div>
                <div>
                  <div className="text-sm font-bold group-hover:text-amber-600 transition">{a.alias}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400">{a.specialty}</div>
                </div>
              </div>
              {a.certified
                ? <CheckCircle2 className="w-5 h-5 text-amber-500" />
                : <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition" />}
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <div className="flex-1">
            <h3 className="text-xl font-black mb-1">Want in?</h3>
            <p className="text-slate-500 text-sm">
              Recruitment is invite-only. Submit a 12-second showreel; the existing 300 vote.
            </p>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-black hover:bg-amber-400 transition"
          >
            Apply for Recruitment <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <div className="text-3xl font-black mb-1">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{label}</div>
    </div>
  );
}
