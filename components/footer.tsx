import { Box, Clapperboard, Gamepad2, Layers } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-20 border-t border-slate-100 text-center">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
          <Box className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold tracking-tight">AnimationDictionary.xyz</span>
      </div>
      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-6">
        Developed by AfroSoftware Limited
      </p>
      <div className="flex justify-center gap-8 text-slate-300 mb-8">
        <Clapperboard className="w-5 h-5" />
        <Gamepad2 className="w-5 h-5" />
        <Layers className="w-5 h-5" />
      </div>
      <p className="text-slate-400 text-sm">&copy; 2026 AnimationDictionary.xyz</p>
    </footer>
  );
}
