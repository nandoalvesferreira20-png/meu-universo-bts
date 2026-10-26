import { drawFittedText, type TextSlot } from "./canvas-layout";
import { drawContainedPhoto, cropRectangle } from "./image-processing";
import { authorizedLogoPath, containLogo } from "./era-logos";
import { btsLogo, eraThemes } from "./themes";
import type { PreparedImage } from "./renderer";
import type { Crop, EraLogo, PassFields, PassModel } from "./types";

const sans = "'Segoe UI', Arial, 'Segoe UI Emoji', 'Malgun Gothic', sans-serif";
const script =
  "'Segoe Script', Georgia, 'Segoe UI Emoji', 'Malgun Gothic', cursive";
const cream = "#fff8ef";
export const personaFrames = {
  group: { x: 96, y: 470, width: 780, height: 404 },
  personal: { x: 113, y: 859, width: 354, height: 354 },
};
export const personaBtsPlacement = { x: 873, y: 113, width: 54, height: 113 };
export const personaBadgePlacement = { x: 437, y: 1310, width: 29, height: 53 };

/** Empty optional rows close up without moving either photograph. */
export function personaLayout(fields: PassFields) {
  const shortY = fields.city.trim() || fields.state ? 1047 : 1000;
  let next = shortY + 99;
  const songY = next;
  if (fields.favoriteSong.trim()) next += 92;
  const experienceY = next;
  if (fields.experience !== "Prefiro não informar") next += 92;
  const messageY = next + 24;
  return {
    shortY,
    songY,
    experienceY,
    slots: {
      displayName: { x: 505, y: 915, width: 369, height: 60 },
      city: { x: 530, y: 975, width: 344, height: 44 },
      bias: { x: 511, y: shortY + 29, width: 145, height: 49 },
      armySince: { x: 713, y: shortY + 29, width: 161, height: 49 },
      favoriteSong: { x: 511, y: songY + 28, width: 363, height: 59 },
      experience: { x: 511, y: experienceY + 29, width: 363, height: 55 },
      message: {
        x: 516,
        y: messageY,
        width: 321,
        height: Math.min(170, 1500 - messageY),
      },
    } satisfies Record<string, TextSlot>,
  };
}
function line(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  x2: number,
  y2 = y,
  width = 1,
  color = "#fff4e7c9",
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}
function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  spacing = 0,
  color = cream,
) {
  ctx.font = `300 ${size}px ${sans}`;
  ctx.textBaseline = "top";
  ctx.fillStyle = color;
  for (const char of value) {
    ctx.fillText(char, x, y);
    x += ctx.measureText(char).width + spacing;
  }
}
function heart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  angle = 0,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(size / 32, size / 32);
  ctx.beginPath();
  ctx.moveTo(16, 30);
  ctx.bezierCurveTo(-12, 10, 1, -9, 15, 3);
  ctx.bezierCurveTo(27, -10, 45, 7, 16, 30);
  ctx.strokeStyle = "#fff5e9";
  ctx.lineWidth = (1.3 * 32) / size;
  ctx.stroke();
  ctx.restore();
}
function star(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8,
      r = i % 2 ? radius * 0.34 : radius;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.strokeStyle = cream;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();
}
function cover(
  ctx: CanvasRenderingContext2D,
  asset: PreparedImage,
  crop: Crop,
  frame: TextSlot,
  fitMode: "cover" | "contain" = "cover",
) {
  if (fitMode === "contain" && frame === personaFrames.group) {
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
function brand(
  ctx: CanvasRenderingContext2D,
  asset: PreparedImage | undefined,
  config: EraLogo,
) {
  if (!asset || !authorizedLogoPath(config)) return false;
  const r = containLogo(asset.width, asset.height, config.placement);
  ctx.save();
  ctx.scale(941 / 1080, 1672 / 1920);
  ctx.drawImage(asset.image, r.x, r.y, r.width, r.height);
  ctx.restore();
  return true;
}
function polygon(ctx: CanvasRenderingContext2D, points: number[][]) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
}
function sky(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
  gradient.addColorStop(0, "#bbc1e4");
  gradient.addColorStop(0.55, "#f5c3d3");
  gradient.addColorStop(1, "#ffe5d8");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, w, h);
  for (let i = 0; i < 15; i++) {
    const cx = x + (((i * 47) % 203) / 203) * w,
      cy = y + h * (0.35 + (i % 4) * 0.17),
      r = w * (0.14 + (i % 3) * 0.04);
    const cloud = ctx.createRadialGradient(cx, cy, 1, cx, cy, r);
    cloud.addColorStop(0, "#fff2dfd9");
    cloud.addColorStop(0.6, "#ffe0d5a3");
    cloud.addColorStop(1, "#ffdfda00");
    ctx.fillStyle = cloud;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
  ctx.restore();
}
function prints(ctx: CanvasRenderingContext2D) {
  // Original architectural study and cloud illustration, not gallery photos.
  ctx.save();
  ctx.translate(42, 1171);
  ctx.rotate(-0.27);
  ctx.fillStyle = "#fff1e8";
  ctx.fillRect(0, 0, 174, 278);
  sky(ctx, 11, 11, 152, 178);
  ctx.fillStyle = "#e899ad";
  ctx.fillRect(15, 71, 143, 114);
  ctx.fillStyle = "#d87b99";
  ctx.fillRect(74, 33, 83, 152);
  for (let i = 0; i < 8; i++)
    line(ctx, 80 + i * 10, 34, 80 + i * 10, 183, 0.6, "#f7c8d1");
  for (const x of [28, 51, 101, 130]) {
    ctx.fillStyle = "#c97a96";
    ctx.fillRect(x, 99, 11, 26);
  }
  ctx.restore();
  ctx.save();
  ctx.translate(155, 1338);
  ctx.rotate(-0.26);
  ctx.fillStyle = "#fff2e9";
  ctx.fillRect(0, 0, 222, 300);
  sky(ctx, 12, 12, 198, 138);
  ctx.fillStyle = "#e57998";
  ctx.textBaseline = "top";
  ctx.font = `italic 28px ${script}`;
  ctx.fillText("Map of", 31, 164);
  ctx.fillText("the Soul", 35, 203);
  ctx.fillText("Persona", 64, 245);
  ctx.restore();
}
function decorations(ctx: CanvasRenderingContext2D) {
  star(ctx, 90, 65, 16);
  line(ctx, 418, 65, 700);
  line(ctx, 47, 0, 47, 1672);
  line(ctx, 732, 0, 732, 286);
  line(ctx, 836, 95, 836, 358);
  ctx.strokeStyle = "#fff7e8bf";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-20, 447);
  ctx.bezierCurveTo(114, 385, 183, 391, 315, 414);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-30, 519);
  ctx.bezierCurveTo(23, 541, 63, 541, 117, 568);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(560, 146);
  ctx.bezierCurveTo(627, 18, 807, 167, 747, 303);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(74, 1078);
  ctx.bezierCurveTo(80, 1213, 295, 1208, 396, 1190);
  ctx.bezierCurveTo(569, 1164, 426, 1462, 323, 1508);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(424, 1214);
  ctx.bezierCurveTo(404, 1325, 533, 1426, 495, 1672);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(228, 1537);
  ctx.bezierCurveTo(414, 1515, 692, 1568, 767, 1672);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(820, 1160);
  ctx.bezierCurveTo(857, 1139, 905, 1129, 941, 1128);
  ctx.stroke();
  heart(ctx, 110, 887, 42, -0.25);
  heart(ctx, 169, 1128, 37, -0.2);
  heart(ctx, 786, 1480, 32, -0.18);
  for (const [x, y, r] of [
    [895, 1208, 5],
    [895, 1257, 4],
    [395, 446, 2.3],
    [83, 455, 2.5],
    [281, 110, 2.2],
  ]) {
    ctx.fillStyle = cream;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  line(ctx, 895, 889, 895, 1208);
  line(ctx, 895, 1270, 895, 1630);
}

