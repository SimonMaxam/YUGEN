"use client";

import { useLayoutEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { TimeOfDay } from "@/lib/time-of-day";
import { experiences } from "@/lib/experiences";
import { paletteFor, ROOM } from "./restaurant/config";
import { Room } from "./restaurant/Room";
import { WalkControls, type JoystickState } from "./restaurant/WalkControls";

/** Places the camera at a flattering orbit position when (re)entering orbit. */
function OrbitReset() {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(10, 6, 11);
    camera.lookAt(0, 1.2, 0);
  }, [camera]);
  return null;
}

/**
 * Lightweight outdoor view for the glass wall — one canvas texture + soft
 * canopy silhouettes. No HDRI download.
 */
function OutdoorBackdrop() {
  const sky = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 8;
    c.height = 256;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, "#f8e2b4");
      g.addColorStop(0.42, "#f0c48a");
      g.addColorStop(0.7, "#d9a06a");
      g.addColorStop(0.74, "#7a8a52");
      g.addColorStop(1, "#4a5634");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 8, 256);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, []);

  const trees = useMemo(
    () =>
      [
        { z: -7, y: 1.8, r: 2.2, c: "#5a6840" },
        { z: -3, y: 1.4, r: 1.7, c: "#4d5a36" },
        { z: 1.5, y: 1.6, r: 2.0, c: "#55623c" },
        { z: 6, y: 1.5, r: 1.9, c: "#4f5c38" },
        { z: 9, y: 1.2, r: 1.4, c: "#5a6840" },
      ] as const,
    [],
  );

  const x = -ROOM.halfW - 4;

  return (
    <group>
      <mesh position={[x, ROOM.height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[42, 28]} />
        <meshBasicMaterial map={sky} toneMapped={false} fog={false} />
      </mesh>
      <mesh position={[x + 1.5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 40]} />
        <meshBasicMaterial color="#6a7a48" toneMapped={false} fog={false} />
      </mesh>
      {trees.map((t, i) => (
        <group key={i} position={[x + 0.6, 0, t.z]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 1.0, 6]} />
            <meshBasicMaterial color="#3a2e22" toneMapped={false} fog={false} />
          </mesh>
          <mesh position={[0, t.y, 0]}>
            <sphereGeometry args={[t.r, 10, 10]} />
            <meshBasicMaterial color={t.c} toneMapped={false} fog={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export interface RestaurantSceneProps {
  theme: TimeOfDay;
  mode: "orbit" | "walk";
  isTouch: boolean;
  lowPower: boolean;
  joystick: React.MutableRefObject<JoystickState>;
  onSelect: (i: number) => void;
  onNearest: (index: number | null) => void;
  onExit: () => void;
}

export default function RestaurantScene({
  theme,
  mode,
  lowPower,
  isTouch,
  joystick,
  onSelect,
  onNearest,
  onExit,
}: RestaurantSceneProps) {
  const p = useMemo(() => paletteFor(theme), [theme]);
  // Reflections are the second-biggest GPU cost after HDRI — keep them off on
  // phones / low-power machines.
  const reflections = !lowPower && !isTouch;

  return (
    <Canvas
      shadows={!lowPower}
      dpr={lowPower ? [1, 1.15] : [1, 1.5]}
      gl={{
        antialias: !lowPower,
        powerPreference: lowPower ? "low-power" : "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        failIfMajorPerformanceCaveat: false,
        // Cap buffer memory: no stencil, no alpha, and a shallow depth buffer.
        alpha: false,
        stencil: false,
        depth: true,
      }}
      camera={{ position: [10, 6, 11], fov: 44, near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => e.preventDefault(),
          false,
        );
      }}
    >
      <color attach="background" args={[p.bg]} />
      <fog attach="fog" args={[p.bg, 18, 42]} />

      {/* Soft image-based-feeling fill without any HDRI download. */}
      <hemisphereLight args={["#ffe6c2", "#9a6a42", 0.55]} />
      <OutdoorBackdrop />

      <Room
        p={p}
        mode={mode}
        reflections={reflections}
        lowPower={lowPower}
        onSelect={onSelect}
      />

      {mode === "walk" ? (
        <WalkControls
          enabled
          isTouch={isTouch}
          joystick={joystick}
          onNearest={onNearest}
          onExit={onExit}
        />
      ) : (
        <>
          <OrbitReset />
          <OrbitControls
            enablePan={false}
            minDistance={6}
            maxDistance={19}
            minPolarAngle={0.45}
            maxPolarAngle={Math.PI / 2.15}
            autoRotate
            autoRotateSpeed={0.32}
            target={[0, 1.2, 0]}
            makeDefault
          />
        </>
      )}
    </Canvas>
  );
}

export { experiences };
