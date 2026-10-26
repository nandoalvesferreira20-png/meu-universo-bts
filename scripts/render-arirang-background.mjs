import { createCanvas, loadImage } from "@napi-rs/canvas";
import { readFile, writeFile } from "node:fs/promises";
// Original paper/ink SVG, never the provided passport image.
const root = new URL("../public/images/army-pass/textures/", import.meta.url);
const image = await loadImage(await readFile(new URL("arirang-paper.svg", root)));
const canvas = createCanvas(941, 1672), ctx = canvas.getContext("2d");
ctx.drawImage(image, 0, 0);
// Deterministic dry-brush flecks on the red strokes and paper grain.
let seed=25177;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<36000;i++) {
  const x=random()*941,y=random()*1672;
  const pixel=ctx.getImageData(Math.floor(x),Math.floor(y),1,1).data;
  if(pixel[0]>90 && pixel[0]>pixel[1]*1.8) {
    ctx.fillStyle=`rgba(16,17,18,${.1+random()*.65})`;
    const length=.5+random()*5;ctx.fillRect(x,y,length,.5+random()*2);
  }
}
await writeFile(new URL("arirang-paper.png", root), canvas.toBuffer("image/png"));
