import { drawContainedPhoto, cropRectangle } from "./image-processing";
import { authorizedLogoPath, containLogo } from "./era-logos";
import { btsLogo, eraThemes } from "./themes";
import { drawFittedText, type TextSlot } from "./canvas-layout";
import type { PreparedImage } from "./renderer";
import type { Crop, EraLogo, PassModel } from "./types";

// Reference coordinates; only the final Canvas scales to 1080 × 1920.
const W = 941,
  H = 1672;
const sans = "'Segoe UI', Arial, 'Segoe UI Emoji', 'Malgun Gothic', sans-serif";
const script =
  "'Segoe Script', 'Segoe Print', Georgia, 'Segoe UI Emoji', 'Malgun Gothic', cursive";
export const mapFrames = {
  group: { x: 98, y: 494, width: 752, height: 360 },
  personal: { x: 113, y: 869, width: 328, height: 328 },
};
export const mapSlots = {
  displayName: { x: 486, y: 914, width: 367, height: 62 },
  city: { x: 515, y: 977, width: 338, height: 45 },
  bias: { x: 490, y: 1076, width: 150, height: 48 },
  armySince: { x: 702, y: 1076, width: 150, height: 48 },
  favoriteSong: { x: 490, y: 1175, width: 363, height: 65 },
  experience: { x: 490, y: 1276, width: 363, height: 57 },
  message: { x: 488, y: 1373, width: 333, height: 135 },
} satisfies Record<string, TextSlot>;
export const mapBtsPlacement = { x: 882, y: 64, width: 49, height: 95 };
export const mapBadgePlacement = { x: 418, y: 1305, width: 30, height: 47 };

function line(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  x2: number,
  y2 = y,
  color = "#e1d8ee",
  width = 0.8,
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
  value: string,
  x: number,
  y: number,
  size: number,
  spacing = 1,
  color = "#f3e8fa",
) {
  ctx.font = `400 ${size}px ${sans}`;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  for (const char of value) {
    ctx.fillText(char, x, y);
    x += ctx.measureText(char).width + spacing;
  }
}
function sparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8,
      radius = i % 2 ? r * 0.12 : i % 4 ? r * 0.5 : r;
    ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
  }
  ctx.closePath();
  ctx.strokeStyle = "#e4c9ec";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}
