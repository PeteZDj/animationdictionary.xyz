import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, CalendarDays, ShieldCheck, Boxes, Film, Sparkles } from "lucide-react";
import { ANIMATOR_PROFILES, getAnimatorByUsername, animationsByAnimatorRank } from "@/data/profiles";
import { AssetCard } from "@/components/asset-card";

export function generateStaticParams() {
  return ANIMATOR_PROFILES.map((p) => ({ username: p.username }));
}

export function generateMetadata({ params }: { params: { username: string } }) {
  const p = getAnimatorByUsername(params.username);
  if (!p) return { title: "Animator not found" };
  return {
    title: `${p.alias} · The Animation 300`,
    description: p.bio,
  };
}

function Stat({ icon: Icon, value, label }: { icon: any; value: number | string; label: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4">
      <Icon className="w-4 h-4 text-emerald-600 mb-2" />
      <div className="text-2xl font-black tracking-tight">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
    </div>
  );
}

export default function AnimatorProfilePage({ params }: { params: { username: string } }) {
  const p = getAnimatorByUsername(params.username);
  if (!p) notFound();

  const items = animationsByAnimatorRank(p.rank);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-xs font-bold text-slate-400 mb-8 flex items-center gap-2">
        <Link href="/animation-300/" className="hover:text-emerald-600">The Animation 300</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900">{p.alias}</span>
      </nav>

      {/* header */}
      <div className="flex flex-col sm:flex-row gap-8 items-start mb-12">
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center text-3xl font-black text-white shrink-0 shadow-lg"
          style={{ backgroundImage: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
        >
          {p.initials}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              Rank #{p.rank} · Animation 300
            </span>
            {p.certified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3 h-3" /> Barracks-certified
              </span>
            )}
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">{p.alias}.</h1>
          <p className="text-emerald-700 font-bold text-sm mb-4">{p.specialty}</p>
          <p className="text-slate-500 leading-relaxed max-w-prose mb-5">{p.bio}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" />{p.location}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-slate-400" />Joined {p.joinedYear}</span>
            <span className="font-mono text-slate-400">{p.handle}</span>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        <Stat icon={Film} value={p.stats.animations} label="Animations created" />
        <Stat icon={Boxes} value={p.stats.packs} label="Packs shipped" />
        <Stat icon={Sparkles} value={p.stats.verbsCovered} label="Verbs covered" />
        <Stat icon={ShieldCheck} value={p.stats.certified} label="Certified clips" />
      </div>

      {/* their animations */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-black">Animations by {p.alias}</h2>
          <span className="text-xs text-slate-400 font-bold">{items.length} listings</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        {items.length === 0 ? (
          <p className="text-slate-400 text-sm">No marketplace listings credited yet.</p>
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
