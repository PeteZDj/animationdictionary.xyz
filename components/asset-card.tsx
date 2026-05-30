import Link from "next/link";
import { PlayCircle, Package, Box } from "lucide-react";
import type { MarketplaceItem } from "@/data/marketplace";

// Slugs that have a finished robot/character image rendered to /public/img/.
// Append here as new magi batches come in.
const VERBS_WITH_IMG = new Set([
  "walk", "backflip", "punch", "wave", "crouch",
  "run",  "sprint",   "jog",   "march", "strut",
  "saunter", "trudge", "limp", "stagger",
]);
const NOUNS_WITH_IMG = new Set([
  "knight", "wizard", "ninja", "samurai", "archer", "rogue",
]);

const TINTS = [
  "bg-blue-50 text-blue-400",
  "bg-pink-50 text-pink-400",
  "bg-amber-50 text-amber-400",
  "bg-purple-50 text-purple-400",
  "bg-emerald-50 text-emerald-400",
  "bg-sky-50 text-sky-400",
];

function tintFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return TINTS[Math.abs(h) % TINTS.length];
}

export function AssetCard({ item }: { item: MarketplaceItem }) {
  // Prefer the verb image (an animation card), fall back to noun image (a model card).
  const verbImg = item.verb && VERBS_WITH_IMG.has(item.verb) ? `/img/verbs/verb-${item.verb}.png` : null;
  const nounImg = item.noun && NOUNS_WITH_IMG.has(item.noun) ? `/img/nouns/noun-${item.noun}.png` : null;
  const img     = verbImg ?? nounImg;

  const tint = tintFor(item.id);
  const Icon =
    item.kind === "pack"  ? Package :
    item.kind === "model" ? Box     :
                            PlayCircle;
  const label =
    item.kind === "pack"  ? "Pack"  :
    item.kind === "model" ? "Model" :
                            "Anim";
  const href =
    item.kind === "model" && item.noun ? `/nouns/${item.noun}/` :
    item.verb                          ? `/verbs/${item.verb}/` :
                                         `/marketplace/`;

  return (
    <Link
      href={href}
      className="block bg-white border border-slate-100 p-3 rounded-[1.75rem] group hover:-translate-y-1 hover:border-blue-500 hover:shadow-[0_24px_60px_-12px_rgba(15,23,42,0.08)] transition duration-300"
    >
      <div
        className={
          "aspect-square rounded-2xl overflow-hidden mb-3 relative " +
          (img ? "bg-gradient-to-br from-slate-100 to-slate-50" : tint)
        }
      >
        {img ? (
          <img
            src={img}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-12 h-12 opacity-50 group-hover:scale-125 transition duration-500" />
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter text-slate-900">
          {label}
        </div>
        {item.certified && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm">
            300
          </div>
        )}
      </div>
      <div className="flex justify-between items-center px-1">
        <div className="min-w-0">
          <h4 className="font-bold text-sm truncate">{item.title}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
            {item.rigs.slice(0, 2).join(" · ")}
          </p>
        </div>
        <button className="bg-blue-600 text-white px-3 h-10 min-w-[2.5rem] rounded-full flex items-center justify-center font-black text-xs hover:bg-slate-900 transition shrink-0">
          ${item.priceUsd}
        </button>
      </div>
    </Link>
  );
}
