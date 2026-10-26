/** Original deterministic charcoal/grain and translucent smoke, independent of
 * the reference bitmap. Coordinates follow its 941 × 1672 editorial grid. */
export function drawWingsTexture(
  ctx: CanvasRenderingContext2D,
  texture?: CanvasImageSource,
) {
  ctx.fillStyle = "#101110";
  ctx.fillRect(0, 0, 941, 1672);
  if (texture) ctx.drawImage(texture, 0, 0, 941, 1672);
  const glow = ctx.createRadialGradient(740, 270, 5, 740, 270, 310);
  glow.addColorStop(0, "#b8b8b82a");
  glow.addColorStop(0.48, "#77777712");
  glow.addColorStop(1, "#10101000");
  ctx.fillStyle = glow;
  ctx.fillRect(350, 0, 591, 610);

  // Broad gauzy ribbons; their drifting edges are formed by many translucent
  // Bezier filaments, rather than a logo or a baked-in passport image.
  const ribbons = [
    [780, -100, 740, 240, 440, 35, 545, 460, 580, 665, 1050, 430, 835, 850],
    [1030, 260, 630, 525, 1050, 640, 750, 825, 585, 930, 210, 842, 55, 685],
    [-80, 560, 145, 720, -45, 835, 250, 907, 510, 990, 455, 1170, 165, 1200],
    [
      -150, 1390, 170, 1500, 85, 1745, 400, 1570, 670, 1420, 500, 1380, 1030,
      1260,
    ],
    [
      1110, 1370, 710, 1650, 600, 1280, 575, 1580, 540, 1700, 660, 1690, 610,
      1830,
    ],
  ];
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = texture ? 0.2 : 1;
  for (const [index, points] of ribbons.entries()) {
    for (let layer = 0; layer < 72; layer++) {
      const t = (layer - 36) / 36;
      const drift = Math.sin(layer * 0.17 + index) * 18;
      ctx.beginPath();
      ctx.moveTo(points[0] + t * 34, points[1]);
      ctx.bezierCurveTo(
        points[2] + t * 110,
        points[3] + drift,
        points[4] - t * 65,
        points[5] + t * 30,
        points[6] + t * 50,
        points[7] + t * 24,
      );
      ctx.bezierCurveTo(
        points[8] + t * 120,
        points[9] - t * 35,
        points[10] - t * 80,
        points[11] + drift,
        points[12] + t * 30,
        points[13] + t * 36,
      );
      const alpha = 0.013 + Math.pow(1 - Math.abs(t), 3) * 0.018;
      ctx.strokeStyle = `rgba(211,211,204,${alpha})`;
      ctx.lineWidth = 1.4 + (1 - Math.abs(t)) * 2.8;
      ctx.stroke();
    }
  }
  ctx.restore();
  if (texture) return;
  let seed = 72143;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < 19000; i++) {
    const x = random() * 941,
      y = random() * 1672;
    ctx.fillStyle = `rgba(228,228,220,${random() * 0.11})`;
    const size = random() < 0.015 ? 1.3 : 0.55;
    ctx.fillRect(x, y, size, size);
  }
}
