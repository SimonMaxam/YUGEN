"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  RoundedBox,
  Environment,
  Lightformer,
  ContactShadows,
  Float,
} from "@react-three/drei";
import * as THREE from "three";
import type { TimeOfDay } from "@/lib/time-of-day";
import { experiences } from "@/lib/experiences";

interface Palette {
  wall: string;
  floor: string;
  wood: string;
  ambient: number;
  sun: number;
  sunColor: string;
  windowColor: string;
  windowIntensity: number;
  lantern: number;
}

function paletteFor(theme: TimeOfDay): Palette {
  switch (theme) {
    case "morning":
      return {
        wall: "#d9d3c7", floor: "#b9906a", wood: "#caa079",
        ambient: 0.85, sun: 3, sunColor: "#fff6e8",
        windowColor: "#ffffff", windowIntensity: 3, lantern: 0.3,
      };
    case "evening":
      return {
        wall: "#c9b49c", floor: "#a5764f", wood: "#b98a5c",
        ambient: 0.55, sun: 2.4, sunColor: "#ffbe7a",
        windowColor: "#ffb066", windowIntensity: 2.6, lantern: 0.8,
      };
    case "night":
    default:
      return {
        wall: "#26221f", floor: "#332720", wood: "#4a3524",
        ambient: 0.25, sun: 0.3, sunColor: "#3a5a8a",
        windowColor: "#12213f", windowIntensity: 1.2, lantern: 2.2,
      };
  }
}

function Lantern({ position, intensity }: { position: [number, number, number]; intensity: number }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial
          color="#f3e2c4"
          emissive="#ffcf8f"
          emissiveIntensity={intensity}
          transparent
          opacity={0.92}
        />
      </mesh>
      <pointLight color="#ffca86" intensity={intensity * 3} distance={7} decay={2} />
    </group>
  );
}

function Table({
  position,
  index,
  onSelect,
  wood,
}: {
  position: [number, number, number];
  index: number;
  onSelect: (i: number) => void;
  wood: string;
}) {
  const [hovered, setHovered] = useState(false);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring.current) {
      ring.current.rotation.z += 0.005;
      const s = hovered ? 1.15 : 1;
      ring.current.scale.x = THREE.MathUtils.lerp(ring.current.scale.x, s, 0.1);
      ring.current.scale.y = THREE.MathUtils.lerp(ring.current.scale.y, s, 0.1);
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.15;
    }
  });

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
    >
      {/* table top */}
      <RoundedBox args={[1.6, 0.12, 1.0]} radius={0.05} position={[0, 0.72, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={wood} roughness={0.55} />
      </RoundedBox>
      {/* legs */}
      {[[-0.7, 0.4], [0.7, 0.4], [-0.7, -0.4], [0.7, -0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.36, z]} castShadow>
          <boxGeometry args={[0.09, 0.72, 0.09]} />
          <meshStandardMaterial color={wood} roughness={0.6} />
        </mesh>
      ))}
      {/* place settings hint */}
      <mesh position={[-0.35, 0.79, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 24]} />
        <meshStandardMaterial color="#efe9dd" roughness={0.4} />
      </mesh>
      <mesh position={[0.35, 0.79, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 24]} />
        <meshStandardMaterial color="#efe9dd" roughness={0.4} />
      </mesh>
      {/* floating select ring */}
      <Float speed={2} floatIntensity={0.4} rotationIntensity={0}>
        <mesh ref={ring} position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.28, 40]} />
          <meshBasicMaterial color="#d24b3a" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </Float>
    </group>
  );
}

