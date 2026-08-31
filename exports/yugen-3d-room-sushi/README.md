# YŪGEN — 3D restaurant room & sushi (extract)

This zip contains only the **walkable 3D dining room** and **procedural sushi** used on the homepage `#experience` section, plus the optional **hero WebGL sushi** scene.

## Contents

| Path | Purpose |
|------|---------|
| `src/components/three/restaurant/` | Room geometry, walk controls, hotspots, lighting |
| `src/components/three/RestaurantScene.tsx` | R3F canvas for the room |
| `src/components/three/SushiScene.tsx` | Hero scroll-driven sushi (optional) |
| `src/components/three/SushiModels.tsx` | Shared nigiri / maki / gunkan meshes |
| `src/components/three/SceneErrorBoundary.tsx` | Graceful WebGL failure UI |
| `src/sections/Experience.tsx` | Full UI wrapper (orbit/walk, table modals) |
| `src/sections/HomeExperience.tsx` | Lazy-loaded wrapper for Next.js |
| `src/lib/experiences.ts` | Table / omakase copy for hotspots |
| `src/lib/time-of-day.ts` | Theme palette helper for the room |
| `src/lib/device.ts` | Touch / auto-3D guards |
| `src/lib/utils.ts` | `cn`, `lerp`, etc. |
| `src/components/ui/` | Section heading helpers used by `Experience.tsx` |

No `.glb` / `.gltf` assets — everything is **procedural Three.js** geometry.

## npm dependencies

```json
{
  "@react-three/drei": "^10.7.7",
  "@react-three/fiber": "^9.6.1",
  "three": "^0.185.1",
  "framer-motion": "^12.42.2",
  "next": "^16.x",
  "react": "^19.x",
  "react-dom": "^19.x",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.6.0"
}
```

## Quick integration (Next.js App Router)

1. Copy `src/` into your project (merge paths).
2. On the homepage:

```tsx
import { HomeExperience } from "@/sections/HomeExperience";

export default function Page() {
  return (
    <>
      {/* … */}
      <HomeExperience />
    </>
  );
}
```

3. Ensure Tailwind + your design tokens (`text-ink`, `bg-surface`, `kicker`, etc.) exist, or replace classes in `Experience.tsx`.
4. Desktop: room loads automatically when `shouldAutoLoad3D()` is true. Mobile: tap **Enter the room** (by design for performance).

## Hero sushi only

Use dynamic import:

```tsx
const SushiScene = dynamic(() => import("@/components/three/SushiScene"), { ssr: false });
```

Pass a `progressRef` from scroll (see `src/sections/Hero.tsx` in the full repo).

## License

Same as the YŪGEN project (private site code — adjust if you republish).