function photo(
  ctx: CanvasRenderingContext2D,
  image: PreparedImage,
  crop: Crop,
  frame: TextSlot,
  fitMode: "cover" | "contain" = "cover",
) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (fitMode === "contain" && frame === mapFrames.group) {
    drawContainedPhoto(
      ctx,
      image.image,
      image.width,
      image.height,
      frame,
      crop,
    );
    return;
  }
  const box = cropRectangle(
    image.width,
    image.height,
    frame.width,
    frame.height,
    crop,
  );
  ctx.drawImage(
    image.image,
    box.sx,
    box.sy,
    box.sw,
    box.sh,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
  );
}
function brand(
  ctx: CanvasRenderingContext2D,
  image: PreparedImage | undefined,
  config: EraLogo,
) {
  if (!image || !authorizedLogoPath(config)) return false;
  const box = containLogo(image.width, image.height, config.placement);
  ctx.save();
  ctx.scale(W / 1080, H / 1920);
  ctx.drawImage(image.image, box.x, box.y, box.width, box.height);
  ctx.restore();
  return true;
}
function geometry(ctx: CanvasRenderingContext2D) {
  line(ctx, 42, 0, 42, 1672, "#a6c9ee66");
  line(ctx, 357, 0, 357, 130, "#a6c9ee33");
  line(ctx, 730, 0, 730, 476, "#e4c9ec");
  line(ctx, 369, 0, 941, 157, "#9acbeb99");
  ctx.strokeStyle = "#9bd9f15c";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(730, 350, 455, 320, -0.47, Math.PI, Math.PI * 2.16);
  ctx.stroke();
  ctx.strokeStyle = "#ecd4efb3";
  ctx.beginPath();
  ctx.ellipse(729, 265, 183, 84, 0.63, 0, Math.PI * 2);
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 941, 869);
  ctx.clip();
  ctx.beginPath();
  ctx.ellipse(795, 830, 302, 415, -0.18, Math.PI * 0.94, Math.PI * 2.07);
  ctx.stroke();
  ctx.restore();
  ctx.beginPath();
  ctx.ellipse(230, 1454, 168, 275, 0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#bce5f59c";
  ctx.beginPath();
  ctx.moveTo(49, 1218);
  ctx.bezierCurveTo(103, 1064, 257, 1186, 301, 1290);
  ctx.bezierCurveTo(397, 1459, 235, 1599, 304, 1672);
  ctx.stroke();
  line(ctx, 45, 1480, 278, 1306, "#fff2f9ad", 2);
  line(ctx, 43, 1600, 475, 1669, "#e9d1f199");
  line(ctx, 873, 867, 873, 1672, "#e2d6f1d9");
  line(ctx, 879, 1349, 879, 1672, "#e4b3e0bd");
  line(ctx, 49, 869, 49, 1217, "#fff2fb");
  for (const [x, ys] of [
    [49, [1021, 1048, 1076]],
    [873, [1103, 1129, 1181]],
  ] as const) {
    for (const y of ys) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, y === 1181 || x === 49 ? 5.2 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.beginPath();
  ctx.ellipse(574, 400, 8, 10, 0, 0, Math.PI * 2);
  ctx.stroke();
  sparkle(ctx, 96, 73, 21);
  sparkle(ctx, 818, 1376, 16);
}
function portraitFrame(ctx: CanvasRenderingContext2D) {
  const cx = 277,
    cy = 1033;
  const glass = ctx.createLinearGradient(100, 870, 450, 1185);
  glass.addColorStop(0, "#65c8ff");
  glass.addColorStop(0.18, "#ffcffc");
  glass.addColorStop(0.39, "#308cda");
  glass.addColorStop(0.6, "#a4defb");
  glass.addColorStop(0.8, "#bea2e9");
  glass.addColorStop(1, "#f8d6f2");
  ctx.strokeStyle = glass;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 174, 177, -0.19, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 181, 172, -0.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#e4eeff";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx, cy, 164, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#a0dbffb3";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 187, 178, -0.38, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#f0bde5c4";
  ctx.beginPath();
  ctx.ellipse(cx, cy, 168, 185, 0.38, 0, Math.PI * 2);
  ctx.stroke();
  const badge = ctx.createLinearGradient(350, 1125, 410, 1190);
  badge.addColorStop(0, "#f9dcf4");
  badge.addColorStop(0.6, "#c0daf4");
  badge.addColorStop(1, "#e5c1e8");
  ctx.fillStyle = badge;
  ctx.beginPath();
  ctx.arc(381, 1158, 33, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#edf6ff";
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function drawMapPass(
  ctx: CanvasRenderingContext2D,
  model: PassModel,
  assets: PreparedImage,
) {
  ctx.save();
  ctx.clearRect(0, 0, 1080, 1920);
  ctx.scale(1080 / W, 1920 / H);
  ctx.fillStyle = "#172d57";
  ctx.fillRect(0, 0, W, H);
  if (assets.texture) ctx.drawImage(assets.texture.image, 0, 0, W, H);
  geometry(ctx);
  tracked(ctx, "PURPLE PASS", 131, 63, 23, 0.5);
  tracked(ctx, "ARMY PASS BRASIL", 91, 112, 20, 8);
  const title = ctx.createLinearGradient(84, 188, 494, 350);
  title.addColorStop(0, "#ffffff");
  title.addColorStop(0.32, "#efc6eb");
  title.addColorStop(0.6, "#ffffff");
  title.addColorStop(1, "#75b8ea");
  ctx.fillStyle = title;
  ctx.textBaseline = "top";
  ctx.font = `300 88px ${sans}`;
  ctx.fillText("MAP OF", 83, 174, 365);
  ctx.fillText("THE SOUL", 83, 264, 386);
  ctx.font = `300 158px ${sans}`;
  ctx.fillText("7", 467, 235);
  tracked(ctx, "QUEM SOMOS EM NOSSO CAMINHO", 91, 379, 16, 2.2);
  tracked(ctx, "TAMBÉM É PARTE DE NÓS.", 91, 405, 16, 2.2);

  line(ctx, 845, 74, 845, 251);
  tracked(ctx, "BR", 863, 63, 24, 0, "#c8cee5");
  tracked(ctx, "07", 863, 89, 25, 0);
  line(ctx, 865, 130, 896);
  for (const [index, text] of ["MAP", "OF", "THE", "SOUL", "7"].entries())
    tracked(ctx, text, 864, 148 + index * 20, 14, 0.3, "#c2d4ef");
  const hasBts = brand(ctx, assets.btsLogo, {
    ...btsLogo,
    placement: mapBtsPlacement,
  });
  if (!hasBts) tracked(ctx, "BTS", 768, 120, 21, 5);
  ctx.save();
  ctx.translate(895, 366);
  ctx.rotate(Math.PI / 2);
  tracked(ctx, "NOSSO UNIVERSO", 0, 0, 15, 2, "#6686b6");
  ctx.restore();
  line(ctx, 916, 366, 916, 505);

  // The abstract atmosphere is the default when no authorized gallery exists.
  const photoLight = ctx.createLinearGradient(98, 494, 850, 854);
  photoLight.addColorStop(0, "#afc9e845");
  photoLight.addColorStop(0.65, "#d7b5d933");
  photoLight.addColorStop(1, "#f0c9e785");
  ctx.fillStyle = photoLight;
  ctx.fillRect(98, 494, 752, 360);
  ctx.save();
  ctx.beginPath();
  ctx.rect(98, 494, 752, 360);
  ctx.clip();
  if (model.source === "gallery")
    photo(
      ctx,
      assets,
      model.crop,
      mapFrames.group,
      model.imageFitMode ?? "cover",
    );
  ctx.restore();
  ctx.strokeStyle = "#dbdef3";
  ctx.lineWidth = 1;
  ctx.strokeRect(91, 476, 775, 391);
  ctx.strokeRect(98, 494, 752, 360);
  line(ctx, 115, 516, 133);
  line(ctx, 115, 516, 115, 534);
  if (!brand(ctx, assets.logo, eraThemes["map-of-the-soul"].logo)) {
    // A plain typographic identifier, deliberately not a facsimile of the
    // official multicolour seven. Its exact asset area remains reserved.
    ctx.fillStyle = "#a8d7f0b3";
    ctx.font = `200 385px ${sans}`;
    ctx.fillText("7", 643, 225, 244);
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(277, 1033, 164, 0, Math.PI * 2);
  ctx.clip();
  const portrait = ctx.createLinearGradient(113, 869, 441, 1197);
  portrait.addColorStop(0, "#c8bfdb66");
  portrait.addColorStop(1, "#91b6dd22");
  ctx.fillStyle = portrait;
  ctx.fillRect(113, 869, 328, 328);
  if (assets.personal)
    photo(
      ctx,
      assets.personal,
      model.personalPhoto?.crop ?? model.crop,
      mapFrames.personal,
    );
  ctx.restore();
  portraitFrame(ctx);
  brand(ctx, assets.btsLogo, { ...btsLogo, placement: mapBadgePlacement });

  const fields = model.fields;
  drawFittedText(ctx, fields.displayName, mapSlots.displayName, {
    size: 48,
    family: sans,
    weight: "300",
  });
  if (fields.city.trim() || fields.state) {
    ctx.strokeStyle = "#eaf3ff";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(498, 995);
    ctx.bezierCurveTo(481, 978, 499, 970, 504, 983);
    ctx.bezierCurveTo(506, 987, 501, 992, 498, 995);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(498, 983, 2.5, 0, Math.PI * 2);
    ctx.stroke();
    drawFittedText(
      ctx,
      [fields.city.trim(), fields.state].filter(Boolean).join(" · "),
      mapSlots.city,
      { size: 21, family: sans },
    );
  }
  line(ctx, 490, 1023, 530, 1023, "#b1c2d6");
  tracked(ctx, "MEU BIAS", 490, 1053, 15, 0.8);
  tracked(ctx, "ARMY DESDE", 702, 1053, 15, 0.8);
  line(ctx, 653, 1067, 653, 1107);
  drawFittedText(ctx, fields.bias, mapSlots.bias, { size: 28, family: sans });
  drawFittedText(ctx, fields.armySince, mapSlots.armySince, {
    size: 28,
    family: sans,
  });
  if (fields.favoriteSong.trim())
    tracked(ctx, "MINHA TRILHA SONORA", 490, 1152, 15, 0.8);
  drawFittedText(ctx, fields.favoriteSong, mapSlots.favoriteSong, {
    size: 28,
    family: sans,
  });
  const experience =
    fields.experience === "Prefiro não informar" ? "" : fields.experience;
  if (experience) tracked(ctx, "MEU ENCONTRO DOS SONHOS", 490, 1253, 15, 0.6);
  drawFittedText(ctx, experience, mapSlots.experience, {
    size: 26,
    family: sans,
  });
  line(ctx, 490, 1339, 728);
  drawFittedText(
    ctx,
    fields.message.trim() || "Cada encontro abre um novo universo.",
    mapSlots.message,
    {
      size: 32,
      family: script,
      weight: "italic",
      color: "#f3e0f6",
      leading: 1.32,
    },
  );
  // Editorial side matter is composed separately from the future authentic marks.
  for (const [index, text] of ["MAP", "OF", "THE", "SOUL", "7"].entries())
    tracked(ctx, text, 76, 1479 + index * 20, 14, 0, "#4571a1");
  line(ctx, 75, 1600, 112, 1600, "#4777a9");
  tracked(ctx, "ARMY BRASIL", 744, 1560, 13, 1.2, "#4a71ad");
  tracked(ctx, "@MEUUNIVERSOBTS", 697, 1580, 13, 1.3, "#4a71ad");
  line(ctx, 778, 1603, 847, 1603, "#5a7bb3");
  if (model.imageCredit)
    drawFittedText(
      ctx,
      `Foto: ${model.imageCredit}`,
      { x: 98, y: 855, width: 752, height: 12 },
      { size: 9, family: sans },
    );
  ctx.restore();
}
