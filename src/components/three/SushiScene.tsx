"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import {
  Nigiri,
  MakiRoll,
  Gunkan,
  ChopstickPair,
  CondimentSet,
  ServingBoard,
} from "./SushiModels";

type Look = { x: number; y: number };

/**
 * Tilts the sushi group toward the cursor (and phone gyro). Mouse is tracked
 * on `window` because the canvas itself has pointer-events: none so CTAs stay
 * clickable — R3F's built-in `state.pointer` would stay stuck at 0 otherwise.
 */
function ParallaxRig({
  gyro,
  children,
}: {
  gyro: React.MutableRefObject<Look>;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef<Look>({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      // -1 … 1 from the centre of the viewport
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    function onLeave() {
      mouse.current.x = 0;
      mouse.current.y = 0;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Mouse drives the look; gyro adds on top for phones.
    const targetX = mouse.current.y * 0.38 + gyro.current.x * 0.4;
    const targetY = mouse.current.x * 0.55 + gyro.current.y * 0.5;
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      THREE.MathUtils.clamp(targetX, -0.55, 0.55),
      4,
      delta,
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      THREE.MathUtils.clamp(targetY, -0.85, 0.85),
      4,
      delta,
    );
  });
  return <group ref={group}>{children}</group>;
}

function Piece({
  position,
  rotation = [0, 0, 0],
  speed = 1,
  scale = 1,
  float = true,
  children,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  speed?: number;
  scale?: number;
  float?: boolean;
  children: React.ReactNode;
}) {
  const body = (
    <group position={position} rotation={rotation} scale={scale} data-cursor="food">
      {children}
    </group>
  );
  if (!float) return body;
  return (
    <Float speed={speed} rotationIntensity={0.35} floatIntensity={0.55}>
      {body}
    </Float>
  );
}

function Scene({ lite }: { lite: boolean }) {
  const gyro = useRef<Look>({ x: 0, y: 0 });

  useEffect(() => {
    let baseBeta: number | null = null;
    let baseGamma: number | null = null;

    function onOrient(e: DeviceOrientationEvent) {
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;
      if (baseBeta === null) {
        baseBeta = beta;
        baseGamma = gamma;
      }
      gyro.current.x = THREE.MathUtils.clamp((beta - (baseBeta ?? 0)) / 28, -1, 1);
      gyro.current.y = THREE.MathUtils.clamp((gamma - (baseGamma ?? 0)) / 28, -1, 1);
    }

    window.addEventListener("deviceorientation", onOrient, { passive: true });
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, []);

  return (
    <>
      <ambientLight intensity={lite ? 0.75 : 0.5} />
      <hemisphereLight args={["#fff4e2", "#c9a07a", lite ? 0.55 : 0.35]} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={lite ? 1.7 : 2.3}
        castShadow={!lite}
        shadow-mapSize={lite ? [512, 512] : [1024, 1024]}
        color="#fff4e2"
      />
      {!lite && (
        <>
          <directionalLight position={[-6, 3, -4]} intensity={0.55} color="#ffd9a8" />
          <spotLight
            position={[0, 6, 2]}
            angle={0.55}
            penumbra={0.7}
            intensity={1.3}
            color="#ffe8c4"
          />
        </>
      )}

      <ParallaxRig gyro={gyro}>
        <Piece
          position={[0, -0.15, 0.4]}
          rotation={[0.12, 0.15, 0]}
          speed={0.85}
          scale={1.05}
          float={!lite}
        >
          {!lite && <ServingBoard />}
          <group position={[0, lite ? 0 : 0.2, 0]}>
            <Nigiri variant="maguro" glossy={0.65} lite={lite} />
          </group>
        </Piece>

        <Piece
          position={[-2.35, 0.55, 0.1]}
          rotation={[0.1, 0.45, -0.05]}
          speed={1.1}
          float={!lite}
        >
          <Nigiri variant="salmon" glossy={0.7} lite={lite} />
        </Piece>

        <Piece
          position={[2.25, 0.35, -0.35]}
          rotation={[0.08, -0.55, 0.08]}
          speed={1.2}
          float={!lite}
        >
          <Nigiri variant="hamachi" glossy={0.5} lite={lite} />
        </Piece>

        <Piece
          position={[-1.15, -1.35, -0.55]}
          rotation={[0.15, 0.35, 0]}
          speed={1.35}
          scale={0.95}
          float={!lite}
        >
          <MakiRoll fill="#d8593a" sesame={!lite} />
        </Piece>

        <Piece
          position={[1.55, 1.45, -0.9]}
          rotation={[0.35, -0.2, 0.15]}
          speed={1.15}
          scale={0.85}
          float={!lite}
        >
          <MakiRoll fill="#e8845a" sesame={!lite} />
        </Piece>

        <Piece
          position={[1.9, -1.1, 0.35]}
          rotation={[0.2, -0.3, 0.1]}
          speed={1.05}
          scale={0.9}
          float={!lite}
        >
          <Gunkan roe="#c9455c" lite={lite} />
        </Piece>

        {!lite && (
          <>
            <Piece
              position={[-2.0, 1.55, -0.7]}
              rotation={[0.25, 0.5, -0.1]}
              speed={1.25}
              scale={0.88}
            >
              <Nigiri variant="ebi" nori glossy={0.45} />
            </Piece>
            <Piece
              position={[-0.2, 1.7, -1.2]}
              rotation={[0.5, 0.2, 0.3]}
              speed={0.95}
              scale={0.7}
            >
              <ChopstickPair />
            </Piece>
            <Piece
              position={[0.85, -1.85, 0.9]}
              rotation={[0.1, 0.4, 0]}
              speed={0.8}
              scale={0.75}
            >
              <CondimentSet />
            </Piece>
          </>
        )}
      </ParallaxRig>

      {!lite && (
        <>
          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.32}
            scale={14}
            blur={2.8}
            far={5}
            resolution={256}
            color="#3a2418"
          />
          <Environment resolution={256}>
            <Lightformer intensity={2} position={[0, 4, 2]} scale={[8, 3, 1]} color="#fff2dc" />
            <Lightformer intensity={1.2} position={[-4, 1, 2]} scale={[3, 5, 1]} color="#ffd9a8" />
            <Lightformer intensity={1} position={[4, -1, 3]} scale={[4, 4, 1]} color="#ffe9cc" />
          </Environment>
        </>
      )}
    </>
  );
}

function useIsLiteDevice() {
  const [lite, setLite] = useState(false);
  useEffect(() => {
    const touch =
      window.matchMedia("(pointer: coarse)").matches ||
      (navigator.maxTouchPoints > 0 && window.innerWidth < 900);
    const cores = navigator.hardwareConcurrency ?? 8;
    setLite(touch || cores <= 2);
  }, []);
  return lite;
}

export default function SushiScene() {
  const lite = useIsLiteDevice();

  return (
    <Canvas
      shadows={!lite}
      dpr={lite ? [1, 1.25] : [1, 1.75]}
      gl={{
        antialias: !lite,
        alpha: true,
        powerPreference: lite ? "low-power" : "high-performance",
        stencil: false,
        // Needed so the transparent hero canvas actually composites the sushi.
        premultipliedAlpha: true,
      }}
      camera={{ position: [0, 0.2, 8.2], fov: 36 }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      frameloop="always"
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.style.pointerEvents = "none";
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => e.preventDefault(),
          false,
        );
      }}
    >
      <Suspense fallback={null}>
        <Scene lite={lite} />
      </Suspense>
    </Canvas>
  );
}
