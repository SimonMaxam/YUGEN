"use client";

import { Suspense, useLayoutEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { TimeOfDay } from "@/lib/time-of-day";
import { experiences } from "@/lib/experiences";
import { paletteFor, ROOM } from "./restaurant/config";
import { Room } from "./restaurant/Room";
import { WalkControls, type JoystickState } from "./restaurant/WalkControls";

const HDRI = "/hdri/pergola_1k.exr";

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
 * A cheap gradient "sky" seen through the glass wall on phones (where loading a
 * multi-megabyte HDRI would blow the memory budget). One plane, one tiny
 * canvas texture — costs virtually nothing.
 */
function BackdropSky() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 256;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, "#f7d49c");
      g.addColorStop(0.5, "#ecb277");
      g.addColorStop(0.72, "#cf9560");
      g.addColorStop(0.74, "#75834f");
      g.addColorStop(1, "#495637");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 4, 256);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <mesh position={[-ROOM.halfW - 3, ROOM.height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[36, 24]} />
      <meshBasicMaterial map={texture} toneMapped={false} fog={false} />
    </mesh>
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
  isTouch,
  lowPower,
  joystick,
  onSelect,
  onNearest,
  onExit,
}: RestaurantSceneProps) {
  const p = useMemo(() => paletteFor(theme), [theme]);
  const reflections = !lowPower && !isTouch;
  // Only desktops load the heavy HDRI; phones get a light gradient sky instead.
  const useEnv = !lowPower;

  return (
    <Canvas
      shadows={!lowPower}
      dpr={lowPower ? [1, 1.3] : [1, 1.9]}
      gl={{
        antialias: !lowPower,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        failIfMajorPerformanceCaveat: false,
      }}
      camera={{ position: [10, 6, 11], fov: 44, near: 0.1, far: 100 }}
      onCreated={({ gl }) => {
        // Recover gracefully if the mobile GPU drops the WebGL context.
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => e.preventDefault(),
          false,
        );
      }}
    >
      {(!useEnv || !p.showSky) && <color attach="background" args={[p.bg]} />}
      <fog attach="fog" args={[p.bg, 20, 52]} />

      {useEnv ? (
        <Suspense fallback={null}>
          <Environment
            files={HDRI}
            background={p.showSky}
            backgroundBlurriness={0.04}
            backgroundIntensity={theme === "morning" ? 1 : 0.85}
            environmentIntensity={p.envIntensity}
            resolution={512}
          />
        </Suspense>
      ) : (
        <>
          {/* compensate for the missing image-based lighting */}
          <hemisphereLight args={["#ffedd0", "#b98a5c", 0.55]} />
          <BackdropSky />
        </>
      )}

      <Room p={p} mode={mode} reflections={reflections} onSelect={onSelect} />

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
