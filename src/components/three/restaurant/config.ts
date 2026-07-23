import type { TimeOfDay } from "@/lib/time-of-day";

/** Interior half-extents (metres). The room spans [-halfW, halfW] × [-halfD, halfD]. */
export const ROOM = {
  halfW: 7.5,
  halfD: 6.5,
  height: 4.4,
  eye: 1.62, // camera eye height in walk mode
} as const;

/** Axis-aligned solid an avatar cannot walk through (centre + half-size on x/z). */
export interface Solid {
  x: number;
  z: number;
  hw: number; // half width (x)
  hd: number; // half depth (z)
}

/** Furniture the walk camera collides with, kept in sync with the meshes. */
export const SOLIDS: Solid[] = [
  { x: 0.5, z: -5.2, hw: 4.4, hd: 0.9 }, // hinoki counter
  { x: 6.4, z: -1, hw: 0.6, hd: 3.2 }, // sake shelf (right wall)
  { x: -4.2, z: 1.6, hw: 1.1, hd: 0.75 }, // window table
  { x: 0.2, z: 3.4, hw: 1.1, hd: 0.75 }, // centre table
  { x: 4.4, z: 2.2, hw: 1.1, hd: 0.75 }, // right table
];

/** Points of interest that open an omakase experience (index → experiences[]). */
export interface Hotspot {
  index: number;
  x: number;
  z: number;
  radius: number; // proximity trigger radius for walk mode
  label: string;
}

export const HOTSPOTS: Hotspot[] = [
  { index: 0, x: 0.5, z: -4.1, radius: 2.4, label: "The Counter" },
  { index: 1, x: -4.2, z: 1.6, radius: 2.0, label: "Garden Window table" },
  { index: 2, x: 5.4, z: -4.6, radius: 2.2, label: "Private Room" },
];

export interface Palette {
  wall: string;
  wallWarm: string;
  floor: string;
  wood: string;
  woodDark: string;
  ambient: number;
  sun: number;
  sunColor: string;
  envIntensity: number;
  lantern: number;
  showSky: boolean; // warm outdoor backdrop visible through the glass wall
  bg: string;
}

export function paletteFor(theme: TimeOfDay): Palette {
  switch (theme) {
    case "morning":
      return {
        wall: "#e7e1d5",
        wallWarm: "#efe9dd",
        floor: "#c39a71",
        wood: "#cda67d",
        woodDark: "#9a7550",
        ambient: 0.5,
        sun: 3.2,
        sunColor: "#fff4e2",
        envIntensity: 1.05,
        lantern: 0.35,
        showSky: true,
        bg: "#e8e0d2",
      };
    case "evening":
      return {
        wall: "#d8c6ac",
        wallWarm: "#e4d2b6",
        floor: "#aa7c53",
        wood: "#bd9064",
        woodDark: "#87603c",
        ambient: 0.34,
        sun: 2.6,
        sunColor: "#ffbe7a",
        envIntensity: 0.8,
        lantern: 0.9,
        showSky: true,
        bg: "#c9a877",
      };
    case "night":
    default:
      return {
        wall: "#2a2521",
        wallWarm: "#332c26",
        floor: "#392c22",
        wood: "#4f3826",
        woodDark: "#33241a",
        ambient: 0.16,
        sun: 0.25,
        sunColor: "#4a6aa0",
        envIntensity: 0.28,
        lantern: 2.4,
        showSky: false,
        bg: "#0d0c0e",
      };
  }
}
