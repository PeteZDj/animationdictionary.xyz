// 3D-model noun lexicon. Each noun maps to a category of model the
// dictionary serves (a "bird" = bird mesh + bird-flight animations, etc.).

export type NounCategory =
  | "character"
  | "creature"
  | "structure"
  | "weapon"
  | "vehicle"
  | "nature"
  | "prop";

export interface Noun {
  slug: string;
  word: string;
  category: NounCategory;
  definition: string;
  /** Verbs from /verbs whose animations are most relevant to this model. */
  pairsWith: string[];
  formats: ("FBX" | "GLB" | "USD" | "OBJ" | "BLEND")[];
  polyHint?: string;
}

export const NOUNS: Noun[] = [
  // ── characters ───────────────────────────────────────────────────────────
  { slug:"knight",   word:"Knight",   category:"character", definition:"Medieval armoured fighter.",         pairsWith:["walk","run","attack","block","parry","draw","sheathe"], formats:["FBX","GLB"], polyHint:"40k tris" },
  { slug:"wizard",   word:"Wizard",   category:"character", definition:"Robed spellcaster with staff.",      pairsWith:["walk","idle","cast","point","attack"], formats:["FBX","GLB"], polyHint:"30k tris" },
  { slug:"ninja",    word:"Ninja",    category:"character", definition:"Stealth combatant in tunic.",        pairsWith:["sneak","crouch-walk","slash","backflip","dodge"], formats:["FBX","GLB","BLEND"], polyHint:"28k tris" },
  { slug:"samurai",  word:"Samurai",  category:"character", definition:"Eastern blade master in armour.",    pairsWith:["draw","slash","parry","kneel","walk"], formats:["FBX","GLB"], polyHint:"35k tris" },
  { slug:"archer",   word:"Archer",   category:"character", definition:"Bow-wielding ranger.",               pairsWith:["aim","shoot","reload","walk","crouch"], formats:["FBX","GLB"], polyHint:"30k tris" },
  { slug:"rogue",    word:"Rogue",    category:"character", definition:"Light-armour thief / scout.",        pairsWith:["sneak","pickpocket","lockpick","run","dodge"], formats:["FBX","GLB"], polyHint:"26k tris" },
  { slug:"paladin",  word:"Paladin",  category:"character", definition:"Holy warrior with sword and shield.",pairsWith:["walk","block","attack","pray","kneel"], formats:["FBX","GLB"], polyHint:"38k tris" },
  { slug:"robot",    word:"Robot",    category:"character", definition:"Mechanical bipedal unit.",           pairsWith:["walk","idle","point","attack","power-down"], formats:["FBX","GLB"], polyHint:"50k tris" },
  { slug:"mech",     word:"Mech",     category:"character", definition:"Piloted humanoid combat suit.",      pairsWith:["walk","stomp","attack","aim","shoot"], formats:["FBX","GLB","USD"], polyHint:"120k tris" },
  { slug:"alien",    word:"Alien",    category:"character", definition:"Off-world humanoid entity.",         pairsWith:["walk","idle","attack","roar","crouch"], formats:["FBX","GLB"], polyHint:"32k tris" },
  { slug:"zombie",   word:"Zombie",   category:"character", definition:"Undead shambler.",                   pairsWith:["limp","trudge","attack","stagger","bite"], formats:["FBX","GLB"], polyHint:"24k tris" },
  { slug:"viking",   word:"Viking",   category:"character", definition:"Northern raider with axe.",          pairsWith:["walk","chop","attack","roar","charge"], formats:["FBX","GLB"], polyHint:"36k tris" },
  { slug:"pirate",   word:"Pirate",   category:"character", definition:"Seafaring brigand.",                 pairsWith:["walk","slash","point","drink","sit"], formats:["FBX","GLB"], polyHint:"32k tris" },

  // ── creatures ────────────────────────────────────────────────────────────
  { slug:"bird",      word:"Bird",     category:"creature", definition:"Generic feathered flyer.",            pairsWith:["fly","glide","hover","perch","flap"], formats:["FBX","GLB","BLEND"], polyHint:"6k tris" },
  { slug:"eagle",     word:"Eagle",    category:"creature", definition:"Large raptor.",                       pairsWith:["fly","glide","perch","pounce"], formats:["FBX","GLB"], polyHint:"8k tris" },
  { slug:"owl",       word:"Owl",      category:"creature", definition:"Nocturnal hunter.",                   pairsWith:["fly","hover","perch","flap"], formats:["FBX","GLB"], polyHint:"7k tris" },
  { slug:"dragon",    word:"Dragon",   category:"creature", definition:"Mythical winged reptile.",            pairsWith:["fly","roar","bite","attack","hover"], formats:["FBX","GLB","USD"], polyHint:"80k tris" },
  { slug:"wolf",      word:"Wolf",     category:"creature", definition:"Pack predator.",                      pairsWith:["walk","trot","gallop","pounce","roar","bite"], formats:["FBX","GLB"], polyHint:"15k tris" },
  { slug:"horse",     word:"Horse",    category:"creature", definition:"Mountable equine.",                   pairsWith:["walk","trot","gallop","ride","idle"], formats:["FBX","GLB"], polyHint:"22k tris" },
  { slug:"deer",      word:"Deer",     category:"creature", definition:"Forest cervid.",                      pairsWith:["walk","trot","gallop","idle"], formats:["FBX","GLB"], polyHint:"18k tris" },
  { slug:"bear",      word:"Bear",     category:"creature", definition:"Large omnivore.",                     pairsWith:["walk","roar","attack","bite","stand-up"], formats:["FBX","GLB"], polyHint:"25k tris" },
  { slug:"lion",      word:"Lion",     category:"creature", definition:"Big cat predator.",                   pairsWith:["walk","pounce","roar","bite","sleep"], formats:["FBX","GLB"], polyHint:"20k tris" },
  { slug:"snake",     word:"Snake",    category:"creature", definition:"Serpentine reptile.",                 pairsWith:["slither","strike","coil","bite"], formats:["FBX","GLB"], polyHint:"8k tris" },
  { slug:"spider",    word:"Spider",   category:"creature", definition:"Eight-leg arachnid.",                 pairsWith:["walk","attack","jump","idle"], formats:["FBX","GLB"], polyHint:"12k tris" },
  { slug:"fish",      word:"Fish",     category:"creature", definition:"Generic swimming fish.",              pairsWith:["swim","idle","turn"], formats:["FBX","GLB"], polyHint:"5k tris" },
  { slug:"shark",     word:"Shark",    category:"creature", definition:"Apex marine predator.",               pairsWith:["swim","attack","bite","circle"], formats:["FBX","GLB"], polyHint:"15k tris" },
  { slug:"butterfly", word:"Butterfly",category:"creature", definition:"Small winged insect.",                pairsWith:["fly","hover","perch"], formats:["FBX","GLB"], polyHint:"2k tris" },

  // ── structures ───────────────────────────────────────────────────────────
  { slug:"castle",     word:"Castle",     category:"structure", definition:"Fortified medieval residence.",   pairsWith:[], formats:["FBX","GLB","USD"], polyHint:"500k tris" },
  { slug:"tower",      word:"Tower",      category:"structure", definition:"Tall slender structure.",         pairsWith:[], formats:["FBX","GLB"], polyHint:"80k tris" },
  { slug:"cathedral",  word:"Cathedral",  category:"structure", definition:"Gothic religious building.",      pairsWith:[], formats:["FBX","GLB","USD"], polyHint:"700k tris" },
  { slug:"cottage",    word:"Cottage",    category:"structure", definition:"Small wooden dwelling.",          pairsWith:[], formats:["FBX","GLB"], polyHint:"40k tris" },
  { slug:"lighthouse", word:"Lighthouse", category:"structure", definition:"Coastal navigational tower.",     pairsWith:[], formats:["FBX","GLB"], polyHint:"60k tris" },
  { slug:"bridge",     word:"Bridge",     category:"structure", definition:"Stone or wooden span.",           pairsWith:[], formats:["FBX","GLB"], polyHint:"30k tris" },
  { slug:"temple",     word:"Temple",     category:"structure", definition:"Religious shrine building.",      pairsWith:[], formats:["FBX","GLB"], polyHint:"100k tris" },
  { slug:"dungeon",    word:"Dungeon",    category:"structure", definition:"Subterranean modular kit.",       pairsWith:[], formats:["FBX","GLB","BLEND"], polyHint:"per tile 8k" },
  { slug:"tent",       word:"Tent",       category:"structure", definition:"Cloth camping shelter.",          pairsWith:[], formats:["FBX","GLB"], polyHint:"3k tris" },
  { slug:"windmill",   word:"Windmill",   category:"structure", definition:"Wind-driven mill structure.",     pairsWith:[], formats:["FBX","GLB"], polyHint:"35k tris" },

  // ── weapons ──────────────────────────────────────────────────────────────
  { slug:"sword",     word:"Sword",     category:"weapon", definition:"Single-handed bladed weapon.",        pairsWith:["slash","stab","draw","sheathe"], formats:["FBX","GLB"], polyHint:"3k tris" },
  { slug:"axe",       word:"Axe",       category:"weapon", definition:"Two-handed chopping weapon.",         pairsWith:["chop","attack","throw"], formats:["FBX","GLB"], polyHint:"4k tris" },
  { slug:"bow",       word:"Bow",       category:"weapon", definition:"String-and-arrow projectile weapon.", pairsWith:["aim","shoot","draw"], formats:["FBX","GLB"], polyHint:"2k tris" },
  { slug:"spear",     word:"Spear",     category:"weapon", definition:"Polearm thrust weapon.",              pairsWith:["thrust","stab","throw"], formats:["FBX","GLB"], polyHint:"2k tris" },
  { slug:"shield",    word:"Shield",    category:"weapon", definition:"Worn defensive plate.",               pairsWith:["block","parry"], formats:["FBX","GLB"], polyHint:"3k tris" },
  { slug:"pistol",    word:"Pistol",    category:"weapon", definition:"Sidearm.",                            pairsWith:["aim","shoot","reload","holster"], formats:["FBX","GLB"], polyHint:"5k tris" },
  { slug:"rifle",     word:"Rifle",     category:"weapon", definition:"Two-hand ranged firearm.",            pairsWith:["aim","shoot","reload","crouch"], formats:["FBX","GLB"], polyHint:"7k tris" },
  { slug:"katana",    word:"Katana",    category:"weapon", definition:"Curved single-edged eastern sword.",  pairsWith:["draw","slash","sheathe","parry"], formats:["FBX","GLB"], polyHint:"3k tris" },
  { slug:"dagger",    word:"Dagger",    category:"weapon", definition:"Short blade for thrust or throw.",    pairsWith:["stab","throw","takedown"], formats:["FBX","GLB"], polyHint:"1k tris" },

  // ── vehicles ─────────────────────────────────────────────────────────────
  { slug:"car",         word:"Car",         category:"vehicle", definition:"Generic stylised sedan.",         pairsWith:["drive","sit"], formats:["FBX","GLB"], polyHint:"30k tris" },
  { slug:"motorcycle",  word:"Motorcycle",  category:"vehicle", definition:"Two-wheel road vehicle.",         pairsWith:["ride","sit","stunt"], formats:["FBX","GLB"], polyHint:"20k tris" },
  { slug:"bicycle",     word:"Bicycle",     category:"vehicle", definition:"Pedal-powered two-wheeler.",      pairsWith:["ride","stand-still"], formats:["FBX","GLB"], polyHint:"8k tris" },
  { slug:"ship",        word:"Ship",        category:"vehicle", definition:"Wooden galleon.",                 pairsWith:["sail","idle"], formats:["FBX","GLB","USD"], polyHint:"150k tris" },
  { slug:"plane",       word:"Plane",       category:"vehicle", definition:"Propellor light aircraft.",       pairsWith:["fly","idle"], formats:["FBX","GLB"], polyHint:"40k tris" },
  { slug:"spaceship",   word:"Spaceship",   category:"vehicle", definition:"Sci-fi capital craft.",           pairsWith:["fly","hover","cruise"], formats:["FBX","GLB","USD"], polyHint:"200k tris" },
  { slug:"helicopter",  word:"Helicopter",  category:"vehicle", definition:"Rotor-wing aircraft.",            pairsWith:["fly","hover","land"], formats:["FBX","GLB"], polyHint:"35k tris" },
  { slug:"tank",        word:"Tank",        category:"vehicle", definition:"Tracked armoured vehicle.",       pairsWith:["drive","fire","aim"], formats:["FBX","GLB"], polyHint:"50k tris" },
  { slug:"wagon",       word:"Wagon",       category:"vehicle", definition:"Horse-drawn cart.",               pairsWith:["pull","idle"], formats:["FBX","GLB"], polyHint:"15k tris" },

  // ── nature ───────────────────────────────────────────────────────────────
  { slug:"tree-oak",   word:"Oak Tree",    category:"nature", definition:"Stylised deciduous tree.",          pairsWith:["sway","wind"], formats:["FBX","GLB"], polyHint:"4k tris" },
  { slug:"tree-pine",  word:"Pine Tree",   category:"nature", definition:"Conifer.",                          pairsWith:["sway"], formats:["FBX","GLB"], polyHint:"5k tris" },
  { slug:"tree-palm",  word:"Palm Tree",   category:"nature", definition:"Tropical palm.",                    pairsWith:["sway","wind"], formats:["FBX","GLB"], polyHint:"3k tris" },
  { slug:"bonsai",     word:"Bonsai",      category:"nature", definition:"Ornamental miniature tree.",        pairsWith:["sway"], formats:["FBX","GLB"], polyHint:"2k tris" },
  { slug:"mushroom",   word:"Mushroom",    category:"nature", definition:"Stylised forest mushroom.",         pairsWith:[], formats:["FBX","GLB"], polyHint:"1k tris" },
  { slug:"rock",       word:"Rock",        category:"nature", definition:"Stylised boulder.",                 pairsWith:[], formats:["FBX","GLB"], polyHint:"800 tris" },
  { slug:"waterfall",  word:"Waterfall",   category:"nature", definition:"Cascading water with mist.",        pairsWith:["flow"], formats:["FBX","GLB"], polyHint:"5k tris" },
  { slug:"mountain",   word:"Mountain",    category:"nature", definition:"Distant peak silhouette.",          pairsWith:[], formats:["FBX","GLB"], polyHint:"15k tris" },
  { slug:"island",     word:"Island",      category:"nature", definition:"Tropical low-poly island kit.",     pairsWith:[], formats:["FBX","GLB"], polyHint:"60k tris" },

  // ── props ────────────────────────────────────────────────────────────────
  { slug:"chest",     word:"Treasure Chest", category:"prop", definition:"Wooden lockable chest.",            pairsWith:["open-chest","lockpick"], formats:["FBX","GLB"], polyHint:"3k tris" },
  { slug:"lantern",   word:"Lantern",        category:"prop", definition:"Hand-held oil lantern.",            pairsWith:["hold","walk"], formats:["FBX","GLB"], polyHint:"2k tris" },
  { slug:"barrel",    word:"Barrel",         category:"prop", definition:"Stylised wooden barrel.",           pairsWith:[], formats:["FBX","GLB"], polyHint:"1k tris" },
  { slug:"crate",     word:"Crate",          category:"prop", definition:"Wooden cargo crate.",               pairsWith:[], formats:["FBX","GLB"], polyHint:"800 tris" },
  { slug:"potion",    word:"Potion",         category:"prop", definition:"Glass alchemy bottle.",             pairsWith:["drink","throw"], formats:["FBX","GLB"], polyHint:"600 tris" },
  { slug:"scroll",    word:"Scroll",         category:"prop", definition:"Rolled parchment.",                 pairsWith:["read","unroll"], formats:["FBX","GLB"], polyHint:"400 tris" },
  { slug:"crown",     word:"Crown",          category:"prop", definition:"Royal headpiece.",                  pairsWith:[], formats:["FBX","GLB"], polyHint:"2k tris" },
  { slug:"gem",       word:"Gem",            category:"prop", definition:"Faceted crystal.",                  pairsWith:[], formats:["FBX","GLB"], polyHint:"200 tris" },
  { slug:"book",      word:"Book",           category:"prop", definition:"Hardcover tome.",                   pairsWith:["read","open-book"], formats:["FBX","GLB"], polyHint:"800 tris" },
  { slug:"torch",     word:"Torch",          category:"prop", definition:"Hand-held flame torch.",            pairsWith:["hold","wave"], formats:["FBX","GLB"], polyHint:"600 tris" },
  { slug:"portal",    word:"Portal",         category:"prop", definition:"Magical gateway with VFX.",         pairsWith:["enter","exit"], formats:["FBX","GLB"], polyHint:"3k tris" },
];

export const NOUN_CATEGORIES: { id: NounCategory; label: string; tint: string }[] = [
  { id:"character", label:"Character", tint:"bg-blue-50 text-blue-600 border-blue-100" },
  { id:"creature",  label:"Creature",  tint:"bg-teal-50 text-teal-600 border-teal-100" },
  { id:"structure", label:"Structure", tint:"bg-amber-50 text-amber-600 border-amber-100" },
  { id:"weapon",    label:"Weapon",    tint:"bg-rose-50 text-rose-600 border-rose-100" },
  { id:"vehicle",   label:"Vehicle",   tint:"bg-indigo-50 text-indigo-600 border-indigo-100" },
  { id:"nature",    label:"Nature",    tint:"bg-emerald-50 text-emerald-600 border-emerald-100" },
  { id:"prop",      label:"Prop",      tint:"bg-slate-100 text-slate-600 border-slate-200" },
];

export function getNoun(slug: string): Noun | undefined {
  return NOUNS.find((n) => n.slug === slug);
}
