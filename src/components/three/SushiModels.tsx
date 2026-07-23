"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* Hand-modelled sushi — no downloads. More surface detail than the original
   capsules/boxes so the hero feels edible up close. */

const RICE = "#f3ece0";
const NORI = "#141c18";

/** Soft rice bed with subtle grain bumps along the top. */
function RiceBed({
  args = [1.45, 0.62, 0.88] as [number, number, number],
  lite = false,
}: {
  args?: [number, number, number];
  lite?: boolean;
}) {
  const grains = useMemo(
    () =>
      lite
        ? []
        : Array.from({ length: 22 }).map((_, i) => ({
            x: ((i % 6) - 2.5) * 0.2 + (i % 2) * 0.04,
            z: (Math.floor(i / 6) - 1.5) * 0.2,
            r: (i * 0.9) % 1.4,
          })),
    [lite],
  );

  return (
    <group>
      <RoundedBox
        args={args}
        radius={0.28}
        smoothness={lite ? 3 : 5}
        castShadow={!lite}
        receiveShadow={!lite}
      >
        <meshPhysicalMaterial
          color={RICE}
          roughness={0.9}
          sheen={lite ? 0.2 : 0.55}
          sheenColor="#ffffff"
          clearcoat={0.08}
        />
      </RoundedBox>
      {grains.map((g, i) => (
        <mesh
          key={i}
          position={[g.x, args[1] / 2 + 0.015, g.z]}
          rotation={[1.2, g.r, 0.3]}
        >
          <capsuleGeometry args={[0.022, 0.05, 2, 5]} />
          <meshStandardMaterial color="#ebe3d4" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Curved fish neta that drapes over the rice. */
function FishNeta({
  color,
  glossy = 0.55,
  striped = false,
}: {
  color: string;
  glossy?: number;
  striped?: boolean;
}) {
  return (
    <group position={[0, 0.4, 0]}>
      <RoundedBox args={[1.58, 0.18, 0.98]} radius={0.08} smoothness={4} castShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.28}
          clearcoat={glossy}
          clearcoatRoughness={0.18}
          sheen={0.5}
          sheenColor="#fff0e0"
        />
      </RoundedBox>
      {/* soft fat-line sheen */}
      <mesh position={[0, 0.095, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.15, 0.14]} />
        <meshBasicMaterial color="#fff6ea" transparent opacity={0.2} />
      </mesh>
      {striped &&
        [-0.35, -0.12, 0.12, 0.35].map((x) => (
          <mesh key={x} position={[x, 0.092, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 0.7]} />
            <meshBasicMaterial color="#f4c4a8" transparent opacity={0.35} />
          </mesh>
        ))}
    </group>
  );
}

export function Nigiri({
  neta = "#d24b3a",
  glossy = 0.55,
  nori = false,
  variant = "maguro",
  lite = false,
}: {
  neta?: string;
  glossy?: number;
  nori?: boolean;
  variant?: "maguro" | "salmon" | "hamachi" | "ebi";
  lite?: boolean;
}) {
  const color =
    variant === "salmon"
      ? "#e8845a"
      : variant === "hamachi"
        ? "#e6b26a"
        : variant === "ebi"
          ? "#e8a090"
          : neta;

  return (
    <group>
      <RiceBed lite={lite} />
      <FishNeta
        color={color}
        glossy={lite ? glossy * 0.6 : glossy}
        striped={!lite && variant === "salmon"}
      />
      {nori && (
        <mesh position={[0, 0.18, 0]} castShadow={!lite}>
          <boxGeometry args={[0.32, 0.85, 0.98]} />
          <meshStandardMaterial color={NORI} roughness={0.55} />
        </mesh>
      )}
      {!lite && (
        <mesh position={[0, 0.34, 0]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#6f9a3e" roughness={0.7} />
        </mesh>
      )}
    </group>
  );
}

export function MakiRoll({
  fill = "#e07a4f",
  sesame = true,
}: {
  fill?: string;
  sesame?: boolean;
}) {
  const seeds = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => {
        const a = (i / 28) * Math.PI * 2;
        return {
          x: Math.cos(a) * 0.74,
          y: ((i % 5) - 2) * 0.12,
          z: Math.sin(a) * 0.74,
        };
      }),
    [],
  );

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* nori exterior */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.9, 48]} />
        <meshStandardMaterial color={NORI} roughness={0.5} />
      </mesh>
      {/* rice ring */}
      <mesh>
        <cylinderGeometry args={[0.64, 0.64, 0.92, 48]} />
        <meshPhysicalMaterial color={RICE} roughness={0.88} sheen={0.45} />
      </mesh>
      {/* avocado crescent */}
      <mesh position={[0.18, 0, 0.05]}>
        <cylinderGeometry args={[0.18, 0.18, 0.93, 20]} />
        <meshStandardMaterial color="#7ea84a" roughness={0.55} />
      </mesh>
      {/* cucumber strip */}
      <mesh position={[-0.16, 0, -0.08]}>
        <boxGeometry args={[0.14, 0.93, 0.14]} />
        <meshStandardMaterial color="#4f7a3a" roughness={0.6} />
      </mesh>
      {/* tuna / salmon core */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.94, 24]} />
        <meshPhysicalMaterial color={fill} roughness={0.32} clearcoat={0.45} />
      </mesh>
      {sesame &&
        seeds.map((s, i) => (
          <mesh key={i} position={[s.x, s.y, s.z]}>
            <sphereGeometry args={[0.025, 5, 5]} />
            <meshStandardMaterial color="#e8dcc4" roughness={0.7} />
          </mesh>
        ))}
    </group>
  );
}

