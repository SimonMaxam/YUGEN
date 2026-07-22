"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { Nigiri, MakiRoll } from "./SushiModels";

/** The whole hero group drifts gently with the pointer for a parallax feel. */
function ParallaxRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    const targetX = state.pointer.y * 0.18;
    const targetY = state.pointer.x * 0.35;
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      3,
      delta,
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      3,
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
  children,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  speed?: number;
  scale?: number;
  children: React.ReactNode;
}) {
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.9}>
      <group position={position} rotation={rotation} scale={scale} data-cursor="food">
        {children}
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#fff4e2"
      />
      <directionalLight position={[-6, 3, -4]} intensity={0.6} color="#ffd9a8" />

      <ParallaxRig>
        <Piece position={[-2.2, 0.6, 0]} rotation={[0.1, 0.4, 0]} speed={1.1}>
          <Nigiri neta="#d24b3a" glossy={0.6} />
        </Piece>
        <Piece position={[2.1, 0.2, -0.5]} rotation={[0.05, -0.5, 0.1]} speed={1.3}>
          <Nigiri neta="#e8845a" glossy={0.7} />
        </Piece>
        <Piece position={[0, -0.9, 0.6]} rotation={[0.2, 0.2, 0]} speed={0.9} scale={1.1}>
          <Nigiri neta="#e6a15c" glossy={0.4} nori />
        </Piece>
        <Piece position={[-1.1, -1.4, -0.8]} rotation={[0, 0.3, 0]} speed={1.4} scale={0.9}>
          <MakiRoll fill="#e07a4f" />
        </Piece>
        <Piece position={[1.4, 1.5, -1]} rotation={[0.3, 0, 0.2]} speed={1.2} scale={0.8}>
          <MakiRoll fill="#c94f3a" />
        </Piece>
      </ParallaxRig>

      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.35}
        scale={12}
        blur={3}
        far={5}
        color="#3a2418"
      />

      {/* Studio reflections built from area lights — no external HDR needed. */}
      <Environment resolution={256}>
        <Lightformer intensity={2} position={[0, 4, 2]} scale={[8, 3, 1]} color="#fff2dc" />
        <Lightformer intensity={1.2} position={[-4, 1, 2]} scale={[3, 5, 1]} color="#ffd9a8" />
        <Lightformer intensity={1} position={[4, -1, 3]} scale={[4, 4, 1]} color="#ffe9cc" />
      </Environment>

      <EffectComposer enableNormalPass={false}>
        <Bloom mipmapBlur intensity={0.35} luminanceThreshold={0.85} radius={0.6} />
        <Vignette eskil={false} offset={0.25} darkness={0.55} />
      </EffectComposer>
    </>
  );
}

export default function SushiScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 8], fov: 38 }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
