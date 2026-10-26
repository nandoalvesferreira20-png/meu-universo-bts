import { wrapText } from "./canvas-layout";
import { drawMapPass } from "./map-renderer";
import { drawPersonaPass } from "./persona-renderer";
import { drawArirangPass } from "./arirang-renderer";
import { authorizedLogoPath, containLogo } from "./era-logos";
import { eraThemes } from "./themes";
import { cropRectangle } from "./image-processing";
import type { PassFields, PassModel } from "./types";
import { drawWingsPass } from "./wings-renderer";

export const PASS_WIDTH = 1080;
export const PASS_HEIGHT = 1920;
type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
};
export const imageFrames: Record<PassModel["era"], Box> = {
  wings: { x: 69, y: 596, width: 942, height: 440, radius: 9 },
  "map-of-the-soul": { x: 112, y: 567, width: 863, height: 413, radius: 0 },
  be: { x: 134, y: 348, width: 812, height: 660, radius: 0 },
  persona: { x: 110, y: 540, width: 895, height: 464, radius: 0 },
  arirang: { x: 56, y: 508, width: 971, height: 456, radius: 24 },
};
export type PreparedImage = {
  texture?: PreparedImage;
  personal?: PreparedImage;
  btsLogo?: PreparedImage;
  logo?: PreparedImage;
  image: CanvasImageSource;
  width: number;
  height: number;
};
const fallback =
  "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', 'Malgun Gothic'";
const sans = `Arial, Helvetica, ${fallback}, sans-serif`;
const serif = `Georgia, 'Times New Roman', ${fallback}, serif`;

export { wrapText } from "./canvas-layout";

function textBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  size: number,
  color: string,
  family = sans,
  weight = "400",
) {
  let lines: string[] = [];
  let fontSize = size;
  for (; fontSize >= 12; fontSize--) {
    ctx.font = `${weight} ${fontSize}px ${family}`;
    lines = wrapText(ctx, text, width);
    if (lines.length * fontSize * 1.22 <= height) break;
  }
  // Muitas quebras manuais não podem empurrar o texto para fora do passaporte.
  // Nesse caso, redistribuir o conteúdo sem removê-lo ou usar reticências.
  if (fontSize < 12) {
    const continuous = text.replace(/\s+/gu, " ").trim();
    for (fontSize = size; fontSize >= 12; fontSize--) {
      ctx.font = `${weight} ${fontSize}px ${family}`;
      lines = wrapText(ctx, continuous, width);
      if (lines.length * fontSize * 1.22 <= height) break;
    }
  }
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * fontSize * 1.22));
  return lines.length * fontSize * 1.22;
}

function line(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  endX: number,
  endY: number,
  color: string,
  width = 1,
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function detailRows(fields: PassFields) {
  return [
    { label: "BIAS", value: fields.bias },
    ...(fields.armySince
      ? [{ label: "ARMY DESDE", value: fields.armySince }]
      : []),
    ...(fields.favoriteSong.trim()
      ? [{ label: "NA MINHA PLAYLIST", value: fields.favoriteSong.trim() }]
      : []),
    ...(fields.experience !== "Prefiro não informar"
      ? [{ label: "MINHA CONEXÃO", value: fields.experience }]
      : []),
  ];
}

// O espaço da imagem cresce quando há menos conteúdo, sem reservar campos vazios.
export function imageExpansion(fields: PassFields) {
  const details = [
    fields.city.trim() || fields.state,
    fields.favoriteSong.trim(),
    fields.experience !== "Prefiro não informar",
    fields.message.trim(),
  ].filter(Boolean).length;
  return (4 - details) * 35;
}

export function drawEraLogo(
  ctx: CanvasRenderingContext2D,
  logo: PreparedImage | undefined,
  config: (typeof eraThemes)["wings"]["logo"],
) {
  if (!logo || !authorizedLogoPath(config)) return false;
  const fit = containLogo(logo.width, logo.height, config.placement);
  ctx.drawImage(logo.image, fit.x, fit.y, fit.width, fit.height);
  return true;
}

function tracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
  spacing = 3,
) {
  ctx.font = `500 ${size}px ${sans}`;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  for (const char of text) {
    ctx.fillText(char, x, y);
    x += ctx.measureText(char).width + spacing;
  }
}

