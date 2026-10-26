import { drawContainedPhoto, cropRectangle } from "./image-processing";
import { authorizedLogoPath, containLogo } from "./era-logos";
import { eraThemes, btsLogo } from "./themes";
import { drawWingsTexture } from "./wings-texture";
import type { PreparedImage } from "./renderer";
import type { Crop, EraLogo, ImageFitMode, PassModel } from "./types";

const white = "#efefe9";
const silver = "#c6c6c2";
const sans = "Arial, 'Segoe UI Emoji', 'Malgun Gothic', sans-serif";
const serif = "Georgia, 'Times New Roman', serif";
// These slots are deliberately fixed. Optional fields never move photo frames.
export const wingsSlots = {
  displayName: { x: 447, y: 985, width: 435, height: 34 },
  city: { x: 447, y: 1068, width: 169, height: 42 },
  bias: { x: 709, y: 1073, width: 173, height: 34 },
  armySince: { x: 447, y: 1165, width: 169, height: 34 },
  favoriteSong: { x: 709, y: 1159, width: 173, height: 47 },
  experience: { x: 447, y: 1267, width: 435, height: 40 },
  message: { x: 447, y: 1371, width: 435, height: 110 },
} as const;
export const wingsFrames = {
  group: { x: 60, y: 519, width: 821, height: 383 },
  personal: { x: 77, y: 977, width: 268, height: 268 },
};

