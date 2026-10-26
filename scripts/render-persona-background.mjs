import { createCanvas, loadImage } from "@napi-rs/canvas";
import { readFile, writeFile } from "node:fs/promises";
// Only our original atmosphere SVG is rasterized. The reference is not read.
const root = new URL("../public/images/army-pass/textures/", import.meta.url);
const image = await loadImage(await readFile(new URL("persona-atmosphere.svg", root)));
const canvas = createCanvas(941, 1672);
canvas.getContext("2d").drawImage(image, 0, 0);
await writeFile(new URL("persona-atmosphere.png", root), canvas.toBuffer("image/png"));
