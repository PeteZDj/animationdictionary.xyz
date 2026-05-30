import Link from "next/link";
import { Box, Award, Search, User } from "lucide-react";

export function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200/60 group-hover:rotate-3 transition">
            <Box className="w-6 h-6" strokeWidth={2.4} />
          </div>
          <span className="text-xl font-extrabold tracking-tight italic hidden sm:block">
            Animation<span className="text-blue-600">Dictionary</span>
          </span>
        </Link>

        {/* Nav links — collapse below lg */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <Link href="/verbs/"          className="hover:text-blue-600 transition">Verbs</Link>
          <Link href="/nouns/"          className="hover:text-blue-600 transition">Nouns</Link>
          <Link href="/marketplace/"    className="hover:text-blue-600 transition">Marketplace</Link>
          <Link href="/animation-300/"  className="hover:text-blue-600 transition flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" /> The 300
          </Link>
          <Link href="/marketplace/#pricing" className="hover:text-blue-600 transition">Pricing</Link>
          <Link href="/verbs/"           className="hover:text-blue-600 transition">Docs</Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center"
          >
            <Search className="w-4 h-4 text-slate-600" />
          </button>

          <button
            type="button"
            aria-label="Account"
            className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 hover:from-blue-500 hover:to-blue-700 transition flex items-center justify-center text-white shadow-md"
          >
            <User className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="hidden sm:flex bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition shadow-lg shadow-slate-900/10 active:scale-95"
          >
            Join the Army
          </button>
        </div>
      </div>
    </nav>
  );
}