/** Gunkan (battleship) — rice wrapped in nori, topped with ikura/roe. */
export function Gunkan({ roe = "#d24b3a", lite = false }: { roe?: string; lite?: boolean }) {
  const eggs = useMemo(
    () =>
      Array.from({ length: lite ? 7 : 14 }).map((_, i) => ({
        x: ((i % 4) - 1.5) * 0.16,
        z: (Math.floor(i / 4) - 1) * 0.16,
        y: 0.55 + (i % 3) * 0.04,
      })),
    [lite],
  );

  return (
    <group>
      <RoundedBox args={[1.05, 0.7, 0.78]} radius={0.22} smoothness={4} castShadow>
        <meshPhysicalMaterial color={RICE} roughness={0.88} sheen={0.5} />
      </RoundedBox>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.55, 0.55, 28]} />
        <meshStandardMaterial color={NORI} roughness={0.55} />
      </mesh>
      {eggs.map((e, i) => (
        <mesh key={i} position={[e.x, e.y, e.z]} castShadow>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshPhysicalMaterial
            color={roe}
            roughness={0.2}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ChopstickPair({ color = "#2a211b" }: { color?: string }) {
  return (
    <group rotation={[0, 0, -0.24]}>
      {[0.16, -0.16].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} castShadow>
          <cylinderGeometry args={[0.028, 0.05, 4.0, 10]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

/** Ceramic soy dish + wasabi + pickled ginger. */
export function CondimentSet() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.5, 0.18, 28]} />
        <meshStandardMaterial color="#1a1612" roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 24]} />
        <meshStandardMaterial color="#2a1a12" roughness={0.5} />
      </mesh>
      <mesh position={[0.95, 0.08, 0.1]} castShadow>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color="#6f9a3e" roughness={0.65} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[1.35 + i * 0.08, 0.06, -0.15 + i * 0.05]}
          rotation={[0.4, i * 0.5, 0.2]}
          castShadow
        >
          <boxGeometry args={[0.22, 0.02, 0.28]} />
          <meshStandardMaterial color="#f0b8b0" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/** Thin wooden serving board under a piece. */
export function ServingBoard() {
  return (
    <RoundedBox args={[2.4, 0.12, 1.4]} radius={0.04} castShadow receiveShadow>
      <meshStandardMaterial color="#8a6340" roughness={0.55} />
    </RoundedBox>
  );
}