function Room({ theme, onSelect }: { theme: TimeOfDay; onSelect: (i: number) => void }) {
  const p = useMemo(() => paletteFor(theme), [theme]);

  return (
    <>
      <ambientLight intensity={p.ambient} color="#fff0dd" />
      {/* sun through the window */}
      <directionalLight
        position={[-8, 6, 6]}
        intensity={p.sun}
        color={p.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />

      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={p.floor} roughness={0.7} />
      </mesh>

      {/* back concrete wall */}
      <mesh position={[0, 5, -8]} receiveShadow>
        <planeGeometry args={[40, 16]} />
        <meshStandardMaterial color={p.wall} roughness={0.95} />
      </mesh>
      {/* right wall */}
      <mesh position={[10, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 16]} />
        <meshStandardMaterial color={p.wall} roughness={0.95} />
      </mesh>

      {/* floor-to-ceiling window wall (left) with glowing light beyond */}
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[40, 16]} />
        <meshBasicMaterial color={p.windowColor} />
      </mesh>
      {/* window mullions */}
      {[-6, -2, 2, 6].map((z) => (
        <mesh key={z} position={[-9.9, 5, z]}>
          <boxGeometry args={[0.1, 12, 0.18]} />
          <meshStandardMaterial color={p.wood} roughness={0.5} />
        </mesh>
      ))}
      {[2, 5, 8].map((y) => (
        <mesh key={y} position={[-9.9, y, 0]}>
          <boxGeometry args={[0.1, 0.18, 30]} />
          <meshStandardMaterial color={p.wood} roughness={0.5} />
        </mesh>
      ))}

      {/* the hinoki counter */}
      <RoundedBox args={[8, 1.1, 1.4]} radius={0.06} position={[2, 0.55, -5]} castShadow receiveShadow>
        <meshStandardMaterial color={p.wood} roughness={0.45} />
      </RoundedBox>
      {/* counter stools */}
      {[-1.5, 0, 1.5, 3, 4.5].map((x) => (
        <mesh key={x} position={[x + 0.5, 0.5, -3.6]} castShadow>
          <cylinderGeometry args={[0.28, 0.24, 1, 20]} />
          <meshStandardMaterial color={p.wood} roughness={0.5} />
        </mesh>
      ))}

      {/* paper lanterns */}
      <Lantern position={[2, 4.4, -5]} intensity={p.lantern} />
      <Lantern position={[-3, 4, 1]} intensity={p.lantern} />
      <Lantern position={[5, 4, 2]} intensity={p.lantern} />

      {/* clickable tables map to omakase experiences */}
      <Table position={[-4, 0, 2.5]} index={1} onSelect={onSelect} wood={p.wood} />
      <Table position={[0, 0, 4]} index={0} onSelect={onSelect} wood={p.wood} />
      <Table position={[4.5, 0, 3]} index={2} onSelect={onSelect} wood={p.wood} />

      {/* a couple of restrained plants */}
      {[[-8, 6.5], [8.5, -6]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.4, 0.5, 0.8, 16]} />
            <meshStandardMaterial color="#3b3630" roughness={0.8} />
          </mesh>
          {Array.from({ length: 6 }).map((_, j) => (
            <mesh key={j} position={[Math.cos(j) * 0.2, 1.4, Math.sin(j) * 0.2]} rotation={[0, j, 0.3]}>
              <coneGeometry args={[0.12, 1.8, 6]} />
              <meshStandardMaterial color="#4c5c3f" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      <ContactShadows position={[0, 0.02, 0]} opacity={0.4} scale={40} blur={2.5} far={10} color="#000000" />

      <Environment resolution={128}>
        <Lightformer intensity={p.windowIntensity} position={[-9, 5, 0]} rotation={[0, Math.PI / 2, 0]} scale={[30, 16, 1]} color={p.windowColor} />
        <Lightformer intensity={p.lantern} position={[2, 4, -4]} scale={[4, 4, 1]} color="#ffca86" />
      </Environment>
    </>
  );
}

export default function RestaurantScene({
  theme,
  onSelect,
}: {
  theme: TimeOfDay;
  onSelect: (i: number) => void;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [9, 5.5, 10], fov: 42 }}
    >
      <color attach="background" args={[theme === "night" ? "#0d0c0e" : "#e7ddcf"]} />
      <fog attach="fog" args={[theme === "night" ? "#0d0c0e" : "#e7ddcf", 18, 40]} />
      <Suspense fallback={null}>
        <Room theme={theme} onSelect={onSelect} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={20}
        minPolarAngle={0.5}
        maxPolarAngle={Math.PI / 2.15}
        autoRotate
        autoRotateSpeed={0.35}
        target={[0, 1.2, 0]}
        makeDefault
      />
    </Canvas>
  );
}

export { experiences };
