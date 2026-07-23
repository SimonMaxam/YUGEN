"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  RoundedBox,
  MeshReflectorMaterial,
  Float,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { ROOM, type Palette } from "./config";

/* ------------------------------- Props -------------------------------- */

function Lantern({
  position,
  intensity,
  withLight = true,
}: {
  position: [number, number, number];
  intensity: number;
  withLight?: boolean;
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial
          color="#f3e2c4"
          emissive="#ffcf8f"
          emissiveIntensity={intensity}
          transparent
          opacity={0.94}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
        <meshStandardMaterial color="#2a2622" />
      </mesh>
      {withLight && (
        <pointLight color="#ffca86" intensity={intensity * 2.4} distance={7} decay={2} />
      )}
    </group>
  );
}

/** A single piece of nigiri: rice base + a draped neta on top. */
function Nigiri({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <capsuleGeometry args={[0.05, 0.14, 4, 10]} />
        <meshStandardMaterial color="#f6efe0" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.055, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.055, 0.16, 4, 10]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Plate({
  position,
  netaColor,
}: {
  position: [number, number, number];
  netaColor: string;
}) {
  return (
    <group position={position}>
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[0.24, 0.22, 0.03, 32]} />
        <meshStandardMaterial color="#171512" roughness={0.3} metalness={0.1} />
      </mesh>
      <Nigiri position={[-0.08, 0.03, 0]} color={netaColor} />
      <Nigiri position={[0.08, 0.03, 0.02]} color={netaColor} />
    </group>
  );
}

function Stool({
  position,
  wood,
}: {
  position: [number, number, number];
  wood: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.2, 0.08, 24]} />
        <meshStandardMaterial color={wood} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.52, 12]} />
        <meshStandardMaterial color="#201c18" roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  );
}

function DiningTable({
  position,
  index,
  mode,
  wood,
  onSelect,
}: {
  position: [number, number, number];
  index: number;
  mode: "orbit" | "walk";
  wood: string;
  onSelect: (i: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring.current) {
      ring.current.rotation.z += 0.006;
      const s = hovered ? 1.18 : 1;
      ring.current.scale.setScalar(THREE.MathUtils.lerp(ring.current.scale.x, s, 0.12));
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.45 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.18;
    }
  });

  return (
    <group
      position={position}
      onClick={(e) => {
        if (mode !== "orbit") return;
        e.stopPropagation();
        onSelect(index);
      }}
      onPointerOver={(e) => {
        if (mode !== "orbit") return;
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
    >
      <RoundedBox
        args={[1.5, 0.1, 0.9]}
        radius={0.04}
        position={[0, 0.74, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={wood} roughness={0.4} />
      </RoundedBox>
      {[
        [-0.62, 0.34],
        [0.62, 0.34],
        [-0.62, -0.34],
        [0.62, -0.34],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.37, z]} castShadow>
          <boxGeometry args={[0.07, 0.74, 0.07]} />
          <meshStandardMaterial color="#241d17" roughness={0.6} />
        </mesh>
      ))}
      <Plate position={[-0.32, 0.8, 0]} netaColor="#d8593a" />
      <Plate position={[0.32, 0.8, 0.04]} netaColor="#e8a26a" />
      {/* place mats */}
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[x, 0.795, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 0.34]} />
          <meshStandardMaterial color="#efe7d6" roughness={0.8} />
        </mesh>
      ))}
      {mode === "orbit" && (
        <Float speed={2} floatIntensity={0.4} rotationIntensity={0}>
          <mesh ref={ring} position={[0, 1.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.26, 40]} />
            <meshBasicMaterial
              color="#d24b3a"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      )}
    </group>
  );
}

