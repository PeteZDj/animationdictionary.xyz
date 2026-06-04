"use client";

import { useState } from "react";
import { ImageIcon, Box, type LucideIcon } from "lucide-react";
import { Viewer } from "@/components/viewer";

/**
 * Detail-page media area. Shows the rendered still by default (so the picture
 * is visible the moment you open the page) with a tab to the placeholder 3D
 * viewer. Real rigged .glb models will replace the 3D tab in a later phase.
 */
export function MediaPanel({
  kind,
  slug,
  alt,
  height = 420,
}: {
  kind: "verb" | "noun";
  slug: string;
  alt: string;
  height?: number;
}) {
  const [tab, setTab] = useState<"render" | "3d">("render");
  const img = `/img/${kind}s/${kind}-${slug}.png`;

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <Tab active={tab === "render"} onClick={() => setTab("render")} icon={ImageIcon} label="Render" />
        <Tab active={tab === "3d"} onClick={() => setTab("3d")} icon={Box} label="3D preview" />
      </div>

      {tab === "render" ? (
        <div
          className="relative rounded-[2rem] overflow-hidden border border-slate-100 bg-gradient-to-br from-slate-100 to-slate-50"
          style={{ height }}
        >
          <img src={img} alt={alt} className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
            <span className="bg-white/85 backdrop-blur px-2 py-1 rounded-md text-slate-600">render · {slug}</span>
            <span className="bg-white/85 backdrop-blur px-2 py-1 rounded-md text-slate-400">still · .png</span>
          </div>
        </div>
      ) : (
        <Viewer label={`${kind}-${slug}`} height={height} />
      )}
    </div>
  );
}

function Tab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition " +
        (active
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-500 border-slate-200 hover:border-slate-400")
      }
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}
