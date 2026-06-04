"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls, Environment, ContactShadows, Html } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { RIG_URL, type ClipSpec } from "@/lib/rig";

/**
 * The universal 3D rig. Loads one rigged humanoid (RobotExpressive.glb) and
 * plays the AnimationClip that expresses the current verb. Same skeleton for
 * every verb => no retargeting; we just select + time-scale the clip.
 */
function Rig({ spec }: { spec: ClipSpec }) {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(RIG_URL);

  // Clone (skeleton-aware) so navigating between verbs doesn't reuse a mounted
  // graph, then normalise to ~2u tall with feet on the floor and centred X/Z.
  const model = useMemo(() => {
    const c = SkeletonUtils.clone(scene) as THREE.Object3D;
    c.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.frustumCulled = false;
      }
    });
    const box = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3();
    box.getSize(size);
    const s = 2 / (size.y || 1);
    c.scale.setScalar(s);
    const box2 = new THREE.Box3().setFromObject(c);
    const center = new THREE.Vector3();
    box2.getCenter(center);
    c.position.x -= center.x;
    c.position.z -= center.z;
    c.position.y -= box2.min.y;
    return c;
  }, [scene]);

  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions || names.length === 0) return;
    const wanted = spec.clip.toLowerCase();
    const key =
      names.find((n) => n.toLowerCase() === wanted) ??
      names.find((n) => n.toLowerCase().includes(wanted)) ??
      names.find((n) => n.toLowerCase() === "idle") ??
      names[0];
    const action = actions[key];
    if (!action) return;
    action.reset();
    action.enabled = true;
    action.setEffectiveTimeScale(spec.timeScale ?? 1);
    action.setEffectiveWeight(1);
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.fadeIn(0.3).play();
    return () => {
      action.fadeOut(0.2);
    };
  }, [actions, names, spec]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={model} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="text-[11px] font-mono text-slate-500 bg-white/85 backdrop-blur px-3 py-1.5 rounded-md">
        loading rig…
      </div>
    </Html>
  );
}

export function RigViewer({ spec, height = 420 }: { spec: ClipSpec; height?: number }) {
  return (
    <div
      className="relative rounded-[2rem] overflow-hidden border border-slate-100 bg-gradient-to-br from-slate-50 to-white"
      style={{ height }}
    >
      <Canvas shadows camera={{ position: [0, 1.3, 4.2], fov: 42 }} dpr={[1, 2]}>
        <color attach="background" args={["#f8fafc"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 3]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
        <Suspense fallback={<Loader />}>
          <Rig spec={spec} />
          <Environment preset="city" />
        </Suspense>
        <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={8} blur={2.4} far={4} />
        <OrbitControls
          enablePan={false}
          minDistance={2.4}
          maxDistance={7}
          minPolarAngle={0.4}
          maxPolarAngle={Math.PI / 1.9}
          target={[0, 1, 0]}
          autoRotate
          autoRotateSpeed={0.9}
        />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
        <span className="bg-white/85 backdrop-blur px-2 py-1 rounded-md text-slate-600">
          clip · {spec.clip}{spec.timeScale && spec.timeScale !== 1 ? ` ×${spec.timeScale}` : ""}
        </span>
        <span className="bg-white/85 backdrop-blur px-2 py-1 rounded-md text-slate-400">
          universal rig · drag to orbit
        </span>
      </div>
    </div>
  );
}

useGLTF.preload(RIG_URL);
