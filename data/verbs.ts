// Motion-verb lexicon for animationdictionary.xyz.
// Each entry is a single English verb that maps to a discrete character action.
// Categories drive the page filters; tags are searchable synonyms.

export type VerbCategory =
  | "locomotion"
  | "acrobatic"
  | "combat"
  | "gesture"
  | "expression"
  | "idle"
  | "work"
  | "stealth"
  | "creature";

export interface Verb {
  slug: string;     // url segment, e.g. "vault"
  word: string;     // display word
  category: VerbCategory;
  definition: string;
  synonyms: string[];
  rigs: ("UE5" | "Unity" | "Mixamo" | "Maya" | "Blender" | "Metahuman")[];
  rootMotion?: boolean;
  loopable?: boolean;
}

export const VERBS: Verb[] = [
  // ── locomotion ──────────────────────────────────────────────────────────
  { slug:"walk", word:"Walk", category:"locomotion", definition:"Bipedal forward gait at a moderate cadence.", synonyms:["stroll","amble","stride"], rigs:["UE5","Unity","Mixamo"], rootMotion:true, loopable:true },
  { slug:"run", word:"Run", category:"locomotion", definition:"Bipedal gait with an aerial phase between footfalls.", synonyms:["dash","sprint","jog"], rigs:["UE5","Unity","Mixamo"], rootMotion:true, loopable:true },
  { slug:"sprint", word:"Sprint", category:"locomotion", definition:"All-out maximum-velocity run.", synonyms:["dash","bolt"], rigs:["UE5","Unity","Mixamo"], rootMotion:true, loopable:true },
  { slug:"jog", word:"Jog", category:"locomotion", definition:"Slow, steady run used for endurance pacing.", synonyms:["trot"], rigs:["UE5","Unity","Mixamo"], rootMotion:true, loopable:true },
  { slug:"march", word:"March", category:"locomotion", definition:"Disciplined, cadenced walk; often military.", synonyms:["parade"], rigs:["UE5","Unity","Mixamo"], rootMotion:true, loopable:true },
  { slug:"strut", word:"Strut", category:"locomotion", definition:"Confident, exaggerated walk with weight shifted back.", synonyms:["swagger"], rigs:["UE5","Unity","Mixamo"], loopable:true },
  { slug:"saunter", word:"Saunter", category:"locomotion", definition:"Unhurried, leisurely walk.", synonyms:["amble","mosey"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"trudge", word:"Trudge", category:"locomotion", definition:"Heavy, weary walk under load or fatigue.", synonyms:["plod"], rigs:["UE5","Unity","Mixamo"], loopable:true },
  { slug:"limp", word:"Limp", category:"locomotion", definition:"Asymmetric walk favouring an injured leg.", synonyms:["hobble"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"stagger", word:"Stagger", category:"locomotion", definition:"Unsteady walk after impact or intoxication.", synonyms:["stumble","reel"], rigs:["UE5","Unity"], loopable:true },
  { slug:"tiptoe", word:"Tiptoe", category:"locomotion", definition:"Quiet walk on the balls of the feet.", synonyms:["sneak"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"crouch-walk", word:"Crouch-Walk", category:"stealth", definition:"Forward movement in a low, bent-knee posture.", synonyms:["stalk","creep"], rigs:["UE5","Unity"], rootMotion:true, loopable:true },
  { slug:"crawl", word:"Crawl", category:"locomotion", definition:"Forward motion on hands and knees.", synonyms:["belly-crawl"], rigs:["UE5","Mixamo"], rootMotion:true, loopable:true },
  { slug:"climb", word:"Climb", category:"locomotion", definition:"Ascending a vertical surface using limbs.", synonyms:["scale","scramble"], rigs:["UE5","Unity","Mixamo"], rootMotion:true, loopable:true },
  { slug:"swim", word:"Swim", category:"locomotion", definition:"Propulsion through water with limbs.", synonyms:["paddle","stroke"], rigs:["UE5","Unity","Mixamo"], rootMotion:true, loopable:true },
  { slug:"skate", word:"Skate", category:"locomotion", definition:"Gliding locomotion on a low-friction surface.", synonyms:["glide"], rigs:["UE5","Unity"], loopable:true },
  { slug:"ride", word:"Ride", category:"locomotion", definition:"Mounted motion on horse or vehicle.", synonyms:["mount"], rigs:["UE5","Mixamo"], loopable:true },

  // ── acrobatic ───────────────────────────────────────────────────────────
  { slug:"jump", word:"Jump", category:"acrobatic", definition:"Vertical launch from a standing or moving start.", synonyms:["leap","spring"], rigs:["UE5","Unity","Mixamo"] },
  { slug:"leap", word:"Leap", category:"acrobatic", definition:"Long-range jump covering horizontal distance.", synonyms:["bound","spring"], rigs:["UE5","Unity","Mixamo"] },
  { slug:"hop", word:"Hop", category:"acrobatic", definition:"Short, repeated single-foot jumps.", synonyms:["bounce"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"vault", word:"Vault", category:"acrobatic", definition:"Crossing an obstacle by planting hands or feet.", synonyms:["mount","hurdle"], rigs:["UE5","Unity","Mixamo"], rootMotion:true },
  { slug:"backflip", word:"Backflip", category:"acrobatic", definition:"Reverse aerial rotation about the X-axis.", synonyms:["somersault"], rigs:["UE5","Unity","Mixamo","Maya"] },
  { slug:"frontflip", word:"Frontflip", category:"acrobatic", definition:"Forward aerial rotation about the X-axis.", synonyms:["somersault"], rigs:["UE5","Unity","Mixamo"] },
  { slug:"cartwheel", word:"Cartwheel", category:"acrobatic", definition:"Sideways rotation hands-feet-hands.", synonyms:[], rigs:["UE5","Mixamo"] },
  { slug:"roll", word:"Roll", category:"acrobatic", definition:"Tumble forward or sideways to redistribute fall energy.", synonyms:["tumble","dive-roll"], rigs:["UE5","Unity","Mixamo"], rootMotion:true },
  { slug:"dive", word:"Dive", category:"acrobatic", definition:"Headfirst plunge or evasive dive forward.", synonyms:["plunge"], rigs:["UE5","Mixamo"], rootMotion:true },
  { slug:"slide", word:"Slide", category:"acrobatic", definition:"Low-friction ground glide into a finish pose.", synonyms:["skid"], rigs:["UE5","Unity","Mixamo"], rootMotion:true },
  { slug:"land", word:"Land", category:"acrobatic", definition:"Impact and stabilisation after a jump or fall.", synonyms:["touchdown"], rigs:["UE5","Unity","Mixamo"] },
  { slug:"swing", word:"Swing", category:"acrobatic", definition:"Pendulum motion from a grip.", synonyms:["sway"], rigs:["UE5","Mixamo"], loopable:true },

  // ── combat ──────────────────────────────────────────────────────────────
  { slug:"attack", word:"Attack", category:"combat", definition:"Generic offensive strike.", synonyms:["strike","assault"], rigs:["UE5","Unity","Mixamo"] },
  { slug:"punch", word:"Punch", category:"combat", definition:"Closed-fist strike forward.", synonyms:["jab","cross","hook"], rigs:["UE5","Unity","Mixamo"] },
  { slug:"kick", word:"Kick", category:"combat", definition:"Leg strike forward or sideways.", synonyms:["roundhouse","sidekick"], rigs:["UE5","Unity","Mixamo"] },
  { slug:"slash", word:"Slash", category:"combat", definition:"Blade swing through an arc.", synonyms:["swipe","cleave"], rigs:["UE5","Unity","Mixamo"] },
  { slug:"stab", word:"Stab", category:"combat", definition:"Thrusting attack with a pointed weapon.", synonyms:["thrust","pierce"], rigs:["UE5","Mixamo"] },
  { slug:"thrust", word:"Thrust", category:"combat", definition:"Linear forward push of weapon or shoulder.", synonyms:["lunge"], rigs:["UE5","Mixamo"] },
  { slug:"parry", word:"Parry", category:"combat", definition:"Deflective block redirecting an incoming strike.", synonyms:["riposte","deflect"], rigs:["UE5","Mixamo"] },
  { slug:"block", word:"Block", category:"combat", definition:"Hard interception of an incoming strike.", synonyms:["guard"], rigs:["UE5","Unity","Mixamo"] },
  { slug:"dodge", word:"Dodge", category:"combat", definition:"Short evasive step out of an attack line.", synonyms:["evade","sidestep"], rigs:["UE5","Unity","Mixamo"] },
  { slug:"riposte", word:"Riposte", category:"combat", definition:"Counter-strike immediately after a parry.", synonyms:["counter"], rigs:["UE5","Mixamo"] },
  { slug:"shoot", word:"Shoot", category:"combat", definition:"Firing a ranged weapon.", synonyms:["fire","loose"], rigs:["UE5","Unity","Mixamo"] },
  { slug:"reload", word:"Reload", category:"combat", definition:"Refilling ammunition into a weapon.", synonyms:["recharge"], rigs:["UE5","Unity","Mixamo"] },
  { slug:"aim", word:"Aim", category:"combat", definition:"Sighting a ranged weapon on a target.", synonyms:["target"], rigs:["UE5","Unity","Mixamo"], loopable:true },
  { slug:"draw", word:"Draw", category:"combat", definition:"Pulling a weapon from its sheath.", synonyms:["unsheathe"], rigs:["UE5","Mixamo"] },
  { slug:"sheathe", word:"Sheathe", category:"combat", definition:"Returning weapon to its sheath.", synonyms:["holster"], rigs:["UE5","Mixamo"] },
  { slug:"charge", word:"Charge", category:"combat", definition:"Aggressive forward rush at a target.", synonyms:["rush"], rigs:["UE5","Mixamo"], rootMotion:true },
  { slug:"retreat", word:"Retreat", category:"combat", definition:"Controlled backward withdrawal under threat.", synonyms:["fallback"], rigs:["UE5","Mixamo"], rootMotion:true },
  { slug:"taunt", word:"Taunt", category:"combat", definition:"Provocative gesture aimed at an opponent.", synonyms:["jeer","beckon"], rigs:["UE5","Mixamo"] },

  // ── gesture ─────────────────────────────────────────────────────────────
  { slug:"wave", word:"Wave", category:"gesture", definition:"Open-handed greeting or farewell.", synonyms:["hello","goodbye"], rigs:["UE5","Mixamo"] },
  { slug:"clap", word:"Clap", category:"gesture", definition:"Repeated hand-against-hand applause.", synonyms:["applaud"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"point", word:"Point", category:"gesture", definition:"Index-finger direction indication.", synonyms:["gesture"], rigs:["UE5","Mixamo"] },
  { slug:"beckon", word:"Beckon", category:"gesture", definition:"Hand motion summoning someone closer.", synonyms:["come-here"], rigs:["UE5","Mixamo"] },
  { slug:"salute", word:"Salute", category:"gesture", definition:"Formal military hand-to-brow gesture.", synonyms:[], rigs:["UE5","Mixamo"] },
  { slug:"bow", word:"Bow", category:"gesture", definition:"Forward bend of the torso in respect.", synonyms:["curtsy"], rigs:["UE5","Mixamo"] },
  { slug:"shrug", word:"Shrug", category:"gesture", definition:"Shoulder raise expressing uncertainty.", synonyms:["dunno"], rigs:["UE5","Mixamo"] },
  { slug:"nod", word:"Nod", category:"gesture", definition:"Vertical head motion in agreement.", synonyms:["yes"], rigs:["UE5","Mixamo"] },
  { slug:"shake-head", word:"Shake Head", category:"gesture", definition:"Lateral head motion in refusal.", synonyms:["no"], rigs:["UE5","Mixamo"] },
  { slug:"thumbs-up", word:"Thumbs Up", category:"gesture", definition:"Approval gesture, thumb extended skyward.", synonyms:["approve"], rigs:["UE5","Mixamo"] },
  { slug:"facepalm", word:"Facepalm", category:"gesture", definition:"Palm-to-forehead reaction of exasperation.", synonyms:[], rigs:["UE5","Mixamo"] },
  { slug:"handshake", word:"Handshake", category:"gesture", definition:"Mutual right-hand grip in greeting.", synonyms:["greet"], rigs:["UE5","Mixamo"] },
  { slug:"high-five", word:"High Five", category:"gesture", definition:"Open-handed slap of celebration.", synonyms:["five"], rigs:["UE5","Mixamo"] },
  { slug:"fist-bump", word:"Fist Bump", category:"gesture", definition:"Knuckles-to-knuckles greeting.", synonyms:[], rigs:["UE5","Mixamo"] },

  // ── expression / acting ─────────────────────────────────────────────────
  { slug:"laugh", word:"Laugh", category:"expression", definition:"Rhythmic shoulder shake with open mouth.", synonyms:["chuckle","giggle"], rigs:["UE5","Mixamo","Metahuman"] },
  { slug:"cry", word:"Cry", category:"expression", definition:"Sobbing posture with shoulders forward.", synonyms:["weep","sob"], rigs:["UE5","Mixamo","Metahuman"] },
  { slug:"yawn", word:"Yawn", category:"expression", definition:"Wide-mouth fatigue gesture with arm stretch.", synonyms:["tired"], rigs:["UE5","Mixamo","Metahuman"] },
  { slug:"sigh", word:"Sigh", category:"expression", definition:"Exaggerated exhale with shoulder drop.", synonyms:[], rigs:["UE5","Mixamo","Metahuman"] },
  { slug:"flinch", word:"Flinch", category:"expression", definition:"Involuntary recoil from threat or pain.", synonyms:["wince","recoil"], rigs:["UE5","Mixamo"] },
  { slug:"shiver", word:"Shiver", category:"expression", definition:"Cold-induced tremor of the upper body.", synonyms:["shudder"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"cheer", word:"Cheer", category:"expression", definition:"Both-arms-up celebration with jump.", synonyms:["celebrate"], rigs:["UE5","Mixamo"] },

  // ── idle / rest ─────────────────────────────────────────────────────────
  { slug:"idle", word:"Idle", category:"idle", definition:"Subtle breathing standing pose.", synonyms:["stand"], rigs:["UE5","Unity","Mixamo"], loopable:true },
  { slug:"idle-combat", word:"Idle (Combat)", category:"idle", definition:"Wary, weapon-ready idle stance.", synonyms:["guard-idle"], rigs:["UE5","Unity","Mixamo"], loopable:true },
  { slug:"sit", word:"Sit", category:"idle", definition:"Seated pose on a chair or floor.", synonyms:[], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"sit-floor", word:"Sit on Floor", category:"idle", definition:"Cross-legged seated pose on the ground.", synonyms:["crosslegged"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"lean", word:"Lean", category:"idle", definition:"Resting posture against a wall or object.", synonyms:["recline"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"crouch", word:"Crouch", category:"idle", definition:"Low knees-bent stance, hands free.", synonyms:["squat"], rigs:["UE5","Unity","Mixamo"], loopable:true },
  { slug:"kneel", word:"Kneel", category:"idle", definition:"One- or two-knee grounded pose.", synonyms:["bow-down"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"lie-down", word:"Lie Down", category:"idle", definition:"Supine resting pose.", synonyms:["recline","sleep"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"sleep", word:"Sleep", category:"idle", definition:"Looping breathing in lying or seated rest.", synonyms:["nap"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"stretch", word:"Stretch", category:"idle", definition:"Arms-overhead body stretch.", synonyms:["yawn-stretch"], rigs:["UE5","Mixamo"] },

  // ── work / interaction ──────────────────────────────────────────────────
  { slug:"pick-up", word:"Pick Up", category:"work", definition:"Bend, grasp, and lift an object.", synonyms:["grab"], rigs:["UE5","Mixamo"] },
  { slug:"throw", word:"Throw", category:"work", definition:"Overhand release of a held object.", synonyms:["toss","hurl"], rigs:["UE5","Mixamo"] },
  { slug:"catch", word:"Catch", category:"work", definition:"Receive an incoming object with both hands.", synonyms:["grab"], rigs:["UE5","Mixamo"] },
  { slug:"push", word:"Push", category:"work", definition:"Apply forward force against an object.", synonyms:["shove"], rigs:["UE5","Mixamo"], rootMotion:true },
  { slug:"pull", word:"Pull", category:"work", definition:"Apply backward force on a grasped object.", synonyms:["drag"], rigs:["UE5","Mixamo"], rootMotion:true },
  { slug:"carry", word:"Carry", category:"work", definition:"Walk while holding a large object.", synonyms:["lug","tote"], rigs:["UE5","Mixamo"], rootMotion:true, loopable:true },
  { slug:"open-door", word:"Open Door", category:"work", definition:"Reach, grip, swing, and step through a doorway.", synonyms:[], rigs:["UE5","Mixamo"] },
  { slug:"dig", word:"Dig", category:"work", definition:"Two-hand shovel motion into the ground.", synonyms:[], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"chop", word:"Chop", category:"work", definition:"Overhead axe strike downward.", synonyms:["hack"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"hammer", word:"Hammer", category:"work", definition:"Repeated overhand striking motion.", synonyms:["pound"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"craft", word:"Craft", category:"work", definition:"Generic two-handed bench-work loop.", synonyms:["build"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"cook", word:"Cook", category:"work", definition:"Stirring or chopping at a counter.", synonyms:["stir","chop"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"drink", word:"Drink", category:"work", definition:"Raise vessel to mouth and tilt.", synonyms:["sip","gulp"], rigs:["UE5","Mixamo"] },
  { slug:"eat", word:"Eat", category:"work", definition:"Bring food to mouth and chew.", synonyms:["chew"], rigs:["UE5","Mixamo"], loopable:true },

  // ── stealth ─────────────────────────────────────────────────────────────
  { slug:"sneak", word:"Sneak", category:"stealth", definition:"Low, slow, near-silent stalking walk.", synonyms:["stalk","creep","prowl"], rigs:["UE5","Mixamo"], rootMotion:true, loopable:true },
  { slug:"hide", word:"Hide", category:"stealth", definition:"Press against cover, peek at intervals.", synonyms:["cover"], rigs:["UE5","Mixamo"], loopable:true },
  { slug:"peek", word:"Peek", category:"stealth", definition:"Quick head-out look from behind cover.", synonyms:["glance"], rigs:["UE5","Mixamo"] },
  { slug:"takedown", word:"Takedown", category:"stealth", definition:"Silent grab-and-drop assassination.", synonyms:["assassinate"], rigs:["UE5","Mixamo"] },
  { slug:"pickpocket", word:"Pickpocket", category:"stealth", definition:"Quick inside-pocket lift while passing.", synonyms:["lift"], rigs:["UE5","Mixamo"] },
  { slug:"lockpick", word:"Lockpick", category:"stealth", definition:"Crouched two-hand pick at a lock.", synonyms:["pick","jimmy"], rigs:["UE5","Mixamo"], loopable:true },

  // ── creature ────────────────────────────────────────────────────────────
  { slug:"fly", word:"Fly", category:"creature", definition:"Wing-flap forward propulsion.", synonyms:["soar","glide"], rigs:["UE5","Mixamo","Maya"], loopable:true, rootMotion:true },
  { slug:"glide", word:"Glide", category:"creature", definition:"Wings-out unpowered horizontal travel.", synonyms:["soar"], rigs:["UE5","Maya"], loopable:true },
  { slug:"hover", word:"Hover", category:"creature", definition:"Wings flapping in place, position held.", synonyms:["levitate"], rigs:["UE5","Maya"], loopable:true },
  { slug:"perch", word:"Perch", category:"creature", definition:"Landed pose with wings folded.", synonyms:["roost"], rigs:["UE5","Maya"], loopable:true },
  { slug:"slither", word:"Slither", category:"creature", definition:"Lateral serpentine ground motion.", synonyms:["snake"], rigs:["UE5","Maya"], rootMotion:true, loopable:true },
  { slug:"gallop", word:"Gallop", category:"creature", definition:"Four-leg high-speed gait with aerial phase.", synonyms:["run"], rigs:["UE5","Maya"], rootMotion:true, loopable:true },
  { slug:"trot", word:"Trot", category:"creature", definition:"Four-leg moderate two-beat gait.", synonyms:[], rigs:["UE5","Maya"], rootMotion:true, loopable:true },
  { slug:"pounce", word:"Pounce", category:"creature", definition:"Crouch then leap onto target.", synonyms:["leap","ambush"], rigs:["UE5","Maya"] },
  { slug:"roar", word:"Roar", category:"creature", definition:"Open-mouth chest-out vocal display.", synonyms:["bellow","growl"], rigs:["UE5","Maya"] },
  { slug:"bite", word:"Bite", category:"creature", definition:"Forward jaw snap onto target.", synonyms:["chomp"], rigs:["UE5","Maya"] },
  { slug:"flap", word:"Flap", category:"creature", definition:"Standing wing-flap idle.", synonyms:[], rigs:["UE5","Maya"], loopable:true },
];

export const CATEGORIES: { id: VerbCategory; label: string; tint: string }[] = [
  { id:"locomotion", label:"Locomotion",  tint:"bg-blue-50 text-blue-600 border-blue-100" },
  { id:"acrobatic",  label:"Acrobatic",   tint:"bg-amber-50 text-amber-600 border-amber-100" },
  { id:"combat",     label:"Combat",      tint:"bg-rose-50 text-rose-600 border-rose-100" },
  { id:"gesture",    label:"Gesture",     tint:"bg-emerald-50 text-emerald-600 border-emerald-100" },
  { id:"expression", label:"Expression",  tint:"bg-pink-50 text-pink-600 border-pink-100" },
  { id:"idle",       label:"Idle",        tint:"bg-slate-100 text-slate-600 border-slate-200" },
  { id:"work",       label:"Work",        tint:"bg-indigo-50 text-indigo-600 border-indigo-100" },
  { id:"stealth",    label:"Stealth",     tint:"bg-violet-50 text-violet-600 border-violet-100" },
  { id:"creature",   label:"Creature",    tint:"bg-teal-50 text-teal-600 border-teal-100" },
];

export function getVerb(slug: string): Verb | undefined {
  return VERBS.find((v) => v.slug === slug);
}
