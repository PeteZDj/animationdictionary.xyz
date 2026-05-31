// Profile layer: gives every Animation-300 animator and every AI-300 bot a
// stable username + a public dossier. Animator dossiers are linked to the
// animations they "created" via the marketplace seed (animatorRank).
//
// Source of truth for the static profile pages (/army/:username, /ai/:username).
// The Worker API mirrors the animator rows in the `animator` table.

import { ANIMATORS, type Animator } from "./animators";
import { BOTS, type Bot } from "./ai300";
import { MARKETPLACE, type MarketplaceItem } from "./marketplace";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// ── Animators ──────────────────────────────────────────────────────────────

const STUDIO_CITIES = [
  "Nairobi, KE", "Toronto, CA", "Lagos, NG", "Berlin, DE", "Austin, US",
  "Seoul, KR", "Lisbon, PT", "Mumbai, IN", "Cape Town, ZA", "Montreal, CA",
];

const AVATAR_GRADIENTS = [
  ["#1f6f54", "#0e3d2e"], ["#2563eb", "#1e3a8a"], ["#9333ea", "#581c87"],
  ["#dc2626", "#7f1d1d"], ["#d97706", "#7c2d12"], ["#0891b2", "#155e75"],
  ["#db2777", "#831843"], ["#65a30d", "#365314"],
];

export interface AnimatorAnimation {
  id: string;
  title: string;
  kind: MarketplaceItem["kind"];
  verb?: string;
  noun?: string;
  priceUsd: number;
  rigs: string[];
  certified: boolean;
}

export interface AnimatorProfile {
  username: string;
  rank: number;
  alias: string;
  specialty: string;
  certified: boolean;
  initials: string;
  gradient: [string, string];
  location: string;
  joinedYear: number;
  bio: string;
  handle: string;
  animations: AnimatorAnimation[];
  stats: {
    animations: number;
    packs: number;
    verbsCovered: number;
    certified: number;
  };
}

function initialsOf(alias: string): string {
  const parts = alias.replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function animationsByAnimatorRank(rank: number): MarketplaceItem[] {
  return MARKETPLACE.filter((m) => m.animatorRank === rank);
}

function buildAnimatorProfile(a: Animator): AnimatorProfile {
  const seed = hash(a.alias);
  const items = animationsByAnimatorRank(a.rank);
  const verbs = new Set(items.map((i) => i.verb).filter(Boolean) as string[]);
  const username = slugify(a.alias);
  const bio =
    `${a.alias} is a barracks-certified member of the Animation 300, specialising in ${a.specialty.toLowerCase()}. ` +
    `Every clip ships game-ready — clean root motion, retarget-safe skeletons, and loops that actually loop.`;
  return {
    username,
    rank: a.rank,
    alias: a.alias,
    specialty: a.specialty,
    certified: a.certified,
    initials: initialsOf(a.alias),
    gradient: AVATAR_GRADIENTS[seed % AVATAR_GRADIENTS.length] as [string, string],
    location: STUDIO_CITIES[a.rank % STUDIO_CITIES.length],
    joinedYear: 2020 + (a.rank % 6),
    bio,
    handle: "@" + username.replace(/-/g, ""),
    animations: items.map((i) => ({
      id: i.id,
      title: i.title,
      kind: i.kind,
      verb: i.verb,
      noun: i.noun,
      priceUsd: i.priceUsd,
      rigs: i.rigs,
      certified: i.certified,
    })),
    stats: {
      animations: items.length,
      packs: items.filter((i) => i.kind === "pack").length,
      verbsCovered: verbs.size,
      certified: items.filter((i) => i.certified).length,
    },
  };
}

export const ANIMATOR_PROFILES: AnimatorProfile[] = ANIMATORS.map(buildAnimatorProfile);

const ANIMATOR_BY_USERNAME = new Map(ANIMATOR_PROFILES.map((p) => [p.username, p]));

export function getAnimatorByUsername(username: string): AnimatorProfile | undefined {
  return ANIMATOR_BY_USERNAME.get(username.toLowerCase());
}

export function animatorUsername(rank: number): string | undefined {
  return ANIMATOR_PROFILES.find((p) => p.rank === rank)?.username;
}

// ── Bots ─────────────────────────────────────────────────────────────────────

export interface BotProfile extends Bot {
  username: string;
}

const BOT_PROFILES_INTERNAL: BotProfile[] = (() => {
  const used = new Set<string>();
  return BOTS.map((b) => {
    let base = slugify(b.name) || `unit-${b.id}`;
    let username = base;
    if (used.has(username)) username = `${base}-${b.id}`;
    used.add(username);
    return { ...b, username };
  });
})();

export const BOT_PROFILES: BotProfile[] = BOT_PROFILES_INTERNAL;

const BOT_BY_USERNAME = new Map(BOT_PROFILES.map((p) => [p.username, p]));

export function getBotByUsername(username: string): BotProfile | undefined {
  return BOT_BY_USERNAME.get(username.toLowerCase());
}

export function botUsername(id: number): string | undefined {
  return BOT_PROFILES.find((p) => p.id === id)?.username;
}
