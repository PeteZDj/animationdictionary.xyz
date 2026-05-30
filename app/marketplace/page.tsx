"use client";

import { useState, useMemo } from "react";
import { Filter, Search as SearchIcon } from "lucide-react";
import { AssetCard } from "@/components/asset-card";
import { MARKETPLACE, type ItemKind } from "@/data/marketplace";

type Kind = "all" | ItemKind;

export default function MarketplacePage() {
  const [kind, setKind] = useState<Kind>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 30;

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return MARKETPLACE.filter((m) => {
      if (kind !== "all" && m.kind !== kind) return false;
      if (t && !m.title.toLowerCase().includes(t)) return false;
      return true;
    });
  }, [kind, q]);

  const visible = filtered.slice(0, page * PAGE_SIZE);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Marketplace</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">Browse the stockpile.</h1>
          <p className="text-slate-500 font-medium mt-2">
            Animations <span className="text-blue-600 font-bold">$1</span> · Packs from{" "}
            <span className="text-blue-600 font-bold">$5</span> · Cap{" "}
            <span className="text-blue-600 font-bold">$10</span>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3">
            <SearchIcon className="w-4 h-4 text-slate-400 mr-2" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              type="text"
              placeholder="Filter by name..."
              className="bg-transparent outline-none text-sm py-2.5 w-44"
            />
          </div>
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:border-blue-500 transition">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* kind tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {([
          { id: "all",       label: "All",        n: MARKETPLACE.length },
          { id: "animation", label: "Animations", n: MARKETPLACE.filter((m) => m.kind === "animation").length },
          { id: "model",     label: "Models",     n: MARKETPLACE.filter((m) => m.kind === "model").length },
          { id: "pack",      label: "Packs",      n: MARKETPLACE.filter((m) => m.kind === "pack").length },
        ] as { id: Kind; label: string; n: number }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => { setKind(t.id); setPage(1); }}
            className={
              "px-4 py-2 rounded-full text-sm font-bold border transition " +
              (kind === t.id
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-500")
            }
          >
            {t.label}
            <span className="ml-2 text-[10px] font-mono opacity-60">{t.n}</span>
          </button>
        ))}
      </div>

      {/* grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-12">
        {visible.map((item) => (
          <AssetCard key={item.id} item={item} />
        ))}
      </div>

      {visible.length < filtered.length && (
        <div className="text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition"
          >
            Load more &middot; {filtered.length - visible.length} remaining
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-slate-400 py-16 text-sm">
          Nothing matches that filter. Try clearing the search.
        </p>
      )}
    </section>
  );
}
