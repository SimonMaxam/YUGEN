/**
 * Generates ambient MP3 files into ./Simon/audio/
 * Run: node scripts/generate-simon-audio.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const AUDIO_DIR = path.join(process.cwd(), "Simon", "audio");
const DURATION = 48;
const FFMPEG = ffmpegInstaller.path;

function ffmpeg(args) {
  const r = spawnSync(FFMPEG, args, { encoding: "utf8" });
  if (r.status !== 0) {
    throw new Error(r.stderr || "ffmpeg failed");
  }
}

async function writeAmbient(outName) {
  const out = path.join(AUDIO_DIR, outName);
  ffmpeg([
    "-y",
    "-f",
    "lavfi",
    "-i",
    `anoisesrc=color=pink:amplitude=0.018:duration=${DURATION}`,
    "-f",
    "lavfi",
    "-i",
    `sine=frequency=196:duration=${DURATION}`,
    "-filter_complex",
    "[0][1]amix=inputs=2:duration=first:dropout_transition=2,volume=0.35",
    "-codec:a",
    "libmp3lame",
    "-q:a",
    "5",
    out,
  ]);
  const stat = await fs.stat(out);
  console.log(`  ${outName} (${Math.round(stat.size / 1024)} KB)`);
}

async function main() {
  await fs.mkdir(AUDIO_DIR, { recursive: true });
  console.log("Writing audio to Simon/audio/ (ffmpeg:", FFMPEG, ")");
  await writeAmbient("restaurant_ambient.mp3");
  await writeAmbient("ambient.mp3");
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