export function drawPersonaPass(
  ctx: CanvasRenderingContext2D,
  model: PassModel,
  assets: PreparedImage,
) {
  ctx.save();
  ctx.clearRect(0, 0, 1080, 1920);
  ctx.scale(1080 / 941, 1920 / 1672);
  ctx.fillStyle = "#e87798";
  ctx.fillRect(0, 0, 941, 1672);
  if (assets.texture) ctx.drawImage(assets.texture.image, 0, 0, 941, 1672);
  decorations(ctx);
  prints(ctx);
  text(ctx, "ARMY PASS BRASIL", 125, 55, 21, 5.5);
  text(ctx, "BR / 03", 813, 55, 21);
  ctx.textBaseline = "top";
  ctx.fillStyle = cream;
  ctx.font = `200 51px ${sans}`;
  ctx.fillText("MAP OF THE SOUL", 79, 106, 455);
  ctx.font = `300 104px ${sans}`;
  ctx.fillText("PERSONA", 76, 152, 460);
  for (const [i, row] of ["O AMOR", "TAMBÉM", "FAZ PARTE", "DE NÓS."].entries())
    text(ctx, row, 83, 275 + i * 20, 16, 2, "#fff3e5cc");
  line(ctx, 83, 368, 120, 368, 0.6);
  if (
    !brand(ctx, assets.btsLogo, { ...btsLogo, placement: personaBtsPlacement })
  )
    text(ctx, "BTS", 760, 179, 23, 5);
  for (const [i, row] of ["MAP", "OF", "THE", "SOUL", "PERSONA"].entries())
    text(ctx, row, 849, 116 + i * 20, 13, 0);
  line(ctx, 850, 226, 888);
  // Generic decorative heart. It is not labelled or presented as an official logo.
  if (!brand(ctx, assets.logo, eraThemes.persona.logo)) {
    heart(ctx, 431, 269, 266, -0.05);
    text(ctx, "PERSONA", 576, 406, 9, 0.7);
  }

  const groupQuad = [
    [96, 470],
    [876, 534],
    [876, 874],
    [96, 857],
  ];
  ctx.save();
  polygon(ctx, groupQuad);
  ctx.clip();
  if (model.source === "gallery")
    cover(
      ctx,
      assets,
      model.crop,
      personaFrames.group,
      model.imageFitMode ?? "cover",
    );
  else {
    const g = ctx.createLinearGradient(96, 470, 876, 874);
    g.addColorStop(0, "#fff4e742");
    g.addColorStop(0.5, "#ffb8bf75");
    g.addColorStop(1, "#e6749575");
    ctx.fillStyle = g;
    ctx.fillRect(96, 470, 780, 404);
  }
  ctx.restore();
  ctx.strokeStyle = cream;
  ctx.lineWidth = 1.2;
  polygon(ctx, [
    [82, 455],
    [890, 518],
    [890, 888],
    [82, 872],
  ]);
  ctx.stroke();
  polygon(ctx, groupQuad);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.arc(290, 1036, 177, 0, Math.PI * 2);
  ctx.clip();
  if (assets.personal)
    cover(
      ctx,
      assets.personal,
      model.personalPhoto?.crop ?? model.crop,
      personaFrames.personal,
    );
  else {
    const g = ctx.createLinearGradient(113, 859, 467, 1213);
    g.addColorStop(0, "#ffe8de70");
    g.addColorStop(1, "#d78caa24");
    ctx.fillStyle = g;
    ctx.fillRect(113, 859, 354, 354);
  }
  ctx.restore();
  ctx.strokeStyle = cream;
  heart(ctx, 169, 1128, 37, -0.2);
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(290, 1036, 177, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.ellipse(290, 1036, 186, 189, -0.1, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#ffded5ad";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(290, 1036, 182, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#fff5ea";
  ctx.beginPath();
  ctx.arc(393, 1170, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffb6c6";
  ctx.lineWidth = 2;
  ctx.stroke();
  if (
    !brand(ctx, assets.btsLogo, {
      ...btsLogo,
      placement: personaBadgePlacement,
    })
  )
    text(ctx, "BR", 382, 1161, 13, 0.5, "#d86b8d");

  const f = model.fields,
    layout = personaLayout(f),
    s = layout.slots;
  const value = (
    v: string,
    slot: TextSlot,
    size: number,
    family = sans,
    weight = "400",
  ) =>
    drawFittedText(ctx, v, slot, {
      size,
      family,
      weight,
      color: cream,
      leading: family === script ? 1.32 : 1.22,
    });
  value(f.displayName, s.displayName, 47, sans, "300");
  if (f.city.trim() || f.state) {
    ctx.strokeStyle = cream;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(516, 990);
    ctx.bezierCurveTo(500, 975, 520, 967, 521, 979);
    ctx.bezierCurveTo(522, 983, 518, 987, 516, 990);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(516, 979, 2, 0, Math.PI * 2);
    ctx.stroke();
    value([f.city.trim(), f.state].filter(Boolean).join(" · "), s.city, 22);
  }
  text(ctx, "MEU BIAS", 511, layout.shortY, 16);
  value(f.bias, s.bias, 29);
  if (f.armySince) {
    text(ctx, "ARMY DESDE", 713, layout.shortY, 16);
    value(f.armySince, s.armySince, 29);
    line(ctx, 669, layout.shortY, 669, layout.shortY + 56);
  }
  if (f.favoriteSong.trim()) {
    text(ctx, "MINHA TRILHA SONORA", 511, layout.songY, 16);
    value(f.favoriteSong, s.favoriteSong, 28);
  }
  if (f.experience !== "Prefiro não informar") {
    text(ctx, "MEU ENCONTRO DOS SONHOS", 511, layout.experienceY, 16);
    value(f.experience, s.experience, 26);
  }
  line(ctx, 511, s.message.y - 30, 679);
  value(
    f.message.trim() || "Entre encontros, nossa história floresce.",
    s.message,
    36,
    script,
    "italic",
  );
  text(ctx, "MAP OF", 76, 1548, 14, 0, "#d86489");
  text(ctx, "THE SOUL", 76, 1568, 14, 0, "#d86489");
  text(ctx, "PERSONA", 76, 1588, 14, 0, "#d86489");
  line(ctx, 76, 1614, 112, 1614, 1, "#d86489");
  text(ctx, "ARMY BRASIL", 767, 1576, 14, 0, "#cc5d84");
  text(ctx, "@MEUUNIVERSOBTS", 716, 1596, 14, 0, "#cc5d84");
  if (model.imageCredit)
    drawFittedText(
      ctx,
      `Foto: ${model.imageCredit}`,
      { x: 510, y: 894, width: 364, height: 15 },
      { size: 10, family: sans, color: cream },
    );
  ctx.restore();
}
