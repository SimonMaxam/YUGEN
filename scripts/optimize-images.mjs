/**
 * Run with: npm run optimize-images
 * Compresses JPGs and writes matching WebP for smaller mobile payloads.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");
const MAX_WIDTH = 1400;
const JPG_QUALITY = 78;
const WEBP_QUALITY = 76;

async function run() {
  const entries = await fs.readdir(ROOT);
  const files = entries.filter(
    (f) => /\.(jpe?g|png)$/i.test(f) && !/-fallback\.jpe?g$/i.test(f),
  );

  for (const file of files) {
    const input = path.join(ROOT, file);
    const base = file.replace(/\.(jpe?g|png)$/i, "");
    const webpOut = path.join(ROOT, `${base}.webp`);

    const img = sharp(input);
    const meta = await img.metadata();
    const resized = img.resize({
      width: meta.width && meta.width > MAX_WIDTH ? MAX_WIDTH : undefined,
      withoutEnlargement: true,
    });

    let outBuffer;
    if (/\.png$/i.test(file)) {
      await sharp(input).webp({ quality: WEBP_QUALITY }).toFile(webpOut);
      const jpgOut = path.join(ROOT, `${base}-fallback.jpg`);
      outBuffer = await resized
        .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
        .toBuffer();
      await fs.writeFile(jpgOut, outBuffer);
      console.log(
        `${file}: kept PNG, fallback ${Math.round(outBuffer.length / 1024)}KB, webp ${Math.round((await fs.stat(webpOut)).size / 1024)}KB`,
      );
      continue;
    } else {
      outBuffer = await resized
        .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
        .toBuffer();
    }
    const tmp = `${input}.opt`;
    await fs.writeFile(tmp, outBuffer);
    await fs.rename(tmp, input);
    await sharp(outBuffer).webp({ quality: WEBP_QUALITY }).toFile(webpOut);

    const jpgStat = await fs.stat(input);
    const webpStat = await fs.stat(webpOut);
    console.log(
      `${file}: ${Math.round(jpgStat.size / 1024)}KB, webp ${Math.round(webpStat.size / 1024)}KB`,
    );
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
