import sharp from "sharp";
import fs from "node:fs/promises";
const names = [
  "wings-smoke",
  "map-atmosphere",
  "persona-atmosphere",
  "arirang-light-paper",
];
(async () => {
  await fs.mkdir("public/images/army-pass/cards", { recursive: true });
  for (const name of names) {
    const original = `public/images/army-pass/textures/${name}.png`;
    const card = `public/images/army-pass/cards/${name}.webp`;
    await sharp(original)
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(card);
    const before = (await fs.stat(original)).size;
    const after = (await fs.stat(card)).size;
    console.log(
      `${name}: ${before} -> ${after} bytes (${(100 * (1 - after / before)).toFixed(2)}% smaller)`,
    );
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
