"use client";

import { Suspense, useLayoutEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { TimeOfDay } from "@/lib/time-of-day";
import { experiences } from "@/lib/experiences";
import { paletteFor } from "./restaurant/config";
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

  return (
    <Canvas
      shadows={!lowPower}
      dpr={lowPower ? [1, 1.4] : [1, 1.9]}
      gl={{
        antialias: !lowPower,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ position: [10, 6, 11], fov: 44, near: 0.1, far: 100 }}
    >
      {!p.showSky && <color attach="background" args={[p.bg]} />}
      <fog attach="fog" args={[p.bg, 20, 52]} />

      <Suspense fallback={null}>
        <Environment
          files={HDRI}
          background={p.showSky}
          backgroundBlurriness={0.04}
          backgroundIntensity={theme === "morning" ? 1 : 0.85}
          environmentIntensity={p.envIntensity}
          resolution={lowPower ? 256 : 512}
        />
      </Suspense>

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
