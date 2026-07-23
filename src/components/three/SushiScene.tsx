"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

export type ScrollProgressRef = React.MutableRefObject<number>;

/**
 * Camera dollies through the sushi arrangement as the page scrolls —
 * same idea as the Horizon demo, but warm / restaurant, not cosmos.
 * Scroll up reverses it smoothly via the shared progress ref.
 */
function ScrollCamera({
  progressRef,
  lite,
}: {
  progressRef: ScrollProgressRef;
  lite: boolean;
}) {
  const { camera } = useThree();
  const smooth = useRef(0);
  const look = useRef(new THREE.Vector3(0, 0, 0));

  // Keyframes: start wide → glide in → intimate close-up
  const keys = lite
    ? [
        { p: 0, pos: [0, 0.25, 8.4] as const, look: [0, 0, 0] as const },
        { p: 1, pos: [0.4, 0.55, 5.2] as const, look: [0, 0.1, 0] as const },
      ]
    : [
        { p: 0, pos: [0, 0.2, 8.4] as const, look: [0, 0, 0] as const },
        { p: 0.45, pos: [1.1, 0.55, 5.8] as const, look: [0.1, 0.1, -0.2] as const },
        { p: 1, pos: [-0.6, 0.9, 3.6] as const, look: [0, 0.15, 0] as const },
      ];

  useFrame((_, delta) => {
    const target = progressRef.current;
    smooth.current = THREE.MathUtils.damp(smooth.current, target, 3.2, delta);
    const t = smooth.current;

    // Find surrounding keyframes and lerp
    let a = keys[0];
    let b = keys[keys.length - 1];
    for (let i = 0; i < keys.length - 1; i++) {
      if (t >= keys[i].p && t <= keys[i + 1].p) {
        a = keys[i];
        b = keys[i + 1];
        break;
      }
    }
    const span = Math.max(0.0001, b.p - a.p);
    const u = THREE.MathUtils.clamp((t - a.p) / span, 0, 1);
    const e = u * u * (3 - 2 * u); // smoothstep

    camera.position.x = THREE.MathUtils.lerp(a.pos[0], b.pos[0], e);
    camera.position.y = THREE.MathUtils.lerp(a.pos[1], b.pos[1], e);
    camera.position.z = THREE.MathUtils.lerp(a.pos[2], b.pos[2], e);

    look.current.set(
      THREE.MathUtils.lerp(a.look[0], b.look[0], e),
      THREE.MathUtils.lerp(a.look[1], b.look[1], e),
      THREE.MathUtils.lerp(a.look[2], b.look[2], e),
    );
    camera.lookAt(look.current);
  });

  return null;
}

/**
 * Warm floating ember / dust motes + soft mist sheets for depth —
 * YŪGEN atmosphere, not a starfield.
 */
