"use client";

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* Procedurally-modelled sushi — no external assets, so nothing to download and
   everything stays crisp at any zoom. Materials use physical shading for the
   soft, edible sheen. */

const RICE = "#f4efe6";

export function Nigiri({
  neta = "#d24b3a",
  glossy = 0.4,
  nori = false,
}: {
  neta?: string;
  glossy?: number;
  nori?: boolean;
}) {
  return (
    <group>
      {/* rice bed */}
      <RoundedBox args={[1.5, 0.72, 0.95]} radius={0.34} smoothness={6} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={RICE}
          roughness={0.85}
          sheen={0.6}
          sheenColor="#ffffff"
          clearcoat={0.1}
        />
      </RoundedBox>
      {/* neta drape */}
      <mesh position={[0, 0.46, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.62, 0.16, 1.02]} />
        <meshPhysicalMaterial
          color={neta}
          roughness={0.32}
          clearcoat={glossy}
          clearcoatRoughness={0.25}
          sheen={0.5}
        />
      </mesh>
      {nori && (
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.34, 0.9, 1.06]} />
          <meshStandardMaterial color="#1c2420" roughness={0.6} />
        </mesh>
      )}
    </group>
  );
}

export function MakiRoll({ fill = "#e07a4f" }: { fill?: string }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* nori exterior */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.85, 40]} />
        <meshStandardMaterial color="#171f1b" roughness={0.55} />
      </mesh>
      {/* rice ring */}
      <mesh>
        <cylinderGeometry args={[0.66, 0.66, 0.87, 40]} />
        <meshPhysicalMaterial color={RICE} roughness={0.85} sheen={0.5} />
      </mesh>
      {/* filling core */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.9, 32]} />
        <meshPhysicalMaterial color={fill} roughness={0.35} clearcoat={0.5} />
      </mesh>
    </group>
  );
}

export function ChopstickPair({ color = "#2a211b" }: { color?: string }) {
  return (
    <group rotation={[0, 0, -0.24]}>
      {[0.16, -0.16].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} castShadow>
          <cylinderGeometry args={[0.03, 0.055, 4.2, 12]} />
          <meshStandardMaterial
            color={color}
            roughness={0.4}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}
