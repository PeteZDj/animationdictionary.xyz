// "The Animation 300" — elite-tier roster.
// We ship 30 entries; the marketing copy says 300, the missing 270 are
// "still being invited."

export interface Animator {
  rank: number;
  alias: string;
  specialty: string;
  certified: boolean;
}

export const ANIMATORS: Animator[] = [
  { rank: 1,   alias: "Captain Mocap",      specialty: "Parkour",             certified: true },
  { rank: 2,   alias: "Keyframe King",      specialty: "Combat",              certified: true },
  { rank: 3,   alias: "Spline Whisperer",   specialty: "Acting / Emotional",  certified: true },
  { rank: 4,   alias: "Rig-Master",         specialty: "Rigging & Retarget",  certified: true },
  { rank: 5,   alias: "Roto Phantom",       specialty: "Crowd",               certified: true },
  { rank: 6,   alias: "Onion Skin",         specialty: "2D-to-3D",            certified: true },
  { rank: 7,   alias: "Squash & Stretch",   specialty: "Pixar Style",         certified: true },
  { rank: 8,   alias: "Mr. Frame-One",      specialty: "Cycle Loops",         certified: true },
  { rank: 9,   alias: "Inertia Sensei",     specialty: "Physics",             certified: true },
  { rank: 10,  alias: "The Tweener",        specialty: "Interpolation",       certified: true },
  { rank: 11,  alias: "Hipline Henry",      specialty: "Walk Cycles",         certified: true },
  { rank: 12,  alias: "Anticipation Ada",   specialty: "Anticipation",        certified: true },
  { rank: 13,  alias: "Follow-Through Fei", specialty: "Secondary Motion",    certified: true },
  { rank: 14,  alias: "Lipsync Luma",       specialty: "Facial",              certified: true },
  { rank: 15,  alias: "Arc Architect",      specialty: "Motion Arcs",         certified: true },
  { rank: 16,  alias: "Pose Engineer",      specialty: "Stylised Posing",     certified: true },
  { rank: 17,  alias: "Combat Choreo",      specialty: "Sword Fight",         certified: true },
  { rank: 18,  alias: "Ninja Bezier",       specialty: "Stealth & Takedowns", certified: true },
  { rank: 19,  alias: "Quadruped Quill",    specialty: "Animals",             certified: true },
  { rank: 20,  alias: "Wing Captain",       specialty: "Birds & Flight",      certified: true },
  { rank: 21,  alias: "Hex Boss",           specialty: "Spells & VFX-bound",  certified: true },
  { rank: 22,  alias: "Loop Lord",          specialty: "Idle Loops",          certified: true },
  { rank: 23,  alias: "Reaction Rin",       specialty: "Hit Reactions",       certified: true },
  { rank: 24,  alias: "Crowd Director",     specialty: "NPC Behaviour",       certified: true },
  { rank: 25,  alias: "Slow-Mo Sato",       specialty: "Bullet-Time",         certified: true },
  { rank: 26,  alias: "Locomotion Liz",     specialty: "Locomotion Sets",     certified: true },
  { rank: 27,  alias: "Vault Vega",         specialty: "Traversal",           certified: true },
  { rank: 28,  alias: "Roar Engineer",      specialty: "Creature Vocals",     certified: true },
  { rank: 29,  alias: "Dance Kernel",       specialty: "Choreography",        certified: true },
  { rank: 30,  alias: "Pose-To-Pose Pia",   specialty: "Cinematic",           certified: true },
];
