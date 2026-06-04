"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls, ContactShadows, Html } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { RIG_URL, type ClipSpec } from "@/lib/rig";

/**
 * The universal 3D rig. One rigged humanoid (RobotExpressive.glb) carries every
 * verb's motion on a single skeleton, so there is no retargeting — we just pick
 * and time-scale the clip.
 *
 * Framing is done by hand (NOT drei <Stage>/<Bounds>, which mis-frame this
 * model) using the rig's KNOWN fixed dimensions. We deliberately do not measure
 * the live model at runtime: a SkeletonUtils-cloned skinned mesh driven by an
 * AnimationMixer reports a wildly inflated bounding box (bones at unsettled
 * world positions), which would shove the camera hundreds of units away and
 * leave the character a speck. With fixed metrics the body always fills ~85% of
 * the view, centred — big and close like the still render, for every verb.
 */
const FRAME_MARGIN = 1.15;
// Measured from RobotExpressive.glb across its clips (feet ~y0, head ~y4.8).
const RIG_CENTER = { x: 0, y: 2.35, z: 0.1 };
const RIG_HALF_H = 2.5;
const RIG_HALF_W = 1.9;

function Rig({ spec }: { spec: ClipSpec }) {
  const { scene, animations } = useGLTF(RIG_URL);
  const { camera, controls, size } = useThree();

  const model = useMemo(() => {
    const c = SkeletonUtils.clone(scene) as THREE.Object3D;
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // Skinned meshes report stale bounds when posed; never cull them.
        mesh.frustumCulled = false;
      }
    });
    return c;
  }, [scene]);

  const { actions, names } = useAnimations(animations, model);

  // Deterministic camera framing — fill the frame with the whole character.
  useLayoutEffect(() => {
    const { x: cx, y: midY, z: cz } = RIG_CENTER;
    const cam = camera as THREE.PerspectiveCamera;
    const t = Math.tan((cam.fov * Math.PI) / 180 / 2);
    const aspect = size.width / size.height || 1;
    const dist = Math.max(RIG_HALF_H / t, RIG_HALF_W / (t * aspect)) * FRAME_MARGIN;

    cam.position.set(cx, midY, cz + dist);
    cam.near = Math.max(0.05, dist - RIG_HALF_H * 3);
    cam.far = dist + RIG_HALF_H * 8;
    cam.updateProjectionMatrix();

    const ctrl = controls as unknown as {
      target: THREE.Vector3;
      minDistance: number;
      maxDistance: number;
      update: () => void;
    } | null;
    if (ctrl?.target) {
      ctrl.target.set(cx, midY, cz);
      ctrl.minDistance = dist * 0.55;
      ctrl.maxDistance = dist * 2.2;
      ctrl.update();
    } else {
      cam.lookAt(cx, midY, cz);
    }
  }, [model, camera, controls, size.width, size.height]);

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
    <>
      <primitive object={model} />
      <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={9} blur={2.6} far={5} resolution={1024} />
    </>
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
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        camera={{ fov: 35, position: [0, 2.3, 9], near: 0.1, far: 100 }}
      >
        <color attach="background" args={["#eef2f7"]} />
        <hemisphereLight args={["#ffffff", "#8d99ae", 1.1]} />
        <directionalLight
          position={[3, 7, 5]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0002}
        />
        <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#bfd4ff" />
        <Suspense fallback={<Loader />}>
          <Rig spec={spec} />
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI / 1.9}
        />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono pointer-events-none">
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