function rule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  x2: number,
  y2 = y,
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = silver;
  ctx.lineWidth = 1;
  ctx.stroke();
}
function tracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  spacing: number,
) {
  ctx.font = `${size}px ${sans}`;
  ctx.fillStyle = white;
  ctx.textBaseline = "top";
  for (const char of text) {
    ctx.fillText(char, x, y);
    x += ctx.measureText(char).width + spacing;
  }
}
function star(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = white;
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8;
    const r = i % 2 ? radius * 0.12 : i % 4 ? radius * 0.45 : radius;
    ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function wrap(ctx: CanvasRenderingContext2D, value: string, width: number) {
  const lines: string[] = [];
  let line = "";
  const graphemes = new Intl.Segmenter("pt-BR", { granularity: "grapheme" });
  for (const word of value.replace(/\s+/gu, " ").trim().split(" ")) {
    if (line && ctx.measureText(`${line} ${word}`).width <= width) {
      line += ` ${word}`;
      continue;
    }
    if (line) {
      lines.push(line);
      line = "";
    }
    for (const { segment } of graphemes.segment(word)) {
      if (line && ctx.measureText(line + segment).width > width) {
        lines.push(line);
        line = "";
      }
      line += segment;
    }
  }
  if (line) lines.push(line);
  return lines;
}
export function drawWingsValue(
  ctx: CanvasRenderingContext2D,
  value: string,
  slot: { x: number; y: number; width: number; height: number },
  size = 23,
) {
  if (!value.trim()) return;
  let lines: string[] = [];
  for (; size >= 8; size--) {
    ctx.font = `${size}px ${sans}`;
    lines = wrap(ctx, value, slot.width);
    if (lines.length * size * 1.22 <= slot.height) break;
  }
  if (size < 8)
    throw new Error("O texto não cabe na área do WINGS. Revise o campo.");
  ctx.textBaseline = "top";
  ctx.fillStyle = white;
  lines.forEach((line, i) =>
    ctx.fillText(line, slot.x, slot.y + i * size * 1.22),
  );
}
function photo(
  ctx: CanvasRenderingContext2D,
  asset: PreparedImage,
  crop: Crop,
  frame: typeof wingsFrames.group | typeof wingsFrames.personal,
  fitMode: ImageFitMode = "cover",
) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (fitMode === "contain" && frame === wingsFrames.group) {
    drawContainedPhoto(
      ctx,
      asset.image,
      asset.width,
      asset.height,
      frame,
      crop,
    );
    return;
  }
  const { sx, sy, sw, sh } = cropRectangle(
    asset.width,
    asset.height,
    frame.width,
    frame.height,
    crop,
  );
  ctx.drawImage(
    asset.image,
    sx,
    sy,
    sw,
    sh,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
  );
}
function logo(
  ctx: CanvasRenderingContext2D,
  asset: PreparedImage | undefined,
  config: EraLogo,
) {
  if (!asset || !authorizedLogoPath(config)) return;
  const box = containLogo(asset.width, asset.height, config.placement);
  // Configurations use output pixels, unlike this reference-coordinate layer.
  ctx.save();
  ctx.scale(941 / 1080, 1672 / 1920);
  ctx.drawImage(asset.image, box.x, box.y, box.width, box.height);
  ctx.restore();
}
// Small original outline icons, independent of BTS/WINGS brand symbols.
function icon(
  ctx: CanvasRenderingContext2D,
  kind: string,
  x: number,
  y: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = white;
  ctx.lineWidth = 1.9;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  if (kind === "person") {
    ctx.ellipse(13, 7, 6, 7, 0, 0, Math.PI * 2);
    ctx.moveTo(6, 16);
    ctx.bezierCurveTo(-3, 19, 0, 28, 1, 28);
    ctx.lineTo(25, 28);
    ctx.bezierCurveTo(27, 21, 24, 18, 20, 16);
  } else if (kind === "pin") {
    ctx.moveTo(13, 29);
    ctx.bezierCurveTo(-13, 4, 12, -10, 24, 4);
    ctx.bezierCurveTo(29, 12, 17, 26, 13, 29);
    ctx.moveTo(18, 9);
    ctx.arc(13, 9, 5, 0, Math.PI * 2);
  } else if (kind === "heart") {
    ctx.moveTo(14, 28);
    ctx.bezierCurveTo(-16, 7, 4, -9, 14, 3);
    ctx.bezierCurveTo(25, -9, 45, 7, 14, 28);
  } else if (kind === "calendar") {
    ctx.roundRect(0, 3, 27, 27, 2);
    ctx.moveTo(0, 11);
    ctx.lineTo(27, 11);
    ctx.moveTo(6, 0);
    ctx.lineTo(6, 7);
    ctx.moveTo(21, 0);
    ctx.lineTo(21, 7);
    for (const px of [6, 13, 20])
      for (const py of [17, 23]) {
        ctx.moveTo(px, py);
        ctx.lineTo(px + 1, py);
      }
  } else if (kind === "music") {
    ctx.moveTo(8, 22);
    ctx.lineTo(8, 4);
    ctx.lineTo(24, 0);
    ctx.lineTo(24, 22);
    ctx.moveTo(8, 9);
    ctx.lineTo(24, 5);
    ctx.moveTo(8, 25);
    ctx.ellipse(3, 25, 5, 4, -0.3, 0, Math.PI * 2);
    ctx.moveTo(24, 23);
    ctx.ellipse(19, 23, 5, 4, -0.3, 0, Math.PI * 2);
  } else if (kind === "star") {
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5,
        r = i % 2 ? 7 : 15;
      ctx.lineTo(14 + Math.cos(a) * r, 15 + Math.sin(a) * r);
    }
    ctx.closePath();
  } else {
    ctx.moveTo(4, 23);
    ctx.bezierCurveTo(-12, -4, 33, -12, 27, 13);
    ctx.bezierCurveTo(25, 23, 15, 27, 8, 24);
    ctx.lineTo(0, 28);
    ctx.closePath();
  }
  ctx.stroke();
  ctx.restore();
}

