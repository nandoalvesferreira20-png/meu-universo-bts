import { createCanvas, loadImage } from "@napi-rs/canvas";
import { writeFile } from "node:fs/promises";
// Exact source pixels are retained. Only near-white background pixels become transparent.
// Never redraw, recolor, rescale or synthesize the brand artwork. Originals remain alongside derivatives.
for (const [input, output] of [
  ["arirang-logo-original.jpg", "arirang-logo.png"],
  ["bts-logo-original.png", "bts-logo.png"],
]) {
  const root = new URL("../public/images/army-pass/logos/", import.meta.url);
  const image = await loadImage(
    new URL(input, root).pathname.replace(/^\/([A-Za-z]:)/, "$1"),
  );
  const canvas = createCanvas(image.width, image.height),
    ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(0, 0, image.width, image.height);
  let left = image.width,
    top = image.height,
    right = 0,
    bottom = 0;
  for (let y = 0; y < image.height; y++)
    for (let x = 0; x < image.width; x++) {
      const i = (y * image.width + x) * 4,
        r = data.data[i],
        g = data.data[i + 1],
        b = data.data[i + 2];
      if (
        Math.min(r, g, b) >= 245 &&
        Math.max(r, g, b) - Math.min(r, g, b) <= 10
      )
        data.data[i + 3] = 0;
      if (data.data[i + 3]) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
  ctx.putImageData(data, 0, 0);
  const margin = 3;
  left = Math.max(0, left - margin);
  top = Math.max(0, top - margin);
  right = Math.min(image.width - 1, right + margin);
  bottom = Math.min(image.height - 1, bottom + margin);
  const prepared = createCanvas(right - left + 1, bottom - top + 1);
  prepared
    .getContext("2d")
    .drawImage(
      canvas,
      left,
      top,
      prepared.width,
      prepared.height,
      0,
      0,
      prepared.width,
      prepared.height,
    );
  await writeFile(new URL(output, root), prepared.toBuffer("image/png"));
  console.log(output, prepared.width, prepared.height);
}
