// The "universal rig" mapping. One rigged humanoid (RobotExpressive.glb, CC0)
// carries a set of named AnimationClips on a single skeleton. We pick the clip
// that best expresses each verb and tweak playback (timeScale) so the rig is
// "posed by what the verb says". Verbs without an exact clip fall back by
// category, so every verb animates.
//
// Scale path (production): swap RIG_URL for a Mixamo character + per-verb Mixamo
// clips (same skeleton => no retargeting), or retarget onto a branded rig with
// THREE SkeletonUtils.retargetClip. The map below stays the same.

import type { VerbCategory } from "@/data/verbs";

export const RIG_URL = "/models/RobotExpressive.glb";

/** Clip names that actually exist in RobotExpressive.glb. */
export const RIG_CLIPS = [
  "Dance", "Death", "Idle", "Jump", "No", "Punch", "Running",
  "Sitting", "Standing", "ThumbsUp", "Walking", "WalkJump", "Wave", "Yes",
] as const;

export type ClipName = (typeof RIG_CLIPS)[number];

export interface ClipSpec {
  clip: ClipName;
  /** Playback rate; >1 faster, <1 slower. */
  timeScale?: number;
  /** Human-readable note shown under the viewer. */
  note?: string;
}

// Precise per-verb choices. Keys are verb slugs.
const BY_SLUG: Record<string, ClipSpec> = {
  // ── locomotion ──────────────────────────────────────────────
  walk: { clip: "Walking" },
  run: { clip: "Running" },
  sprint: { clip: "Running", timeScale: 1.6, note: "Running, sped up" },
  jog: { clip: "Running", timeScale: 0.8, note: "Running, eased" },
  march: { clip: "Walking", timeScale: 1.1 },
  strut: { clip: "Walking", timeScale: 0.9 },
  saunter: { clip: "Walking", timeScale: 0.7 },
  trudge: { clip: "Walking", timeScale: 0.6, note: "Walking, heavy" },
  limp: { clip: "Walking", timeScale: 0.7 },
  stagger: { clip: "Walking", timeScale: 0.6 },
  tiptoe: { clip: "Walking", timeScale: 0.5 },
  "crouch-walk": { clip: "Walking", timeScale: 0.6 },

  // ── acrobatic ───────────────────────────────────────────────
  jump: { clip: "Jump" },
  leap: { clip: "Jump", timeScale: 0.9 },
  vault: { clip: "WalkJump", note: "Walk into a jump" },
  hurdle: { clip: "WalkJump" },
  backflip: { clip: "Jump", timeScale: 0.8 },
  flip: { clip: "Jump", timeScale: 0.8 },
  land: { clip: "Jump" },
  roll: { clip: "Jump", timeScale: 1.2 },
  climb: { clip: "Walking", timeScale: 0.5 },

  // ── combat ──────────────────────────────────────────────────
  punch: { clip: "Punch" },
  attack: { clip: "Punch" },
  strike: { clip: "Punch" },
  jab: { clip: "Punch", timeScale: 1.3 },
  slash: { clip: "Punch", timeScale: 1.1 },
  kick: { clip: "Punch", note: "Punch (no kick clip yet)" },
  parry: { clip: "Punch", timeScale: 0.7 },
  block: { clip: "Punch", timeScale: 0.6 },
  takedown: { clip: "Punch" },

  // ── gesture ─────────────────────────────────────────────────
  wave: { clip: "Wave" },
  beckon: { clip: "Wave" },
  point: { clip: "Wave", note: "Wave (closest gesture)" },
  salute: { clip: "Wave" },
  nod: { clip: "Yes" },
  agree: { clip: "Yes" },
  bow: { clip: "Yes", timeScale: 0.8 },
  "shake-head": { clip: "No" },
  disagree: { clip: "No" },
  shrug: { clip: "No", timeScale: 0.8 },
  clap: { clip: "ThumbsUp" },
  cheer: { clip: "ThumbsUp" },
  applaud: { clip: "ThumbsUp" },

  // ── expression / idle ───────────────────────────────────────
  dance: { clip: "Dance" },
  idle: { clip: "Idle" },
  "idle-combat": { clip: "Idle" },
  sit: { clip: "Sitting" },
  stand: { clip: "Standing" },
  lean: { clip: "Idle" },
  stretch: { clip: "Idle" },

  // ── death ───────────────────────────────────────────────────
  die: { clip: "Death" },
  collapse: { clip: "Death" },
  faint: { clip: "Death" },

  // ── stealth ─────────────────────────────────────────────────
  sneak: { clip: "Walking", timeScale: 0.5 },
  creep: { clip: "Walking", timeScale: 0.45 },
  stalk: { clip: "Walking", timeScale: 0.55 },
};

// Category fallbacks so EVERY verb animates even without an exact clip.
const BY_CATEGORY: Record<VerbCategory, ClipSpec> = {
  locomotion: { clip: "Walking" },
  acrobatic: { clip: "Jump" },
  combat: { clip: "Punch" },
  gesture: { clip: "Wave" },
  expression: { clip: "Idle" },
  idle: { clip: "Idle" },
  work: { clip: "Idle" },
  stealth: { clip: "Walking", timeScale: 0.5 },
  creature: { clip: "Idle" },
};

export function clipForVerb(slug: string, category: VerbCategory): ClipSpec {
  return BY_SLUG[slug] ?? BY_CATEGORY[category] ?? { clip: "Idle" };
}