function Atmosphere({
  progressRef,
  lite,
}: {
  progressRef: ScrollProgressRef;
  lite: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const mist = useRef<THREE.Mesh>(null);
  const mistMat = useRef<THREE.MeshBasicMaterial>(null);

  const positions = useMemo(() => {
    const count = lite ? 80 : 220;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    return arr;
  }, [lite]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    if (group.current) {
      group.current.position.z = THREE.MathUtils.damp(
        group.current.position.z,
        p * 2.4,
        2.5,
        delta,
      );
      group.current.rotation.y = t * 0.02;
    }
    if (mist.current) {
      mist.current.position.z = -4 - p * 3;
    }
    if (mistMat.current) {
      mistMat.current.opacity = 0.08 + p * 0.1;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#e8b07a"
          size={lite ? 0.04 : 0.055}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <mesh ref={mist} position={[0, 0, -4]}>
        <planeGeometry args={[22, 14]} />
        <meshBasicMaterial
          ref={mistMat}
          color="#f0d2a8"
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>
      {!lite && (
        <>
          <mesh position={[-5, -1.5, -6]} rotation={[0.1, 0.3, 0]}>
            <planeGeometry args={[10, 8]} />
            <meshBasicMaterial
              color="#d24b3a"
              transparent
              opacity={0.04}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[5, 1, -7]} rotation={[-0.1, -0.25, 0]}>
            <planeGeometry args={[9, 7]} />
            <meshBasicMaterial
              color="#c9a06a"
              transparent
              opacity={0.05}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

/** Mouse / gyro tilt on the sushi cluster. */
function ParallaxRig({
  gyro,
  progressRef,
  children,
}: {
  gyro: React.MutableRefObject<Look>;
  progressRef: ScrollProgressRef;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef<Look>({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
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
    const p = progressRef.current;
    // Slightly less mouse influence as we scroll in close.
    const damp = 1 - p * 0.35;
    const targetX = (mouse.current.y * 0.38 + gyro.current.x * 0.4) * damp;
    const targetY = (mouse.current.x * 0.55 + gyro.current.y * 0.5) * damp;
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
    // Parallax depth: whole cluster drifts toward camera a little on scroll.
    group.current.position.z = THREE.MathUtils.damp(
      group.current.position.z,
      p * 1.2,
      2.8,
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
  depth = 1,
  progressRef,
  children,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  speed?: number;
  scale?: number;
  float?: boolean;
  depth?: number;
  progressRef?: ScrollProgressRef;
  children: React.ReactNode;
}) {
  const offset = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!offset.current || !progressRef) return;
    const p = progressRef.current;
    offset.current.position.z = THREE.MathUtils.damp(
      offset.current.position.z,
      p * depth * 1.8,
      3,
      delta,
    );
  });

  const body = (
    <group position={position} rotation={rotation} scale={scale} data-cursor="food">
      {children}
    </group>
  );

  return (
    <group ref={offset}>
      {float ? (
        <Float speed={speed} rotationIntensity={0.35} floatIntensity={0.55}>
          {body}
        </Float>
      ) : (
        body
      )}
    </group>
  );
}

function Scene({
  lite,
  progressRef,
}: {
  lite: boolean;
  progressRef: ScrollProgressRef;
}) {
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
      <ScrollCamera progressRef={progressRef} lite={lite} />
      <Atmosphere progressRef={progressRef} lite={lite} />

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

      <ParallaxRig gyro={gyro} progressRef={progressRef}>
        <Piece
          position={[0, -0.15, 0.4]}
          rotation={[0.12, 0.15, 0]}
          speed={0.85}
          scale={1.05}
          float={!lite}
          depth={0.6}
          progressRef={progressRef}
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
          depth={1.1}
          progressRef={progressRef}
        >
          <Nigiri variant="salmon" glossy={0.7} lite={lite} />
        </Piece>

        <Piece
          position={[2.25, 0.35, -0.35]}
          rotation={[0.08, -0.55, 0.08]}
          speed={1.2}
          float={!lite}
          depth={1.4}
          progressRef={progressRef}
        >
          <Nigiri variant="hamachi" glossy={0.5} lite={lite} />
        </Piece>

        <Piece
          position={[-1.15, -1.35, -0.55]}
          rotation={[0.15, 0.35, 0]}
          speed={1.35}
          scale={0.95}
          float={!lite}
          depth={1.8}
          progressRef={progressRef}
        >
          <MakiRoll fill="#d8593a" sesame={!lite} />
        </Piece>

        <Piece
          position={[1.55, 1.45, -0.9]}
          rotation={[0.35, -0.2, 0.15]}
          speed={1.15}
          scale={0.85}
          float={!lite}
          depth={2.2}
          progressRef={progressRef}
        >
          <MakiRoll fill="#e8845a" sesame={!lite} />
        </Piece>

        <Piece
          position={[1.9, -1.1, 0.35]}
          rotation={[0.2, -0.3, 0.1]}
          speed={1.05}
          scale={0.9}
          float={!lite}
          depth={1.0}
          progressRef={progressRef}
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
              depth={2.0}
              progressRef={progressRef}
            >
              <Nigiri variant="ebi" nori glossy={0.45} />
            </Piece>
            <Piece
              position={[-0.2, 1.7, -1.2]}
              rotation={[0.5, 0.2, 0.3]}
              speed={0.95}
              scale={0.7}
              depth={2.4}
              progressRef={progressRef}
            >
              <ChopstickPair />
            </Piece>
            <Piece
              position={[0.85, -1.85, 0.9]}
              rotation={[0.1, 0.4, 0]}
              speed={0.8}
              scale={0.75}
              depth={0.5}
              progressRef={progressRef}
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

export default function SushiScene({
  progressRef,
}: {
  progressRef: ScrollProgressRef;
}) {
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
        premultipliedAlpha: true,
      }}
      camera={{ position: [0, 0.2, 8.4], fov: 36 }}
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
        <Scene lite={lite} progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
