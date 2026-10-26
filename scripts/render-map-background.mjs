import { createCanvas, loadImage } from "@napi-rs/canvas";
import { readFile, writeFile } from "node:fs/promises";
// Rasterize only our original atmospheric SVG; no reference image is read.
const root = new URL("../public/images/army-pass/textures/", import.meta.url);
const image = await loadImage(await readFile(new URL("map-atmosphere.svg", root)));
const canvas = createCanvas(941, 1672);
canvas.getContext("2d").drawImage(image, 0, 0);
await writeFile(new URL("map-atmosphere.png", root), canvas.toBuffer("image/png"));