function imageWindow(
  ctx: CanvasRenderingContext2D,
  model: PassModel,
  asset: PreparedImage,
  extra: number,
) {
  const { x, y, width, height, radius } = imageFrames[model.era];
  const h = height + extra;
  const palette = eraThemes[model.era].colors;
  ctx.save();
  if (model.era === "be") {
    ctx.translate(540, y + h / 2);
    ctx.rotate(-0.025);
    ctx.translate(-540, -y - h / 2);
    ctx.shadowColor = `${palette.dark}24`;
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = palette.light;
    ctx.fillRect(x - 20, y - 20, width + 40, h + 44);
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 20, y - 20, width + 40, h + 44);
  }
  ctx.beginPath();
  ctx.roundRect(
    x,
    y,
    width,
    h,
    model.era === "wings"
      ? [radius, radius, 0, 0]
      : model.era === "map-of-the-soul"
        ? [0, radius, 0, radius]
        : 0,
  );
  ctx.save();
  ctx.clip();
  const crop =
    model.source === "artwork" ? { zoom: 1, x: 50, y: 50 } : model.crop;
  const { sx, sy, sw, sh } = cropRectangle(
    asset.width,
    asset.height,
    width,
    h,
    crop,
  );
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(asset.image, sx, sy, sw, sh, x, y, width, h);
  ctx.restore();
  if (model.era === "wings") {
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  if (model.era === "be")
    tracked(
      ctx,
      "UMA MEMÓRIA PARA GUARDAR",
      x + 16,
      y + h + 10,
      12,
      palette.dark,
      2,
    );
  ctx.restore();
}

