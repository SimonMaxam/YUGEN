/**
 * Generates placeholder .glb models + copies audio into ./Simon/
 * Run: node scripts/generate-simon-assets.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { Blob } from "node:buffer";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// GLTFExporter expects browser APIs when writing binary GLB in Node.
globalThis.Blob = Blob;
globalThis.FileReader = class FileReader {
  result = null;
  onloadend = null;
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((ab) => {
      this.result = ab;
      this.onloadend?.({ target: this });
    });
  }
};

const ROOT = path.join(process.cwd(), "Simon");
const MODELS = path.join(ROOT, "models");

const exporter = new GLTFExporter();

async function writeGlb(object, fileName) {
  const scene = new THREE.Scene();
  scene.add(object);
  const buffer = await exporter.parseAsync(scene, { binary: true });
  const out = path.join(MODELS, fileName);
  await fs.writeFile(out, Buffer.from(buffer));
  const stat = await fs.stat(out);
  console.log(`  ${fileName} (${Math.round(stat.size / 1024)} KB)`);
}

function mesh(geometry, color, name) {
  const m = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color, metalness: 0.15, roughness: 0.65 }),
  );
  m.name = name;
  return m;
}

function group(name, children) {
  const g = new THREE.Group();
  g.name = name;
  for (const c of children) g.add(c);
  return g;
}

const models = {
  dragon_roll: () =>
    group("dragon_roll", [
      mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.2, 16), "#2d5a3d", "rice"),
      mesh(new THREE.TorusGeometry(0.38, 0.06, 8, 24), "#e85d04", "tobiko"),
      mesh(new THREE.BoxGeometry(0.15, 0.08, 0.9), "#f4a261", "avocado"),
    ]),

  chef: () =>
    group("chef", [
      mesh(new THREE.CylinderGeometry(0.35, 0.4, 1.1, 12), "#1a1a1a", "coat"),
      mesh(new THREE.BoxGeometry(0.5, 0.55, 0.35), "#f5e6d3", "torso"),
      mesh(new THREE.SphereGeometry(0.22, 16, 16), "#e8c4a0", "head"),
      mesh(new THREE.BoxGeometry(0.55, 0.06, 0.06), "#ffffff", "counter_edge"),
    ]),

  nigiri: () =>
    group("nigiri", [
      mesh(new THREE.BoxGeometry(0.5, 0.22, 0.85), "#f5f0e8", "shari"),
      mesh(new THREE.BoxGeometry(0.48, 0.12, 0.82), "#c45c4a", "neta"),
    ]),

  salmon_nigiri: () =>
    group("salmon_nigiri", [
      mesh(new THREE.BoxGeometry(0.5, 0.22, 0.85), "#f5f0e8", "shari"),
      mesh(new THREE.BoxGeometry(0.48, 0.12, 0.82), "#ff8c69", "salmon"),
    ]),

  tuna_nigiri: () =>
    group("tuna_nigiri", [
      mesh(new THREE.BoxGeometry(0.5, 0.22, 0.85), "#f5f0e8", "shari"),
      mesh(new THREE.BoxGeometry(0.48, 0.12, 0.82), "#8b1e3f", "tuna"),
    ]),

  maki_roll: () =>
    group("maki_roll", [
      mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.95, 20), "#1a472a", "nori"),
      mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.9, 20), "#f5f0e8", "rice"),
      mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.85, 12), "#e85d04", "center"),
    ]),

  gunkan_uni: () =>
    group("gunkan_uni", [
      mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.35, 16), "#1a472a", "nori_wrap"),
      mesh(new THREE.SphereGeometry(0.28, 16, 12), "#f4c430", "uni"),
      mesh(new THREE.BoxGeometry(0.45, 0.2, 0.45), "#f5f0e8", "shari"),
    ]),

  chopsticks: () => {
    const a = mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8), "#8b6914", "stick_a");
    a.position.set(-0.04, 0.7, 0);
    const b = mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.35, 8), "#6b4f0a", "stick_b");
    b.position.set(0.04, 0.68, 0);
    return group("chopsticks", [a, b]);
  },

  serving_plate: () =>
    group("serving_plate", [
      mesh(new THREE.CylinderGeometry(0.55, 0.5, 0.06, 32), "#2a2a2a", "slate"),
      mesh(new THREE.TorusGeometry(0.52, 0.02, 8, 32), "#444444", "rim"),
    ]),

  sake_bottle: () =>
    group("sake_bottle", [
      mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.75, 16), "#1e3a5f", "body"),
      mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.2, 12), "#1e3a5f", "neck"),
      mesh(new THREE.SphereGeometry(0.1, 12, 12), "#c9a227", "cap"),
    ]),

  dining_table: () =>
    group("dining_table", [
      mesh(new THREE.BoxGeometry(2.2, 0.08, 1.1), "#5c3d2e", "top"),
      mesh(new THREE.BoxGeometry(0.12, 0.7, 0.12), "#3d2817", "leg_1"),
      mesh(new THREE.BoxGeometry(0.12, 0.7, 0.12), "#3d2817", "leg_2"),
    ]),

  room_props: () =>
    group("room_props", [
      mesh(new THREE.BoxGeometry(4, 0.1, 5), "#3d3530", "floor"),
      mesh(new THREE.BoxGeometry(4, 2.8, 0.12), "#2a2520", "wall"),
      mesh(new THREE.BoxGeometry(0.8, 2.2, 0.05), "#4a4038", "shoji"),
    ]),
};

async function main() {
  await fs.mkdir(MODELS, { recursive: true });
  console.log("Writing GLB models to Simon/models/");
  for (const [key, build] of Object.entries(models)) {
    const obj = build();
    obj.position.set(0, 0, 0);
    await writeGlb(obj, `${key}.glb`);
  }

  const aliases = {
    salmon: "salmon_nigiri",
    tuna: "tuna_nigiri",
    uni: "gunkan_uni",
    plate: "serving_plate",
    table: "dining_table",
    room: "room_props",
  };
  for (const [alias, src] of Object.entries(aliases)) {
    await fs.copyFile(
      path.join(MODELS, `${src}.glb`),
      path.join(MODELS, `${alias}.glb`),
    );
    console.log(`  ${alias}.glb (alias → ${src})`);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
