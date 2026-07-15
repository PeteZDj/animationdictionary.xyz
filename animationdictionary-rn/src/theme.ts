// AnimationDictionary design system — "The Language of Motion".
// Ported from the web app (Tailwind): ink #0f172a on a #f8fafc canvas, a
// blue-600 action accent ($1 buttons), amber "300" certified badges, and a set
// of per-category tints for the verb/noun lexicons.
//
// Fonts: Plus Jakarta Sans (UI) + JetBrains Mono (technical / data).

export const C = {
  // brand — blue-600
  brand: '#2563EB',
  brandDark: '#1D4ED8',
  brandLight: '#60A5FA',
  brandMuted: '#DBEAFE',
  brandTint: '#EFF6FF',
  accent: '#2563EB',

  // ink / neutrals (slate)
  ink: '#0F172A',
  inkSoft: '#1E293B',
  dark: '#0F172A',
  text: '#0F172A',
  textSub: '#475569',
  subInk: '#334155',
  muted: '#94A3B8',
  muted2: '#CBD5E1',

  // surfaces
  bg: '#F8FAFC', // canvas
  bgElevated: '#F1F5F9',
  tint: '#F1F5F9',
  card: '#FFFFFF',
  card2: '#F8FAFC',
  line: '#E2E8F0',
  line2: '#F1F5F9',

  white: '#FFFFFF',
  black: '#0F172A',

  // accents / semantic
  amber: '#D97706',
  amberBg: '#FEF3C7',
  gold: '#F59E0B', // "300" badge fill
  green: '#059669',
  greenBg: '#D1FAE5',
  red: '#E11D48',
  redBg: '#FFE4E6',

  // charts
  chart1: '#2563EB',
  chart2: '#059669',
  chart3: '#F59E0B',
  chart4: '#7C3AED',
  chart5: '#DB2777',
} as const;

export const GRAD = {
  brand: ['#3B82F6', '#2563EB'] as [string, string],
  brandGlow: ['#60A5FA', '#2563EB'] as [string, string],
  ink: ['#1E293B', '#0F172A'] as [string, string],
  hero: ['#0F172A', '#1E293B'] as [string, string],
};

export function shade(hex: string, amt: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(full, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  r = f(r); g = f(g); b = f(b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function alpha(hex: string, a: number): string {
  const aa = Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return `#${full}${aa}`;
}

export const font = {
  black: 'PlusJakartaSans_800ExtraBold',
  extra: 'PlusJakartaSans_800ExtraBold',
  head: 'PlusJakartaSans_800ExtraBold',
  bold: 'PlusJakartaSans_700Bold',
  semi: 'PlusJakartaSans_600SemiBold',
  body: 'PlusJakartaSans_400Regular',
  bodyMed: 'PlusJakartaSans_500Medium',
  bodySemi: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoMed: 'JetBrainsMono_600SemiBold',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

export const radius = { sm: 10, md: 14, lg: 18, xl: 24, xxl: 28, pill: 999 };

export const shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  soft: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  brand: {
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
} as const;

/* ── Category tints (verb + noun lexicons) ─────────────────────────────── */
type Tint = { bg: string; fg: string };
const TINTS: Record<string, Tint> = {
  blue: { bg: '#EFF6FF', fg: '#2563EB' },
  amber: { bg: '#FFFBEB', fg: '#D97706' },
  rose: { bg: '#FFF1F2', fg: '#E11D48' },
  emerald: { bg: '#ECFDF5', fg: '#059669' },
  pink: { bg: '#FDF2F8', fg: '#DB2777' },
  slate: { bg: '#F1F5F9', fg: '#475569' },
  indigo: { bg: '#EEF2FF', fg: '#4F46E5' },
  violet: { bg: '#F5F3FF', fg: '#7C3AED' },
  teal: { bg: '#F0FDFA', fg: '#0D9488' },
};

const VERB_CAT_COLOR: Record<string, keyof typeof TINTS> = {
  locomotion: 'blue',
  acrobatic: 'amber',
  combat: 'rose',
  gesture: 'emerald',
  expression: 'pink',
  idle: 'slate',
  work: 'indigo',
  stealth: 'violet',
  creature: 'teal',
};

const NOUN_CAT_COLOR: Record<string, keyof typeof TINTS> = {
  character: 'blue',
  creature: 'teal',
  structure: 'amber',
  weapon: 'rose',
  vehicle: 'indigo',
  nature: 'emerald',
  prop: 'slate',
};

export function tintFor(category: string): Tint {
  const key = VERB_CAT_COLOR[category] || NOUN_CAT_COLOR[category] || 'slate';
  return TINTS[key];
}

/* ── AI-300 bot classes ────────────────────────────────────────────────── */
export const BOT_CLASS_META: Record<string, { color: string; bg: string; icon: string }> = {
  Assault: { color: '#E11D48', bg: '#FFF1F2', icon: 'flame' },
  Defender: { color: '#2563EB', bg: '#EFF6FF', icon: 'shield' },
  Support: { color: '#059669', bg: '#ECFDF5', icon: 'construct' },
  Medic: { color: '#DB2777', bg: '#FDF2F8', icon: 'medkit' },
  Witch: { color: '#7C3AED', bg: '#F5F3FF', icon: 'sparkles' },
  Captain: { color: '#D97706', bg: '#FFFBEB', icon: 'star' },
};

/* ── Remote imagery (served from the live site, cached by expo-image) ──── */
export const IMG_BASE = 'https://animationdictionary.xyz/img';
export function verbImg(slug: string): string {
  return `${IMG_BASE}/verbs/verb-${slug}.png`;
}
export function nounImg(slug: string): string {
  return `${IMG_BASE}/nouns/noun-${slug}.png`;
}
export function heroImg(name: string): string {
  return `${IMG_BASE}/hero/hero-${name}.png`;
}
