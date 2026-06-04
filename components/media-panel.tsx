"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Box, PersonStanding, type LucideIcon } from "lucide-react";
import { Viewer } from "@/components/viewer";
import { RigViewer } from "@/components/rig-viewer";
import type { ClipSpec } from "@/lib/rig";

/**
 * Detail-page media area. Shows the rendered still by default (so the picture
 * is visible the moment you open the page) with a tab to the live 3D rig. When
 * a verb clip (`rig`) is supplied, the 3D tab plays the universal rig animated
 * to that verb; otherwise it falls back to the placeholder spinner.
 */
export function MediaPanel({
  kind,
  slug,
  alt,
  height = 420,
  rig,
}: {
  kind: "verb" | "noun";
  slug: string;
  alt: string;
  height?: number;
  rig?: ClipSpec;
}) {
  const [tab, setTab] = useState<"render" | "3d">("render");
  const img = `/img/${kind}s/${kind}-${slug}.png`;

  // Allow deep-linking straight to the live rig: /verbs/sprint/?view=3d (or #3d).
  useEffect(() => {
    if (!rig) return;
    const wants3d =
      new URLSearchParams(window.location.search).get("view") === "3d" ||
      window.location.hash.toLowerCase() === "#3d";
    if (wants3d) setTab("3d");
  }, [rig]);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <Tab active={tab === "render"} onClick={() => setTab("render")} icon={ImageIcon} label="Render" />
        <Tab
          active={tab === "3d"}
          onClick={() => setTab("3d")}
          icon={rig ? PersonStanding : Box}
          label={rig ? "3D rig" : "3D preview"}
        />
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
      ) : rig ? (
        <RigViewer spec={rig} height={height} />
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
