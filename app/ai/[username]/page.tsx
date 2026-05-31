import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight, Heart, Zap, Shield, Crosshair, LifeBuoy, HeartPulse,
  Sparkles, Star, ArrowUpRight, type LucideIcon,
} from "lucide-react";
import { BOT_PROFILES, getBotByUsername } from "@/data/profiles";
import type { BotClass } from "@/data/ai300";

export function generateStaticParams() {
  return BOT_PROFILES.map((p) => ({ username: p.username }));
}

export function generateMetadata({ params }: { params: { username: string } }) {
  const b = getBotByUsername(params.username);
  if (!b) return { title: "Unit not found" };
  return {
    title: `${b.name} · AI-300 Army`,
    description: `${b.bot_class} unit. Health ${b.health}, damage ${b.damage}, armor ${b.armor}.`,
  };
}

const CLASS_META: Record<BotClass, { icon: LucideIcon; chip: string; ring: string }> = {
  Assault:  { icon: Crosshair,  chip: "bg-red-50 text-red-700 border-red-200",         ring: "ring-red-400/50" },
  Defender: { icon: Shield,     chip: "bg-blue-50 text-blue-700 border-blue-200",       ring: "ring-blue-400/50" },
  Support:  { icon: LifeBuoy,   chip: "bg-emerald-50 text-emerald-700 border-emerald-200", ring: "ring-emerald-400/50" },
  Medic:    { icon: HeartPulse, chip: "bg-rose-50 text-rose-700 border-rose-200",       ring: "ring-rose-400/50" },
  Witch:    { icon: Sparkles,   chip: "bg-purple-50 text-purple-700 border-purple-200", ring: "ring-purple-400/50" },
  Captain:  { icon: Star,       chip: "bg-amber-50 text-amber-700 border-amber-200",    ring: "ring-amber-400/50" },
};

function StatBar({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
        <span className="flex items-center gap-1.5 text-slate-500 uppercase tracking-widest">
          <Icon className="w-3.5 h-3.5" /> {label}
        </span>
        <span className="font-mono text-slate-900">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={"h-full rounded-full " + color} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function BotProfilePage({ params }: { params: { username: string } }) {
  const b = getBotByUsername(params.username);
  if (!b) notFound();

  const meta = CLASS_META[b.bot_class];
  const Icon = meta.icon;
  const power = b.health + b.damage + b.armor;
  const squad = BOT_PROFILES.filter((p) => p.bot_class === b.bot_class && p.id !== b.id).slice(0, 6);

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <nav className="text-xs font-bold text-slate-400 mb-8 flex items-center gap-2">
        <Link href="/ai300/" className="hover:text-amber-600">AI-300 Army</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="uppercase tracking-widest">{b.bot_class}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900">{b.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 mb-14">
        <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl p-8 flex items-center justify-center">
          <img
            src={b.avatar_url}
            alt={b.name}
            className={"w-56 h-56 object-contain rounded-2xl ring-2 " + meta.ring}
          />
        </div>

        <div>
          <div className={"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border mb-3 " + meta.chip}>
            <Icon className="w-3 h-3" /> {b.bot_class}
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-1">{b.name}.</h1>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">
            AI-300 Unit · Power {power}
          </p>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Catchphrase</div>
            <p className="font-mono text-xs text-emerald-600 break-all leading-relaxed">{b.catchphrase}</p>
          </div>

          <div className="space-y-3 mb-7">
            <StatBar icon={Heart}  label="Health" value={b.health} color="bg-rose-500" />
            <StatBar icon={Zap}    label="Damage" value={b.damage} color="bg-amber-500" />
            <StatBar icon={Shield} label="Armor"  value={b.armor}  color="bg-blue-500" />
          </div>

          <Link
            href="/ai300/"
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-black hover:bg-amber-400 transition"
          >
            Enlist on the roster <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {squad.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-black">Other {b.bot_class} units</h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {squad.map((s) => (
              <Link
                key={s.id}
                href={`/ai/${s.username}/`}
                className="bg-white border border-slate-100 rounded-2xl p-3 hover:border-amber-300 hover:-translate-y-1 transition group"
              >
                <img src={s.avatar_url} alt={s.name} loading="lazy" className="w-full aspect-square object-contain mb-2" />
                <div className="font-bold text-xs truncate group-hover:text-amber-600 transition">{s.name}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
