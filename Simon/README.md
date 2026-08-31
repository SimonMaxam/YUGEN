# Simon — 3D & audio placeholders for YŪGEN

Place these files so the app can load them from the **site root** (Next.js `public/`):

```text
public/
  models/
    dragon_roll.glb
    chef.glb
    nigiri.glb
    … (all files in Simon/models/)
  audio/
    restaurant_ambient.mp3
    ambient.mp3          ← used by AudioProvider in the main repo
```

## Quick install (from project root)

**PowerShell:**

```powershell
New-Item -ItemType Directory -Force -Path public\models, public\audio | Out-Null
Copy-Item -Force Simon\models\*.glb public\models\
Copy-Item -Force Simon\audio\*.mp3 public\audio\
```

**macOS / Linux:**

```bash
mkdir -p public/models public/audio
cp Simon/models/*.glb public/models/
cp Simon/audio/*.mp3 public/audio/
```

Then URLs resolve as `/models/dragon_roll.glb`, `/audio/restaurant_ambient.mp3`, etc.

## Regenerate models

```bash
node scripts/generate-simon-assets.mjs
node scripts/generate-simon-audio.mjs
```

## Note

These GLBs are **simple procedural placeholders** (boxes, cylinders) exported from Three.js — valid binaries for `useGLTF` / GLTFLoader, not final art. Swap in real scans when ready.
