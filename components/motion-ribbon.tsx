import { PlayCircle, Smile, Zap, Swords, User, Award, Bird, Cat } from "lucide-react";

const TICKER = [
  { name: "Backflip_01.fbx",   meta: "Pixar Style · $1",  Icon: PlayCircle, tint: "bg-blue-50 text-blue-600" },
  { name: "Bashful_Wave.fbx",  meta: "C4D Rig · $1",      Icon: Smile,      tint: "bg-pink-50 text-pink-600" },
  { name: "Sprinting_Loop.fbx",meta: "UE5 Root · $1",     Icon: Zap,        tint: "bg-emerald-50 text-emerald-600" },
  { name: "Combat_Pack.zip",   meta: "24 Assets · $10",   Icon: Swords,     tint: "bg-amber-50 text-amber-600" },
  { name: "Idle_Thinking.fbx", meta: "Unity Ready · $1",  Icon: User,       tint: "bg-purple-50 text-purple-600" },
  { name: "Animator_007",      meta: "Certified 300 · ✓", Icon: Award,      tint: "bg-yellow-50 text-yellow-600" },
  { name: "Eagle_Glide.fbx",   meta: "Maya Wing · $1",    Icon: Bird,       tint: "bg-sky-50 text-sky-600" },
  { name: "Wolf_Pounce.fbx",   meta: "Quadruped · $1",    Icon: Cat,        tint: "bg-rose-50 text-rose-600" },
];

function Ribbon() {
  return (
    <div className="flex gap-4 shrink-0">
      {TICKER.map((t, i) => (
        <div
          key={i}
          className="bg-white border border-slate-100 p-3 rounded-2xl flex items-center gap-3 shadow-sm shadow-slate-100 min-w-max"
        >
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${t.tint}`}>
            <t.Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold leading-tight">{t.name}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{t.meta}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MotionRibbon() {
  return (
    <div className="w-full overflow-hidden relative">
      <div className="flex gap-4 animate-ribbon whitespace-nowrap w-max">
        <Ribbon />
        <Ribbon />
        <Ribbon />
      </div>
    </div>
  );
}