export function drawWingsPass(
  ctx: CanvasRenderingContext2D,
  model: PassModel,
  assets: PreparedImage,
) {
  ctx.save();
  ctx.clearRect(0, 0, 1080, 1920);
  ctx.scale(1080 / 941, 1920 / 1672);
  drawWingsTexture(ctx, assets.texture?.image);
  ctx.strokeStyle = silver;
  ctx.lineWidth = 1;
  ctx.strokeRect(28, 27, 885, 1617);
  star(ctx, 78, 99, 19);
  tracked(ctx, "ARMY PASS BRASIL", 113, 92, 16, 6);
  rule(ctx, 398, 99, 605);
  ctx.textBaseline = "top";
  ctx.font = `86px ${serif}`;
  ctx.fillStyle = white;
  ctx.fillText("A little piece", 75, 173, 445);
  ctx.fillStyle = silver;
  ctx.fillText("of our universe.", 75, 256, 535);
  tracked(ctx, "WINGS", 78, 367, 36, 9);
  rule(ctx, 285, 380, 408);
  tracked(ctx, "SETE ALMAS.", 80, 430, 16, 6);
  tracked(ctx, "INFINITAS HISTÓRIAS.", 80, 459, 16, 6);
  // Positions reserved for authentic files. No imitation of the four-circle mark.
  logo(ctx, assets.logo, eraThemes.wings.logo);
  logo(ctx, assets.btsLogo, btsLogo);
  tracked(ctx, "WINGS", 600, 418, 51, 10);
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = silver;
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.ellipse(724, 306, 201, 201, -0.35, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  star(ctx, 590, 148, 11);
  star(ctx, 535, 397, 11);
  star(ctx, 867, 486, 6);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(60, 519, 821, 383, 8);
  ctx.clip();
  if (model.source === "gallery")
    photo(
      ctx,
      assets,
      model.crop,
      wingsFrames.group,
      model.imageFitMode ?? "cover",
    );
  ctx.restore();
  ctx.strokeStyle = silver;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.roundRect(52, 511, 837, 400, 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(60, 519, 821, 383, 8);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.arc(211, 1111, 134, 0, Math.PI * 2);
  ctx.clip();
  if (assets.personal)
    photo(
      ctx,
      assets.personal,
      model.personalPhoto?.crop ?? model.crop,
      wingsFrames.personal,
    );
  ctx.restore();
  ctx.strokeStyle = white;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(211, 1111, 134, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = silver;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.ellipse(197, 1103, 126, 180, 0.76, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(211, 1111, 140, 149, -0.14, 0, Math.PI * 2);
  ctx.stroke();
  const moon = ctx.createRadialGradient(301, 967, 1, 306, 973, 15);
  moon.addColorStop(0, "#eeeee5");
  moon.addColorStop(0.6, "#9b9b94");
  moon.addColorStop(1, "#30302e");
  ctx.fillStyle = moon;
  ctx.beginPath();
  ctx.arc(306, 973, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#deded6";
  ctx.beginPath();
  ctx.arc(35, 1185, 5, 0, Math.PI * 2);
  ctx.fill();
  star(ctx, 68, 947, 12);
  star(ctx, 99, 1226, 14);
  rule(ctx, 363, 944, 363, 1495);
  rule(ctx, 395, 1024, 882);
  rule(ctx, 395, 1113, 882);
  rule(ctx, 395, 1208, 882);
  rule(ctx, 395, 1312, 882);
  rule(ctx, 630, 1038, 630, 1100);
  rule(ctx, 630, 1128, 630, 1196);
  const entries = [
    ["person", "NOME / APELIDO", 399, 963, 447, 963],
    ["pin", "CIDADE", 399, 1051, 447, 1050],
    ["heart", "BIAS", 657, 1052, 709, 1050],
    ["calendar", "ARMY DESDE", 398, 1142, 447, 1142],
    ["music", "MÚSICA FAVORITA", 658, 1142, 709, 1142],
    ["star", "EXPERIÊNCIA", 397, 1239, 447, 1242],
    ["message", "MENSAGEM", 399, 1343, 447, 1344],
  ] as const;
  for (const [kind, label, x, y, tx, ty] of entries) {
    icon(ctx, kind, x, y);
    tracked(ctx, label, tx, ty, 12, 3);
  }
  const fields = model.fields;
  for (const key of Object.keys(wingsSlots) as (keyof typeof wingsSlots)[]) {
    const value =
      key === "city"
        ? [fields.city.trim(), fields.state].filter(Boolean).join(" / ")
        : key === "experience" && fields.experience === "Prefiro não informar"
          ? ""
          : fields[key];
    drawWingsValue(ctx, value, wingsSlots[key], key === "message" ? 22 : 23);
  }
  rule(ctx, 77, 1318, 137);
  ctx.fillStyle = silver;
  ctx.font = `italic 34px ${serif}`;
  ctx.textBaseline = "top";
  ctx.fillText("“Sete vozes.", 78, 1349);
  ctx.fillText("Infinitas", 106, 1390);
  ctx.fillText("histórias.”", 108, 1431);
  rule(ctx, 61, 1603, 445);
  star(ctx, 470, 1603, 20);
  rule(ctx, 495, 1603, 655);
  tracked(ctx, "@MEUUNIVERSOBTS", 683, 1600, 14, 4);
  if (model.imageCredit)
    drawWingsValue(
      ctx,
      `Foto: ${model.imageCredit}`,
      { x: 60, y: 918, width: 821, height: 17 },
      11,
    );
  ctx.restore();
}
