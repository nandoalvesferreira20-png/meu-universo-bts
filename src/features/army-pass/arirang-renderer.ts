import { drawFittedText, type TextSlot } from "./canvas-layout";
import { drawContainedPhoto, cropRectangle } from "./image-processing";
import { authorizedLogoPath, containLogo } from "./era-logos";
import { arirangBtsLogo, eraThemes } from "./themes";
import type { PreparedImage } from "./renderer";
import type { Crop, EraLogo, PassFields, PassModel } from "./types";

const red = "#ED1235",
  ink = "#20201f",
  paper = "#f2f1ed";
const sans = "'Segoe UI', Arial, 'Segoe UI Emoji', 'Malgun Gothic', sans-serif";
const condensed = "'Bahnschrift Condensed', 'Arial Narrow', Arial, sans-serif";
export const arirangFrames = {
  group: { x: 47, y: 423, width: 809, height: 380 },
  personal: { x: 80, y: 852, width: 310, height: 310 },
};
// Brand placements are always in final export pixels, independently of the drawing grid.
export const arirangBtsPlacement = { x: 956, y: 74, width: 48, height: 100 };
export const arirangBadgePlacement = { x: 518, y: 1808, width: 42, height: 63 };
export const arirangQuote = "Sete caminhos. Uma história que continua.";
type Field =
  | "displayName"
  | "city"
  | "bias"
  | "armySince"
  | "favoriteSong"
  | "experience"
  | "message";