// Um único renderizador editorial para Canvas de prévia e PNG 1080 × 1920.
export function drawArmyPass(
  ctx: CanvasRenderingContext2D,
  model: PassModel,
  asset: PreparedImage,
) {
  if (model.era === "wings") {
    drawWingsPass(ctx, model, asset);
    return;
  }
  if (model.era === "map-of-the-soul") {
    drawMapPass(ctx, model, asset);
    return;
  }
  if (model.era === "persona") {
    drawPersonaPass(ctx, model, asset);
    return;
  }
  if (model.era === "arirang") {
    drawArirangPass(ctx, model, asset);
    return;
  }
  // The remaining legacy composition is preserved. A portrait can occupy
  // their existing photo window until their approved designs are supplied.
  if (model.source !== "gallery" && asset.personal && model.personalPhoto) {
    asset = { ...asset.personal, logo: asset.logo };
    model = { ...model, source: "personal", crop: model.personalPhoto.crop };
  }
  const theme = eraThemes[model.era];
  const { dark, mid, accent, light } = theme.colors;
  const bright = model.era === "be" || model.era === "map-of-the-soul";
  const ink = bright || model.era === "arirang" ? dark : light;
  const extra = imageExpansion(model.fields);
  ctx.save();
  ctx.clearRect(0, 0, PASS_WIDTH, PASS_HEIGHT);
  ctx.fillStyle = bright ? light : dark;
  ctx.fillRect(0, 0, PASS_WIDTH, PASS_HEIGHT);

  if (model.era === "map-of-the-soul") {
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.ellipse(995, 290, 320, 460, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = mid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(1010, 300, 300, 490, 0.5, 0, Math.PI * 2);
    ctx.stroke();
    tracked(ctx, "FAN COLLECTION / 02", 724, 78, 16, dark, 1.5);
    textBlock(ctx, "MAP OF", 76, 154, 740, 93, 78, dark, serif, "italic");
    textBlock(ctx, "THE SOUL", 170, 235, 650, 112, 86, dark, serif, "italic");
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.18;
    ctx.fillRect(32, 1030 + extra, 1016, 720 - extra);
    ctx.globalAlpha = 1;
  } else if (model.era === "be") {
    tracked(ctx, "FAN COLLECTION / 03", 724, 78, 16, dark, 1.5);
    line(ctx, 76, 128, 1004, 128, mid);
    textBlock(ctx, "BE", 80, 172, 480, 145, 126, dark, serif);
    textBlock(
      ctx,
      "a beleza de ser,\ndo seu jeito.",
      580,
      222,
      390,
      80,
      27,
      dark,
      serif,
      "italic",
    );
    line(ctx, 74, 346, 74, 961 + extra, accent);
    line(ctx, 1006, 393, 1006, 1001 + extra, accent);
  } else {
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, PASS_WIDTH, 120);
    tracked(ctx, "FAN COLLECTION / 04", 724, 76, 16, dark, 1.5);
    textBlock(ctx, "ARIRANG", 70, 175, 746, 148, 117, light, sans, "700");
    tracked(ctx, "MEMÓRIAS EM MOVIMENTO", 78, 321, 18, accent, 4);
    ctx.fillStyle = mid;
    ctx.fillRect(48, 356, 984, 681 + extra);
    ctx.fillStyle = light;
    ctx.fillRect(0, 1040 + extra, 1080, 720 - extra);
    ctx.fillStyle = accent;
    ctx.fillRect(78, 140, 70, 3);
  }
  tracked(
    ctx,
    "ARMY PASS BRASIL",
    80,
    76,
    23,
    model.era === "arirang" ? dark : bright ? dark : light,
    2,
  );
  imageWindow(ctx, model, asset, extra);
  const hasLogo = drawEraLogo(ctx, asset.logo, theme.logo);

  let y = 1075 + extra;
  const nameHeight = textBlock(
    ctx,
    model.fields.displayName.trim(),
    84,
    y,
    912,
    128,
    model.era === "arirang" ? 70 : 74,
    ink,
    model.era === "arirang" ? sans : serif,
    model.era === "arirang" ? "700" : "400",
  );
  y += nameHeight + 10;
  const location = [model.fields.city.trim(), model.fields.state]
    .filter(Boolean)
    .join(" / ");
  if (location) y += textBlock(ctx, location, 88, y, 900, 54, 26, ink) + 12;
  line(
    ctx,
    85,
    y + 6,
    995,
    y + 6,
    model.era === "wings" ? accent : model.era === "arirang" ? mid : accent,
  );
  y += 24;
  const rows = detailRows(model.fields);
  const short = rows.filter(
    (row) => row.label === "BIAS" || row.label === "ARMY DESDE",
  );
  short.forEach((row, index) => {
    const x = 88 + index * 455;
    textBlock(ctx, row.label, x, y, 425, 25, 17, ink);
    textBlock(
      ctx,
      row.value,
      x,
      y + 26,
      425,
      40,
      31,
      ink,
      model.era === "arirang" ? sans : serif,
    );
  });
  y += 76;
  rows
    .filter((row) => !short.includes(row))
    .forEach((row) => {
      textBlock(ctx, row.label, 88, y, 900, 25, 17, ink);
      const used = textBlock(ctx, row.value, 88, y + 25, 900, 72, 29, ink);
      y += 25 + used + 12;
    });
  if (model.fields.message.trim()) {
    y += 5;
    textBlock(
      ctx,
      model.fields.message.trim(),
      88,
      y,
      900,
      1740 - y,
      34,
      ink,
      serif,
      "italic",
    );
  }
  const footerInk = model.era === "arirang" ? light : ink;
  if (model.imageCredit)
    textBlock(ctx, `FOTO: ${model.imageCredit}`, 88, 1750, 900, 24, 16, ink);
  line(
    ctx,
    85,
    1778,
    995,
    1778,
    model.era === "wings" ? accent : bright ? mid : accent,
  );
  textBlock(
    ctx,
    `ARMY BR / ${theme.name} / EDIÇÃO DE FÃ`,
    88,
    1803,
    900,
    30,
    18,
    footerInk,
  );
  textBlock(
    ctx,
    "EM COLABORAÇÃO COM @meuuniversobts",
    88,
    1842,
    900,
    28,
    18,
    footerInk,
  );
  if (hasLogo)
    textBlock(
      ctx,
      `IDENTIDADE: ${theme.logo.credit}`,
      88,
      1876,
      900,
      23,
      13,
      footerInk,
    );
  ctx.restore();
}
