// Deterministic mock marketplace inventory. Generated from the verbs and
// nouns lexicons so categories stay in sync. Real data will replace this
// once we wire uploads + DB.

import { VERBS } from "./verbs";
import { NOUNS } from "./nouns";
import { ANIMATORS } from "./animators";

export type ItemKind = "animation" | "model" | "pack";

export interface MarketplaceItem {
  id: string;
  kind: ItemKind;
  title: string;
  /** Action verb slug (animations + packs) or null for pure models. */
  verb?: string;
  /** Subject noun slug (models + packs) or null for generic-rig animations. */
  noun?: string;
  /** $1 for single animations, $1 for single models, $5-10 for packs. */
  priceUsd: number;
  rigs: string[];
  animatorRank: number;
  certified: boolean;
  bytes: number;
}

// Hash so we generate deterministic data on every build.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

const PACK_THEMES = [
  { suffix: "Ninja Combat Pack",  size: 24, price: 10, verbs: ["slash","parry","backflip","sneak","takedown","dodge"] },
  { suffix: "Knight Bundle",      size: 18, price: 10, verbs: ["walk","attack","block","draw","sheathe","kneel"] },
  { suffix: "Parkour Traversal",  size: 16, price:  8, verbs: ["vault","roll","climb","jump","leap","land"] },
  { suffix: "Idle Loops Vol. 1",  size: 12, price:  5, verbs: ["idle","idle-combat","sit","lean","crouch","stretch"] },
  { suffix: "Reaction Pack",      size: 14, price:  5, verbs: ["flinch","stagger","shiver","cheer","laugh","cry"] },
  { suffix: "Bird Flight Pack",   size:  8, price:  8, verbs: ["fly","glide","hover","perch","flap"] },
  { suffix: "Stealth Toolkit",    size: 10, price:  8, verbs: ["sneak","crouch-walk","hide","peek","pickpocket","lockpick"] },
  { suffix: "Locomotion Starter", size: 20, price:  8, verbs: ["walk","run","sprint","jog","march","stagger"] },
  { suffix: "Gesture Vocab",      size: 16, price:  5, verbs: ["wave","point","bow","salute","nod","shrug","clap","beckon"] },
];

export const MARKETPLACE: MarketplaceItem[] = (() => {
  const out: MarketplaceItem[] = [];

  // 60 single animations
  VERBS.slice(0, 60).forEach((v, i) => {
    const seed = hash(`anim-${v.slug}`);
    out.push({
      id: `anim-${v.slug}`,
      kind: "animation",
      title: v.word,
      verb: v.slug,
      priceUsd: 1,
      rigs: v.rigs,
      animatorRank: (seed % ANIMATORS.length) + 1,
      certified: seed % 5 === 0,
      bytes: 90_000 + (seed % 80) * 1024,
    });
  });

  // 25 single models
  NOUNS.slice(0, 25).forEach((n) => {
    const seed = hash(`model-${n.slug}`);
    out.push({
      id: `model-${n.slug}`,
      kind: "model",
      title: n.word,
      noun: n.slug,
      priceUsd: 1,
      rigs: n.formats,
      animatorRank: (seed % ANIMATORS.length) + 1,
      certified: seed % 4 === 0,
      bytes: 400_000 + (seed % 200) * 4096,
    });
  });

  // 18 packs
  PACK_THEMES.forEach((p, i) => {
    const seed = hash(`pack-${p.suffix}`);
    out.push({
      id: `pack-${p.suffix.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      kind: "pack",
      title: p.suffix,
      verb: p.verbs[0],
      priceUsd: p.price,
      rigs: ["UE5", "Unity", "Mixamo"],
      animatorRank: (seed % ANIMATORS.length) + 1,
      certified: i % 2 === 0,
      bytes: p.size * 180_000,
    });
    // a second variant of the pack
    out.push({
      id: `pack-${p.suffix.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-v2`,
      kind: "pack",
      title: `${p.suffix} (Vol. 2)`,
      verb: p.verbs[p.verbs.length - 1],
      priceUsd: p.price,
      rigs: ["UE5", "Maya", "Blender"],
      animatorRank: ((seed + 7) % ANIMATORS.length) + 1,
      certified: i % 3 === 0,
      bytes: p.size * 200_000,
    });
  });

  return out;
})();

export function itemsForVerb(verbSlug: string): MarketplaceItem[] {
  return MARKETPLACE.filter((m) => m.verb === verbSlug);
}

export function itemsForNoun(nounSlug: string): MarketplaceItem[] {
  return MARKETPLACE.filter((m) => m.noun === nounSlug);
}