const rows: { key: Field; label: string; height: number }[] = [
  { key: "displayName", label: "NOME", height: 69 },
  { key: "city", label: "CIDADE / ESTADO", height: 63 },
  { key: "bias", label: "BIAS", height: 63 },
  { key: "armySince", label: "ARMY DESDE", height: 68 },
  { key: "favoriteSong", label: "MÚSICA FAVORITA", height: 75 },
  { key: "experience", label: "EXPERIÊNCIA", height: 68 },
  { key: "message", label: "MENSAGEM", height: 142 },
];
function values(f: PassFields): Record<Field, string> {
  return {
    ...f,
    city: [f.city.trim(), f.state].filter(Boolean).join(" · "),
    experience: f.experience === "Prefiro não informar" ? "" : f.experience,
  };
}
export function arirangLayout(fields: PassFields) {
  let cursor = 844;
  const v = values(fields),
    slots = {} as Record<Field, TextSlot>;
  const cards = rows.map((row) => {
    const y = cursor;
    slots[row.key] = { x: 544, y: y + 29, width: 303, height: row.height - 32 };
    if (v[row.key].trim()) cursor += row.height + 13;
    return { ...row, y, visible: Boolean(v[row.key].trim()) };
  });
  return { slots, cards, quote: { x: 108, y: 1190, width: 290, height: 64 } };
}
function line(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  x2: number,
  y2 = y,
  color = ink,
  width = 0.7,
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}
function tracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  spacing = 3,
  color = ink,
) {
  ctx.font = `500 ${size}px ${condensed}`;
  ctx.textBaseline = "top";
  ctx.fillStyle = color;
  for (const char of text) {
    ctx.fillText(char, x, y);
    x += ctx.measureText(char).width + spacing;
  }
}
function spark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r = 11,
  color = red,
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x + 2, y - 2, x + r, y);
  ctx.quadraticCurveTo(x + 2, y + 2, x, y + r);
  ctx.quadraticCurveTo(x - 2, y + 2, x - r, y);
  ctx.quadraticCurveTo(x - 2, y - 2, x, y - r);
  ctx.fill();
}
function chamfer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  c: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + c, y);
  ctx.lineTo(x + w - c, y);
  ctx.lineTo(x + w, y + c);
  ctx.lineTo(x + w, y + h - c);
  ctx.lineTo(x + w - c, y + h);
  ctx.lineTo(x + c, y + h);
  ctx.lineTo(x, y + h - c);
  ctx.lineTo(x, y + c);
  ctx.closePath();
}
function brand(
  ctx: CanvasRenderingContext2D,
  asset: PreparedImage | undefined,
  config: EraLogo,
  source?: { x: number; y: number; width: number; height: number },
) {
  if (!asset || !authorizedLogoPath(config)) return;
  const r = containLogo(
    source?.width ?? asset.width,
    source?.height ?? asset.height,
    config.placement,
  );
  ctx.save();
  ctx.scale(900 / 1080, 1600 / 1920);
  if (source)
    ctx.drawImage(
      asset.image,
      source.x,
      source.y,
      source.width,
      source.height,
      r.x,
      r.y,
      r.width,
      r.height,
    );
  else ctx.drawImage(asset.image, r.x, r.y, r.width, r.height);
  ctx.restore();
}
function cover(
  ctx: CanvasRenderingContext2D,
  asset: PreparedImage,
  crop: Crop,
  frame: TextSlot,
) {
  const r = cropRectangle(
    asset.width,
    asset.height,
    frame.width,
    frame.height,
    crop,
  );
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    asset.image,
    r.sx,
    r.sy,
    r.sw,
    r.sh,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
  );
}
function icon(ctx: CanvasRenderingContext2D, key: Field, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = paper;
  ctx.lineWidth = 1.9;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (key === "displayName") {
    ctx.arc(0, -6, 6, 0, Math.PI * 2);
    ctx.moveTo(-11, 13);
    ctx.quadraticCurveTo(-12, 1, -5, 1);
    ctx.moveTo(5, 1);
    ctx.quadraticCurveTo(12, 1, 11, 13);
    ctx.lineTo(-11, 13);
  }
  if (key === "city") {
    ctx.moveTo(0, 15);
    ctx.bezierCurveTo(-23, -7, -4, -24, 8, -12);
    ctx.bezierCurveTo(17, -4, 4, 11, 0, 15);
    ctx.moveTo(4, -5);
    ctx.arc(0, -5, 4, 0, Math.PI * 2);
  }
  if (key === "bias") {
    ctx.moveTo(0, 13);
    ctx.bezierCurveTo(-29, -6, -8, -23, 0, -10);
    ctx.bezierCurveTo(8, -23, 29, -6, 0, 13);
  }
  if (key === "armySince") {
    ctx.roundRect(-12, -10, 24, 24, 2);
    ctx.moveTo(-12, -3);
    ctx.lineTo(12, -3);
    ctx.moveTo(-6, -15);
    ctx.lineTo(-6, -5);
    ctx.moveTo(6, -15);
    ctx.lineTo(6, -5);
    for (let a = -6; a < 9; a += 6)
      for (let b = 3; b < 12; b += 6) {
        ctx.moveTo(a, b);
        ctx.lineTo(a + 1, b);
      }
  }
  if (key === "favoriteSong") {
    ctx.moveTo(-6, 10);
    ctx.lineTo(-6, -10);
    ctx.lineTo(10, -14);
    ctx.lineTo(10, 6);
    ctx.moveTo(-6, -4);
    ctx.lineTo(10, -8);
    ctx.moveTo(-6, 10);
    ctx.ellipse(-10, 10, 4, 3, -0.3, 0, Math.PI * 2);
    ctx.moveTo(10, 6);
    ctx.ellipse(6, 6, 4, 3, -0.3, 0, Math.PI * 2);
  }
  if (key === "experience") {
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2,
        r = i % 2 ? 6 : 14;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
  }
  if (key === "message") {
    ctx.moveTo(-11, -11);
    ctx.lineTo(11, -11);
    ctx.quadraticCurveTo(14, -11, 14, -8);
    ctx.lineTo(14, 7);
    ctx.quadraticCurveTo(14, 10, 11, 10);
    ctx.lineTo(-2, 10);
    ctx.lineTo(-9, 15);
    ctx.lineTo(-9, 10);
    ctx.lineTo(-11, 10);
    ctx.quadraticCurveTo(-14, 10, -14, 7);
    ctx.lineTo(-14, -8);
    ctx.quadraticCurveTo(-14, -11, -11, -11);
  }
  ctx.stroke();
  ctx.restore();
}
export function drawArirangPass(
  ctx: CanvasRenderingContext2D,
  model: PassModel,
  assets: PreparedImage,
) {
  ctx.save();
  ctx.scale(1080 / 900, 1920 / 1600);
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, 900, 1600);
  if (assets.texture) ctx.drawImage(assets.texture.image, 0, 0, 900, 1600);
  chamfer(ctx, 23, 20, 854, 1554, 26);
  ctx.strokeStyle = "#494946";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  for (const [x, y, sx, sy] of [
    [24, 21, 1, 1],
    [876, 21, -1, 1],
    [24, 1573, 1, -1],
    [876, 1573, -1, -1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(x, y + 27 * sy);
    ctx.lineTo(x + 25 * sx, y);
    ctx.lineTo(x + 132 * sx, y);
    ctx.strokeStyle = red;
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  line(ctx, 24, 294, 24, 417, red, 4);
  line(ctx, 876, 294, 876, 417, red, 4);
  line(ctx, 24, 1337, 24, 1479, red, 4);
  line(ctx, 876, 1401, 876, 1488, red, 4);
  tracked(ctx, "BTS", 58, 60, 18, 2);
  ["MUSIC", "PEOPLE", "CULTURE", "FOREVER"].forEach((t, i) =>
    tracked(ctx, t, 60, 106 + i * 20, 11, 4),
  );
  line(ctx, 62, 193, 88);
  line(ctx, 64, 214, 64, 276);
  line(ctx, 64, 320, 64, 374);
  spark(ctx, 64, 299);
  brand(ctx, assets.logo, eraThemes.arirang.logo, {
    x: 105,
    y: 73,
    width: 525,
    height: 295,
  });
  brand(ctx, assets.btsLogo, {
    ...arirangBtsLogo,
    placement: arirangBtsPlacement,
  });
  line(ctx, 816, 158, 816, 207);
  ["BEYOND", "THE", "SCENE"].forEach((t, i) =>
    tracked(ctx, t, 775 + (i === 1 ? 24 : 9), 222 + i * 22, 11, 4),
  );
  line(ctx, 835, 296, 835, 306);
  spark(ctx, 835, 326);
  line(ctx, 835, 348, 835, 373);
  line(ctx, 93, 377, 175);
  tracked(ctx, "A HIGHER VOICE", 201, 369, 14, 5);
  spark(ctx, 409, 377, 10);
  tracked(ctx, "A BRIGHTER TOMORROW", 445, 369, 14, 4);
  line(ctx, 725, 377, 807);
  for (const [x, y, w, h, c, color, width] of [
    [33, 407, 836, 412, 21, "#555550", 1],
    [39, 416, 823, 396, 27, red, 5],
    [46, 422, 810, 382, 22, "#fff", 3],
    [29, 414, 844, 400, 24, "#878781", 0.6],
  ] as const) {
    chamfer(ctx, x, y, w, h, c);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }
  ctx.save();
  chamfer(ctx, 47, 423, 809, 380, 20);
  ctx.clip();
  if (model.source !== "artwork") {
    if (model.imageFitMode === "contain")
      drawContainedPhoto(
        ctx,
        assets.image,
        assets.width,
        assets.height,
        arirangFrames.group,
        model.crop,
      );
    else cover(ctx, assets, model.crop, arirangFrames.group);
  } else {
    const g = ctx.createLinearGradient(47, 423, 856, 803);
    g.addColorStop(0, "#c4c5c2");
    g.addColorStop(0.5, "#deded9");
    g.addColorStop(1, "#aaaead");
    ctx.fillStyle = g;
    ctx.fillRect(47, 423, 809, 380);
  }
  ctx.restore();
  for (const [x, y] of [
    [80, 456],
    [817, 456],
    [80, 769],
    [817, 769],
  ]) {
    line(ctx, x - 16, y, x + 16, y, "#565954", 0.6);
    line(ctx, x, y - 17, x, y + 17, "#565954", 0.6);
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(235, 1007, 155, 0, Math.PI * 2);
  ctx.clip();
  if (assets.personal && model.personalPhoto)
    cover(
      ctx,
      assets.personal,
      model.personalPhoto.crop,
      arirangFrames.personal,
    );
  else {
    const g = ctx.createLinearGradient(80, 852, 390, 1162);
    g.addColorStop(0, "#d7d8d4");
    g.addColorStop(1, "#a6aaa7");
    ctx.fillStyle = g;
    ctx.fillRect(80, 852, 310, 310);
  }
  ctx.restore();
  for (const [r, color, width] of [
    [168, red, 2.4],
    [159, "#999b96", 0.7],
    [155, "#fff", 2.8],
  ] as const) {
    ctx.beginPath();
    ctx.arc(235, 1007, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }
  spark(ctx, 436, 853);
  spark(ctx, 394, 893, 11, "#bfc0bb");
  spark(ctx, 55, 1065, 6);
  spark(ctx, 112, 1156, 9, "#bfc0bb");
  line(ctx, 55, 953, 55, 1044);
  line(ctx, 436, 873, 436, 1396, "#55554f", 0.7);
  ctx.save();
  ctx.translate(60, 1091);
  ctx.rotate(Math.PI / 2);
  tracked(ctx, "BTS    ARIRANG", 0, 0, 11, 4);
  ctx.restore();
  const layout = arirangLayout(model.fields),
    v = values(model.fields);
  for (const card of layout.cards) {
    if (!card.visible) continue;
    const { y, height, key, label } = card;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(466, y, 393, height, 10);
    ctx.clip();
    ctx.fillStyle = "rgba(255,255,255,.32)";
    ctx.fillRect(466, y, 393, height);
    ctx.fillStyle = "rgba(74,73,68,.09)";
    ctx.fillRect(466, y, 393, 27);
    ctx.restore();
    ctx.beginPath();
    ctx.roundRect(466, y, 393, height, 10);
    ctx.strokeStyle = "rgba(80,80,73,.24)";
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(471, y + 2, 59, Math.min(64, height - 4), [6, 0, 0, 6]);
    ctx.fillStyle = red;
    ctx.fill();
    ctx.restore();
    icon(ctx, key, 501, y + 33);
    tracked(ctx, label, 544, y + 8, 12, 2.7);
    drawFittedText(ctx, v[key], layout.slots[key], {
      size: key === "displayName" ? 24 : 20,
      minSize: 9,
      family: sans,
      color: ink,
      leading: 1.22,
    });
  }
  drawFittedText(ctx, arirangQuote, layout.quote, {
    size: 18,
    minSize: 14,
    family: sans,
    color: ink,
    leading: 1.4,
  });
  line(ctx, 225, 1252, 252, 1252, ink, 1.5);
  line(ctx, 24, 1493, 876, 1493);
  tracked(ctx, "ARMY PASS BRASIL", 67, 1530, 12, 3);
  line(ctx, 260, 1536, 318);
  line(ctx, 359, 1516, 359, 1553, "#777970", 0.6);
  line(ctx, 541, 1516, 541, 1553, "#777970", 0.6);
  tracked(ctx, "BTS", 628, 1530, 14, 4);
  spark(ctx, 703, 1536, 8);
  tracked(ctx, "ARIRANG", 738, 1530, 14, 4);
  tracked(ctx, "@MEUUNIVERSOBTS", 642, 1560, 8, 1.5);
  if (model.imageCredit)
    drawFittedText(
      ctx,
      `Foto: ${model.imageCredit}`,
      { x: 51, y: 807, width: 793, height: 10 },
      { size: 8, minSize: 6, family: sans, color: ink },
    );
  ctx.restore();
}
