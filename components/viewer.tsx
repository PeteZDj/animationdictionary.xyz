"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import type { Mesh } from "three";

/**
 * Placeholder 3D viewer. Renders a slowly tumbling primitive so the page
 * has *some* WebGL motion in it. The shape and color are derived from a
 * label so /verbs/run and /nouns/bird get distinct previews.
 *
 * Real rigged .glb models will swap into this slot in a later phase.
 */

const PALETTE = [
  "#2563eb", "#0ea5e9", "#f59e0b", "#ef4444",
  "#10b981", "#a855f7", "#14b8a6", "#f43f5e",
];

function colorFor(label: string): string {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = ((h << 5) - h + label.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

type Shape = "box" | "torus" | "ico" | "sphere" | "dodec";

function shapeFor(label: string): Shape {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = ((h << 5) - h + label.charCodeAt(i)) | 0;
  const opts: Shape[] = ["box", "torus", "ico", "sphere", "dodec"];
  return opts[Math.abs(h) % opts.length];
}

function Spinner({ label }: { label: string }) {
  const ref = useRef<Mesh>(null!);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.4;
    ref.current.rotation.y += dt * 0.6;
  });
  const color = colorFor(label);
  const shape = shapeFor(label);

  return (
    <mesh ref={ref} castShadow receiveShadow>
      {shape === "box"    && <boxGeometry args={[1.2, 1.2, 1.2]} />}
      {shape === "torus"  && <torusGeometry args={[0.8, 0.32, 32, 96]} />}
      {shape === "ico"    && <icosahedronGeometry args={[1, 0]} />}
      {shape === "sphere" && <sphereGeometry args={[1, 48, 48]} />}
      {shape === "dodec"  && <dodecahedronGeometry args={[1.05, 0]} />}
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.35} />
    </mesh>
  );
}

export function Viewer({ label = "preview", height = 360 }: { label?: string; height?: number }) {
  return (
    <div
      className="relative rounded-[2rem] overflow-hidden border border-slate-100 bg-gradient-to-br from-slate-50 to-white"
      style={{ height }}
    >
      <Canvas camera={{ position: [2.4, 1.6, 2.4], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 2]} intensity={1.1} />
        <Suspense fallback={null}>
          <Spinner label={label} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
        <span className="bg-white/85 backdrop-blur px-2 py-1 rounded-md text-slate-600">
          preview · placeholder
        </span>
        <span className="bg-white/85 backdrop-blur px-2 py-1 rounded-md text-slate-400">
          rigged .glb · coming
        </span>
      </div>
    </div>
  );
}
