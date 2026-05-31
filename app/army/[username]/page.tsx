import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ChevronRight, 
  MapPin, 
  CalendarDays, 
  ShieldCheck, 
  Boxes, 
  Film, 
  Sparkles, 
  Monitor, 
  Wrench, 
  Download, 
  ExternalLink, 
  Play, 
  Award, 
  Star 
} from "lucide-react";
import { ANIMATOR_PROFILES, getAnimatorByUsername, animationsByAnimatorRank } from "@/data/profiles";

export function generateStaticParams() {
  return ANIMATOR_PROFILES.map((p) => ({ username: p.username }));
}

export function generateMetadata({ params }: { params: { username: string } }) {
  const p = getAnimatorByUsername(params.username);
  if (!p) return { title: "Animator not found" };
  return {
    title: `${p.alias} · The Animation 300`,
    description: p.bio,
  };
}

function SidebarMetric({ icon: Icon, label, value, valueClass = "text-slate-800 font-bold" }: { icon: any; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold leading-none mb-0.5">{label}</div>
        <div className={`text-xs ${valueClass} leading-tight`}>{value}</div>
      </div>
    </div>
  );
}

export default function AnimatorProfilePage({ params }: { params: { username: string } }) {
  const p = getAnimatorByUsername(params.username);
  if (!p) notFound();

  const items = animationsByAnimatorRank(p.rank);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumbs navigation */}
      <nav className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-2">
        <Link href="/animation-300/" className="hover:text-emerald-600">The Animation 300</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900">{p.alias}</span>
      </nav>

      {/* Dynamic Cover Photo with tech grid pattern overlay */}
      <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-[-3.5rem] shadow-md border border-slate-100/10">
        <div
          className="absolute inset-0 opacity-90 transition-all duration-300"
          style={{ backgroundImage: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
        />
        {/* SVG Tech Grid Grid Overlay */}
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        <div className="absolute inset-0 opacity-10 flex items-center justify-between pointer-events-none p-6 font-mono text-[10px] text-white">
          <div className="flex flex-col gap-2">
            <span>FPS: 60.00</span>
            <span>MODEL: BARRACKS_RIG_V5</span>
            <span>RESOLUTION: RETINA_SAFE</span>
          </div>
          <div className="h-full w-px bg-gradient-to-b from-transparent via-white to-transparent" />
          <div className="flex flex-col items-end gap-2">
            <span>UPTIME: 99.98%</span>
            <span>clearance: LEVEL_3</span>
            <span>status: BARRACKS_ACTIVE</span>
          </div>
        </div>
        {/* Graph Editor Animation Splines decorative overlay in SVGs */}
        <svg className="absolute inset-0 w-full h-full stroke-white/20 fill-none pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-20,120 Q 150,40 300,140 T 600,100 T 900,180 T 1300,60" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M-20,160 Q 200,80 400,200 T 800,60 T 1200,150" strokeWidth="1" />
          <circle cx="300" cy="140" r="3" className="fill-amber-400 stroke-amber-400" />
          <circle cx="600" cy="100" r="3" className="fill-emerald-400 stroke-emerald-400" />
          <circle cx="900" cy="180" r="3" className="fill-blue-400 stroke-blue-400" />
          <circle cx="400" cy="200" r="3" className="fill-amber-400 stroke-amber-400" />
          <circle cx="800" cy="60" r="3" className="fill-purple-400 stroke-purple-400" />
        </svg>
      </div>

      {/* Overlapping Avatar and Header Details */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-end px-6 md:px-10 mb-12">
        <div
          className="w-28 h-28 md:w-32 md:h-32 rounded-3xl flex items-center justify-center shrink-0 shadow-xl overflow-hidden border-4 border-white bg-slate-50 relative group"
          style={{ backgroundImage: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
        >
          <img
            src={`/img/profiles/${p.username}.svg`}
            alt={p.alias}
            className="w-24 h-24 md:w-28 md:h-28 object-cover transform translate-y-1 group-hover:scale-110 transition duration-300"
          />
          {p.certified && (
            <div className="absolute bottom-1.5 right-1.5 bg-amber-500 text-slate-900 p-1 rounded-lg shadow-md border border-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex-1 pb-2">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full shadow-sm">
              <Award className="w-3.5 h-3.5" /> Rank #{p.rank} &middot; {p.rankTitle}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-sm">
              <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" /> Active Barracks Elite
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-1 text-slate-900">
            {p.alias}<span className="text-amber-500">.</span>
          </h1>
          <p className="text-emerald-700 font-extrabold text-sm tracking-wider uppercase">{p.specialty}</p>
        </div>
      </div>

      {/* Dossier Content Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
        
        {/* Main Column (Left, 2/3 wide on large screen) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Biography blurb */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-black mb-4 text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" /> Clearance Dossier Biography
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium text-base mb-4">
              {p.fullBlurb}
            </p>
            <p className="text-slate-500 text-sm italic leading-relaxed">
              *Clearance Notice: Authorized access only. This profile tracks performance metrics for hand-keyed physics and mocap refinement models within the Barracks environment. All assets are guaranteed retarget-safe and engine-ready.
            </p>
          </div>

          {/* Premium Video Reel Player */}
          <div className="bg-slate-950 text-slate-100 border border-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient glowing radial effect */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-xl font-black mb-4 text-white flex items-center gap-2 relative z-10">
              <Film className="w-5 h-5 text-emerald-400" /> 2026 Barracks Motion Showreel
            </h2>
            
            {/* The Screen / Player Area */}
            <div className="relative w-full aspect-video rounded-2xl bg-slate-900 border border-slate-800 shadow-inner overflow-hidden group mb-4">
              <div 
                className="absolute inset-0 opacity-40 transition-all duration-500 group-hover:scale-105"
                style={{ backgroundImage: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                {/* Glowing Play Button */}
                <button className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] transition duration-300 hover:scale-110 mb-4 group/btn">
                  <Play className="w-6 h-6 fill-slate-950 translate-x-0.5 group-hover/btn:scale-105 transition" />
                </button>
                <div className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold mb-1">
                  CLEARANCE STREAM ACTIVE
                </div>
                <div className="text-lg font-black text-white max-w-md tracking-tight drop-shadow-md">
                  {p.alias} &middot; Real-Time {p.specialty} Showreel
                </div>
              </div>
              
              {/* Grid scanning line effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-1/2 w-full animate-[pulse_3s_infinite] pointer-events-none" />
            </div>

            {/* Video Controls bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono text-slate-400 relative z-10">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-300">DEMO_REEL_v3_2026.mp4</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[78%] bg-emerald-500 rounded-full" />
                </div>
                <span>02:45 / 03:20</span>
              </div>
            </div>
          </div>

          {/* Motion Studies Gallery */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-blue-500" /> Active Motion Studies
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {items.length} listed works
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {items.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-200 text-center">
                <p className="text-slate-400 text-sm font-semibold mb-2">No dynamic listings credited yet.</p>
                <p className="text-slate-400 text-xs">This animator is currently editing custom project-locked animations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((it) => {
                  const imageSrc = it.verb ? `/img/verbs/verb-${it.verb}.png` : it.noun ? `/img/nouns/noun-${it.noun}.png` : null;
                  return (
                    <div 
                      key={it.id} 
                      className="group bg-white border border-slate-100 hover:border-emerald-300 rounded-2xl overflow-hidden hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition duration-300 flex flex-col"
                    >
                      {/* Interactive Visual Thumbnail */}
                      <div className="relative aspect-[16/10] bg-slate-50 border-b border-slate-100 overflow-hidden shrink-0">
                        {imageSrc ? (
                          <img 
                            src={imageSrc} 
                            alt={it.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div 
                            className="w-full h-full opacity-70 flex items-center justify-center text-xs font-mono font-bold text-white uppercase tracking-widest"
                            style={{ backgroundImage: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
                          >
                            NO_PREVIEW
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
                          {it.kind}
                        </span>
                        
                        {/* Technical overlay metrics */}
                        <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-sm px-3 py-2 text-[9px] font-mono text-emerald-400 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span>RIG: Biped_Barracks_V2</span>
                          <span>RM: BAKED</span>
                          <span>FPS: 60</span>
                        </div>
                      </div>
                      
                      {/* Body Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-emerald-600 transition truncate">
                            {it.title}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase truncate">
                            ID: {it.id.toUpperCase()}
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                          <span className="text-xs font-black text-slate-900">
                            ${it.priceUsd} USD
                          </span>
                          <Link 
                            href={`/marketplace/`} 
                            className="text-[10px] font-black uppercase text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                          >
                            View Asset <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Column (Right, 1/3 wide) */}
        <div className="space-y-6">
          
          {/* Roster stats / credentials card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-50 pb-2">
              Barracks Credentials
            </h3>
            <div className="space-y-4">
              <SidebarMetric icon={MapPin} label="Studio Location" value={p.location} />
              <SidebarMetric icon={CalendarDays} label="Service Year" value={`Since ${p.joinedYear}`} />
              <SidebarMetric icon={Monitor} label="Clearance Handle" value={p.handle} />
              <SidebarMetric icon={ShieldCheck} label="Dossier Clearance" value="Tier-1 Barracks VIP" valueClass="text-emerald-600 font-bold" />
            </div>
          </div>

          {/* Technical Toolbox */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-50 pb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-slate-400" /> Toolbox & Engines
            </h3>
            <div className="flex flex-wrap gap-2">
              {p.tools.map((t) => (
                <span 
                  key={t}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 shadow-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Core Capabilities */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-50 pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-400" /> Core Capabilities
            </h3>
            <ul className="space-y-3">
              {p.strengths.map((str) => (
                <li key={str} className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Hub - CV Download & Behance Connecting */}
          <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
              Action Center
            </h3>
            
            {/* CV Download Button */}
            <a 
              href={p.socials.cv}
              download
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-5 py-3 rounded-2xl font-black text-xs tracking-wider uppercase transition shadow-md"
            >
              <Download className="w-4 h-4" /> Download Barracks CV
            </a>

            {/* Behance Portfolio Button */}
            <a 
              href={p.socials.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-white text-slate-700 hover:text-slate-950 border border-slate-200 hover:border-slate-300 px-5 py-3 rounded-2xl font-black text-xs tracking-wider uppercase transition shadow-sm"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" /> Behance Portfolio
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
