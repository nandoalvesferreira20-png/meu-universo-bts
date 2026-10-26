import { createCanvas } from "@napi-rs/canvas";
import { writeFile } from "node:fs/promises";
const canvas = createCanvas(900, 1600),
  ctx = canvas.getContext("2d");
let seed = 25025;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
ctx.fillStyle = "#f2f1ed";
ctx.fillRect(0, 0, 900, 1600);
const grain = ctx.getImageData(0, 0, 900, 1600);
for (let i = 0; i < grain.data.length; i += 4) {
  const n = (random() - 0.5) * 14;
  grain.data[i] += n;
  grain.data[i + 1] += n;
  grain.data[i + 2] += n;
}
ctx.putImageData(grain, 0, 0);
ctx.fillStyle = "#ed1235";
ctx.beginPath();
ctx.arc(305, 1377, 97, 0, Math.PI * 2);
ctx.fill();
// Original deterministic ink landscape, in many washed layers. No album symbols or source image.
for (let layer = 0; layer < 8; layer++) {
  const points = [];
  let noise = 0;
  for (let x = -20; x <= 535; x += 2) {
    noise = noise * 0.65 + (random() - 0.5) * 12;
    const fall = Math.pow(Math.max(0, 1 - x / 535), 1.3);
    const ridge = Math.min(
      1490,
      1490 -
        (250 - layer * 25) * fall +
        Math.sin(x * 0.021 + layer * 2) * 14 * fall +
        Math.sin(x * 0.083 + layer) * 9 * fall +
        noise * fall,
    );
    points.push([x, ridge]);
  }
  ctx.beginPath();
  ctx.moveTo(-20, 1490);
  for (const [x, y] of points) ctx.lineTo(x, y);
  ctx.lineTo(540, 1490);
  ctx.closePath();
  ctx.fillStyle = `rgba(28,31,29,${0.1 + layer * 0.035})`;
  ctx.fill();
  for (let i = 0; i < 2200; i++) {
    const n = Math.floor(random() * points.length),
      [x, y] = points[n];
    ctx.fillStyle = `rgba(248,246,239,${random() * 0.23})`;
    ctx.fillRect(
      x,
      y + random() * (1490 - y),
      0.4 + random() * 4,
      0.3 + random() * 2,
    );
  }
}
ctx.strokeStyle = "rgba(247,246,240,.8)";
ctx.lineWidth = 3;
ctx.lineCap = "round";
for (const [x, y, w] of [
  [0, 1349, 53],
  [177, 1356, 100],
  [0, 1371, 89],
  [0, 1398, 132],
  [125, 1444, 170],
]) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();
}
await writeFile(
  new URL(
    "../public/images/army-pass/textures/arirang-light-paper.png",
    import.meta.url,
  ),
  canvas.toBuffer("image/png"),
);