function Bottle({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.32, 12]} />
        <meshStandardMaterial
          color={color}
          roughness={0.15}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.12, 10]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Plant({ position }: { position: [number, number, number] }) {
  const blades = useMemo(
    () => Array.from({ length: 7 }).map((_, j) => ({ a: (j / 7) * Math.PI * 2, t: 0.2 + (j % 3) * 0.08 })),
    [],
  );
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.42, 0.7, 18]} />
        <meshStandardMaterial color="#2f2a24" roughness={0.85} />
      </mesh>
      {blades.map((b, j) => (
        <mesh
          key={j}
          position={[Math.cos(b.a) * 0.18, 1.35, Math.sin(b.a) * 0.18]}
          rotation={[b.t, b.a, b.t]}
          castShadow
        >
          <coneGeometry args={[0.1, 1.7, 5]} />
          <meshStandardMaterial color="#48583c" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------- Room -------------------------------- */

export function Room({
  p,
  mode,
  reflections,
  onSelect,
}: {
  p: Palette;
  mode: "orbit" | "walk";
  reflections: boolean;
  onSelect: (i: number) => void;
}) {
  const { halfW, halfD, height } = ROOM;

  return (
    <group>
      {/* key + fill lighting (sun rakes through the glass wall) */}
      <ambientLight intensity={p.ambient} color="#fff2df" />
      <hemisphereLight args={["#fff4e2", p.floor, p.ambient * 0.6]} />
      <directionalLight
        position={[-9, 7, 4]}
        intensity={p.sun}
        color={p.sunColor}
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0004}
      />

      {/* ---------------------------- Floor --------------------------- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[halfW * 2, halfD * 2]} />
        {reflections ? (
          <MeshReflectorMaterial
            resolution={512}
            mixBlur={1}
            mixStrength={2.2}
            blur={[300, 80]}
            roughness={0.75}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.2}
            color={p.floor}
            metalness={0.35}
          />
        ) : (
          <meshStandardMaterial color={p.floor} roughness={0.65} metalness={0.1} />
        )}
      </mesh>

      {/* plank seams for a wooden floor feel */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-halfW + 0.2 + i * ((halfW * 2) / 9), 0.006, 0]}
        >
          <planeGeometry args={[0.02, halfD * 2]} />
          <meshBasicMaterial color={p.woodDark} transparent opacity={0.25} />
        </mesh>
      ))}

      {/* --------------------------- Ceiling -------------------------- */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[halfW * 2, halfD * 2]} />
        <meshStandardMaterial color={p.wallWarm} roughness={0.95} side={THREE.BackSide} />
      </mesh>
      {/* recessed ceiling cove */}
      <mesh position={[0, height - 0.05, 0]}>
        <boxGeometry args={[halfW * 1.5, 0.06, 0.3]} />
        <meshStandardMaterial
          color="#fff4e2"
          emissive="#ffdca6"
          emissiveIntensity={p.lantern > 1 ? 1.4 : 0.5}
        />
      </mesh>

      {/* ---------------------------- Walls --------------------------- */}
      {/* back wall */}
      <mesh position={[0, height / 2, -halfD]} receiveShadow>
        <planeGeometry args={[halfW * 2, height]} />
        <meshStandardMaterial color={p.wall} roughness={0.96} />
      </mesh>
      {/* right wall */}
      <mesh position={[halfW, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[halfD * 2, height]} />
        <meshStandardMaterial color={p.wall} roughness={0.96} />
      </mesh>
      {/* front wall (behind the entrance) */}
      <mesh position={[0, height / 2, halfD]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[halfW * 2, height]} />
        <meshStandardMaterial color={p.wallWarm} roughness={0.96} />
      </mesh>

      {/* left = floor-to-ceiling glass. We leave the opening clear so the EXR
          sky shows through, and frame it with dark mullions + a faint glass
          reflection pane. */}
      {[-4.5, -1.5, 1.5, 4.5].map((z) => (
        <mesh key={`v${z}`} position={[-halfW + 0.05, height / 2, z]} castShadow>
          <boxGeometry args={[0.08, height, 0.12]} />
          <meshStandardMaterial color="#1c1814" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}
      {[0.8, height - 0.8].map((y) => (
        <mesh key={`h${y}`} position={[-halfW + 0.05, y, 0]}>
          <boxGeometry args={[0.08, 0.12, halfD * 2]} />
          <meshStandardMaterial color="#1c1814" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}
      {/* faint glass sheen */}
      <mesh position={[-halfW + 0.04, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[halfD * 2, height]} />
        <meshStandardMaterial
          color="#bcd4e6"
          transparent
          opacity={0.05}
          roughness={0.05}
          metalness={0.2}
        />
      </mesh>

      {/* ----------------------- Hinoki counter ----------------------- */}
      <RoundedBox
        args={[8.4, 1.05, 1.3]}
        radius={0.05}
        position={[0.5, 0.53, -5.2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={p.wood} roughness={0.4} />
      </RoundedBox>
      {/* counter top lip */}
      <mesh position={[0.5, 1.08, -5.05]} castShadow>
        <boxGeometry args={[8.5, 0.05, 1.5]} />
        <meshStandardMaterial color={p.wood} roughness={0.3} metalness={0.05} />
      </mesh>
      {[-3, -1.4, 0.2, 1.8, 3.4].map((x) => (
        <Stool key={x} position={[x + 0.5, 0, -4.15]} wood={p.wood} />
      ))}
      {/* plated omakase on the counter */}
      {[-2.6, -1, 0.6, 2.2, 3.8].map((x, i) => (
        <Plate
          key={x}
          position={[x + 0.5, 1.12, -4.7]}
          netaColor={["#d8593a", "#e8a26a", "#c9455c", "#e0b26a", "#d8593a"][i]}
        />
      ))}

      {/* ----------------------- Sake shelf (right) ------------------- */}
      <group position={[halfW - 0.35, 0, -1]}>
        {[1.1, 1.75, 2.4].map((y) => (
          <mesh key={y} position={[0, y, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.4, 0.05, 5.6]} />
            <meshStandardMaterial color={p.woodDark} roughness={0.6} />
          </mesh>
        ))}
        {[-2.2, -1.4, -0.6, 0.2, 1, 1.8, 2.6].map((z, i) => (
          <Bottle
            key={z}
            position={[0, 1.28 + (i % 3 === 0 ? 0.65 : i % 3 === 1 ? 1.3 : 0), z]}
            color={["#6b7f4f", "#8a5a3a", "#3c4a5c", "#7a6b4f"][i % 4]}
          />
        ))}
      </group>

      {/* --------------------- Hanging scroll (back) ------------------ */}
      <group position={[-4.5, 2.5, -halfD + 0.06]}>
        <mesh>
          <planeGeometry args={[0.9, 2.3]} />
          <meshStandardMaterial color={p.wallWarm} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.5, 1.9]} />
          <meshStandardMaterial color={p.woodDark} roughness={0.9} />
        </mesh>
      </group>

      {/* --------------------- Noren at the entrance ------------------ */}
      <group position={[0, height - 0.9, halfD - 0.15]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[3.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#1c1814" />
        </mesh>
        {[-1.05, 0, 1.05].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <planeGeometry args={[1, 0.95]} />
            <meshStandardMaterial
              color={p.lantern > 1 ? "#7a2a24" : "#a8352c"}
              roughness={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* ----------------------- Dining tables ------------------------ */}
      <DiningTable position={[-4.2, 0, 1.6]} index={1} mode={mode} wood={p.wood} onSelect={onSelect} />
      <DiningTable position={[0.2, 0, 3.4]} index={0} mode={mode} wood={p.wood} onSelect={onSelect} />
      <DiningTable position={[4.4, 0, 2.2]} index={2} mode={mode} wood={p.wood} onSelect={onSelect} />

      {/* rug beneath the dining area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.4, 0.008, 2.4]} receiveShadow>
        <planeGeometry args={[9, 5.2]} />
        <meshStandardMaterial color={p.woodDark} roughness={0.95} transparent opacity={0.5} />
      </mesh>

      {/* --------------------- Lanterns & pendants -------------------- */}
      <Lantern position={[-2.2, 3.1, 3.4]} intensity={p.lantern} />
      <Lantern position={[2.6, 3.1, 2]} intensity={p.lantern} />
      <Lantern position={[0.5, 2.6, -5]} intensity={p.lantern} withLight={p.lantern > 1} />

      {/* corner plants */}
      <Plant position={[-halfW + 1, 0, halfD - 1.2]} />
      <Plant position={[halfW - 1.2, 0, halfD - 1.2]} />

      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.42}
        scale={halfW * 2.4}
        blur={2.4}
        far={6}
        color="#000000"
      />
    </group>
  );
}
