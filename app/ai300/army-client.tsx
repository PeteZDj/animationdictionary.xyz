"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Crosshair,
  LifeBuoy,
  HeartPulse,
  Sparkles,
  Star,
  Heart,
  Zap,
  Plus,
  X,
  Search,
  Award,
  Users,
  ArrowUpRight,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { BOT_CLASSES, type Bot, type BotClass } from "@/data/ai300";
import { BOT_PROFILES, type BotProfile } from "@/data/profiles";

/** Per-class iconography + accent colours for the light barracks theme. */
const CLASS_META: Record<
  BotClass,
  { icon: LucideIcon; text: string; ring: string; chip: string }
> = {
  Assault:  { icon: Crosshair,  text: "text-red-600",     ring: "ring-red-400/50",     chip: "bg-red-50 text-red-700 border-red-200" },
  Defender: { icon: Shield,     text: "text-blue-600",    ring: "ring-blue-400/50",    chip: "bg-blue-50 text-blue-700 border-blue-200" },
  Support:  { icon: LifeBuoy,   text: "text-emerald-600", ring: "ring-emerald-400/50", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Medic:    { icon: HeartPulse, text: "text-rose-600",    ring: "ring-rose-400/50",    chip: "bg-rose-50 text-rose-700 border-rose-200" },
  Witch:    { icon: Sparkles,   text: "text-purple-600",  ring: "ring-purple-400/50",  chip: "bg-purple-50 text-purple-700 border-purple-200" },
  Captain:  { icon: Star,       text: "text-amber-600",   ring: "ring-amber-400/50",   chip: "bg-amber-50 text-amber-700 border-amber-200" },
};

type Filter = "All" | BotClass;

export function ArmyClient() {
  const [army, setArmy] = useState<Bot[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const enlistedIds = useMemo(() => new Set(army.map((b) => b.id)), [army]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: BOT_PROFILES.length };
    for (const cls of BOT_CLASSES) c[cls] = BOT_PROFILES.filter((b) => b.bot_class === cls).length;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BOT_PROFILES.filter((b) => {
      if (filter !== "All" && b.bot_class !== filter) return false;
      if (q && !b.name.toLowerCase().includes(q) && !b.bot_class.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filter, query]);

  const armyPower = army.reduce((s, b) => s + b.health + b.damage + b.armor, 0);

  function enlist(bot: Bot) {
    setArmy((prev) => (prev.some((b) => b.id === bot.id) ? prev : [...prev, bot]));
  }
  function dismiss(id: number) {
    setArmy((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 text-slate-900 min-h-screen pt-10 md:pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Heading ─────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 border border-amber-200 bg-amber-50 px-4 py-1.5 rounded-full text-xs font-bold text-amber-600 uppercase tracking-[0.25em] mb-8">
          <Award className="w-4 h-4" /> Recruitment Open
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
          The AI-300 <span className="text-amber-500">Army.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl leading-relaxed mb-12">
          Draft your battalion of AI animation units. Every bot is graded on health,
          damage, and armor — open a unit&apos;s dossier, read its binary catchphrase, and{" "}
          <span className="text-slate-900 font-semibold">enlist</span> it into your army.
          Tap an enlisted unit to discharge it.
        </p>

        {/* ── Stat strip ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Stat icon={Users}  value={String(BOT_PROFILES.length)}  label="Units Available" />
          <Stat icon={Shield} value={String(BOT_CLASSES.length)}   label="Combat Classes" />
          <Stat icon={Trophy} value={String(army.length)}          label="Enlisted" accent />
          <Stat icon={Zap}    value={armyPower.toLocaleString()}   label="Army Power" accent />
        </div>

        {/* ── Your Army panel ─────────────────────────────────────── */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 md:p-8 mb-14">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" /> Your Army
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {army.length} / 300 enlisted
            </span>
            <div className="h-px flex-1 bg-slate-200" />
            {army.length > 0 && (
              <button
                onClick={() => setArmy([])}
                className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-rose-500 transition"
              >
                Discharge all
              </button>
            )}
          </div>

          {army.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-2xl py-12 text-center text-slate-400">
              <Plus className="w-7 h-7 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">
                No units enlisted yet. Pick from the roster below to assemble your battalion.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {army.map((bot) => {
                const meta = CLASS_META[bot.bot_class];
                const Icon = meta.icon;
                return (
                  <button
                    key={bot.id}
                    onClick={() => dismiss(bot.id)}
                    title="Click to discharge"
                    className="group relative flex items-center gap-3 bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-300 rounded-2xl pl-2 pr-4 py-2 transition"
                  >
                    <img
                      src={bot.avatar_url}
                      alt={bot.name}
                      loading="lazy"
                      className="w-11 h-11 rounded-xl bg-slate-100 object-cover"
                    />
                    <div className="text-left">
                      <div className="text-sm font-bold leading-tight">{bot.name}</div>
                      <div className={"text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 " + meta.text}>
                        <Icon className="w-3 h-3" /> {bot.bot_class}
                      </div>
                    </div>
                    <span className="ml-1 w-6 h-6 rounded-full bg-slate-200 text-slate-600 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center transition">
                      <X className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Roster controls ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <h2 className="text-2xl font-black">The Roster</h2>
          <span className="text-xs text-slate-400 font-mono">
            showing {filtered.length} of {BOT_PROFILES.length}
          </span>
          <div className="h-px flex-1 bg-slate-200 min-w-[2rem]" />
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search units..."
              className="bg-transparent outline-none text-sm py-2.5 w-40 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* class filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["All", ...BOT_CLASSES] as Filter[]).map((cls) => {
            const active = filter === cls;
            const Icon = cls === "All" ? Users : CLASS_META[cls].icon;
            return (
              <button
                key={cls}
                onClick={() => setFilter(cls)}
                className={
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border transition " +
                  (active
                    ? "bg-amber-500 text-slate-900 border-amber-500"
                    : "bg-white text-slate-600 border-slate-200 hover:border-amber-300")
                }
              >
                <Icon className="w-3.5 h-3.5" />
                {cls}
                <span className="text-[10px] font-mono opacity-60">{counts[cls]}</span>
              </button>
            );
          })}
        </div>

        {/* ── Roster grid ─────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
          {filtered.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              enlisted={enlistedIds.has(bot.id)}
              onEnlist={() => enlist(bot)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-400 py-16 text-sm">
            No units match that filter. Try clearing the search.
          </p>
        )}

        {/* ── Recruitment CTA ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <div className="flex-1">
            <h3 className="text-xl font-black mb-1">Looking for the humans?</h3>
            <p className="text-slate-500 text-sm">
              The AI-300 are the bots. The hand-keyed elite live in the Animation 300 roster.
            </p>
          </div>
          <Link
            href="/animation-300/"
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-black hover:bg-amber-400 transition"
          >
            Meet the Animation 300 <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function Stat({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <Icon className={"w-5 h-5 mb-3 " + (accent ? "text-amber-500" : "text-slate-400")} />
      <div className="text-3xl font-black mb-1 tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{label}</div>
    </div>
  );
}

function BotCard({
  bot,
  enlisted,
  onEnlist,
}: {
  bot: BotProfile;
  enlisted: boolean;
  onEnlist: () => void;
}) {
  const meta = CLASS_META[bot.bot_class];
  const Icon = meta.icon;
  return (
    <div className="group bg-white border border-slate-100 rounded-3xl p-4 hover:border-amber-300 hover:shadow-[0_24px_60px_-18px_rgba(15,23,42,0.18)] hover:-translate-y-1 transition duration-300 flex flex-col">
      <Link href={`/ai/${bot.username}/`} className="text-left block">
        <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-slate-100 to-slate-50 relative">
          <img
            src={bot.avatar_url}
            alt={bot.name}
            loading="lazy"
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-500"
          />
          <div className={"absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight border " + meta.chip}>
            <Icon className="w-3 h-3" /> {bot.bot_class}
          </div>
        </div>
        <h3 className="font-black text-lg leading-tight group-hover:text-amber-600 transition">{bot.name}</h3>
        <p className="text-[10px] text-slate-400 font-mono truncate mt-1" title={bot.catchphrase}>
          {bot.catchphrase}
        </p>
      </Link>

      <div className="grid grid-cols-3 gap-2 my-4 text-center">
        <MiniStat icon={Heart} value={bot.health} className="text-rose-500" />
        <MiniStat icon={Zap}   value={bot.damage} className="text-amber-500" />
        <MiniStat icon={Shield} value={bot.armor} className="text-blue-500" />
      </div>

      <button
        onClick={onEnlist}
        disabled={enlisted}
        className={
          "mt-auto w-full py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition " +
          (enlisted
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
            : "bg-amber-500 text-slate-900 hover:bg-amber-400 active:scale-95")
        }
      >
        {enlisted ? "Enlisted" : (<><Plus className="w-4 h-4" /> Enlist</>)}
      </button>
    </div>
  );
}

function MiniStat({ icon: Icon, value, className }: { icon: LucideIcon; value: number; className: string }) {
  return (
    <div className="bg-slate-50 rounded-xl py-2">
      <Icon className={"w-4 h-4 mx-auto mb-1 " + className} />
      <div className="text-sm font-black tabular-nums">{value}</div>
    </div>
  );
}
