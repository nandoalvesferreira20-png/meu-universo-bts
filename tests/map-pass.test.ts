import assert from "node:assert/strict";
import { test } from "node:test";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import {
  drawArmyPass,
  type PreparedImage,
} from "../src/features/army-pass/renderer";
import { drawFittedText } from "../src/features/army-pass/canvas-layout";
import { mapFrames, mapSlots } from "../src/features/army-pass/map-renderer";
import { defaultCrop, initialFields } from "../src/features/army-pass/state";
import { eraThemes } from "../src/features/army-pass/themes";
import type { EraLogo, PassModel } from "../src/features/army-pass/types";

const model: PassModel = {
  era: "map-of-the-soul",
  fields: {
    ...initialFields,
    displayName: "Fernando",
    city: "São Paulo",
    state: "SP",
    bias: "j-hope",
    armySince: "2018",
    favoriteSong: "Minha trilha",
    experience: "Cinema",
    message: "Uma história compartilhada.",
  },
  source: "artwork",
  artwork: 0,
  imageUrl: null,
  crop: defaultCrop,
};
const context = () =>
  createCanvas(1080, 1920).getContext(
    "2d",
  ) as unknown as CanvasRenderingContext2D;
function split(
  width: number,
  height: number,
  left: string,
  right: string,
): PreparedImage {
  const canvas = createCanvas(width, height),
    ctx = canvas.getContext("2d");
  ctx.fillStyle = left;
  ctx.fillRect(0, 0, width / 2, height);
  ctx.fillStyle = right;
  ctx.fillRect(width / 2, 0, width / 2, height);
  return { image: canvas as unknown as CanvasImageSource, width, height };
}
function pixel(ctx: CanvasRenderingContext2D, x: number, y: number) {
  return [
    ...ctx.getImageData(
      Math.round((x * 1080) / 941),
      Math.round((y * 1920) / 1672),
      1,
      1,
    ).data,
  ];
}

test("MAP: duas fotos, cover sem distorção, círculo e recortes independentes", () => {
  assert.equal(mapFrames.personal.width, mapFrames.personal.height);
  const assets = {
    ...split(800, 400, "red", "yellow"),
    personal: split(400, 800, "blue", "lime"),
  };
  const ctx = context();
  const input: PassModel = {
    ...model,
    source: "gallery",
    crop: { zoom: 3, x: 0, y: 50 },
    personalPhoto: { url: "blob:test-only", crop: { zoom: 3, x: 100, y: 50 } },
  };
  drawArmyPass(ctx, input, assets);
  assert.deepEqual(pixel(ctx, 450, 700), [255, 0, 0, 255]);
  assert.deepEqual(pixel(ctx, 277, 1033), [0, 255, 0, 255]);
  assert.notDeepEqual(pixel(ctx, 114, 870), [0, 255, 0, 255]);
  drawArmyPass(ctx, { ...input, crop: { zoom: 3, x: 100, y: 50 } }, assets);
  assert.deepEqual(pixel(ctx, 450, 700), [255, 255, 0, 255]);
  assert.deepEqual(pixel(ctx, 277, 1033), [0, 255, 0, 255]);
  drawArmyPass(
    ctx,
    {
      ...input,
      personalPhoto: { url: "blob:test-only", crop: { zoom: 3, x: 0, y: 50 } },
    },
    assets,
  );
  assert.deepEqual(pixel(ctx, 450, 700), [255, 0, 0, 255]);
  assert.deepEqual(pixel(ctx, 277, 1033), [0, 0, 255, 255]);
});

test("MAP: limites máximos cabem nos slots, com todos os grafemas e sem sobreposição", () => {
  const base = context();
  const limits = {
    displayName: 30,
    city: 65,
    bias: 9,
    armySince: 4,
    favoriteSong: 80,
    experience: 20,
    message: 140,
  };
  for (const key of Object.keys(mapSlots) as (keyof typeof mapSlots)[]) {
    const slot = mapSlots[key];
    let drawn = "";
    const ctx = new Proxy(base, {
      get(target, prop) {
        if (prop === "fillText")
          return (value: string, x: number, y: number) => {
            drawn += value;
            const fontSize = Number.parseFloat(
              target.font.match(/([\d.]+)px/)![1],
            );
            assert.ok(
              x >= slot.x &&
                x + target.measureText(value).width <=
                  slot.x + slot.width + 0.01,
              key,
            );
            assert.ok(
              y >= slot.y && y + fontSize * 1.22 <= slot.y + slot.height + 0.01,
              key,
            );
          };
        const value = Reflect.get(target, prop);
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target, prop, value) {
        return Reflect.set(target, prop, value);
      },
    });
    const text = "W".repeat(limits[key]);
    drawFittedText(ctx, text, slot, {
      size: key === "displayName" ? 48 : 28,
      family: "Arial",
    });
    assert.equal(drawn, text);
    drawFittedText(ctx, "", slot, { size: 28, family: "Arial" });
    assert.equal(drawn, text);
  }
});

test("MAP: vazios não imprimem exemplos; dados e mensagem continuam texto real", () => {
  const base = context(),
    painted: string[] = [];
  const ctx = new Proxy(base, {
    get(target, prop) {
      if (prop === "fillText") return (value: string) => painted.push(value);
      const value = Reflect.get(target, prop);
      return typeof value === "function" ? value.bind(target) : value;
    },
    set(target, prop, value) {
      return Reflect.set(target, prop, value);
    },
  });
  drawArmyPass(
    ctx,
    { ...model, fields: { ...initialFields, displayName: "ARMY" } },
    split(1, 1, "black", "black"),
  );
  assert.ok(!painted.join(" ").includes("Fernando"));
  assert.ok(!painted.join(" ").includes("Dynamite"));
  assert.ok(!painted.join(" ").includes("Prefiro não informar"));
  assert.ok(!painted.join(" ").includes("Seu nome"));
  assert.ok(painted.join(" ").includes("Cada encontro"));
  painted.length = 0;
  drawArmyPass(
    ctx,
    { ...model, fields: { ...model.fields, message: "보라해 💜 São Paulo" } },
    split(1, 1, "black", "black"),
  );
  assert.ok(painted.join(" ").includes("보라해 💜 São Paulo"));
  assert.ok(!painted.join(" ").includes("Cada encontro"));
});

test("MAP: o 7 autêntico só aparece com autorização, mantém proporção e fica na área reservada", async () => {
  const original = eraThemes["map-of-the-soul"].logo;
  const image = await loadImage(
    Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="red"/></svg>',
    ),
  );
  const assets = {
    ...split(1, 1, "black", "black"),
    logo: {
      image: image as unknown as CanvasImageSource,
      width: 400,
      height: 200,
    },
  };
  const ctx = context();
  drawArmyPass(ctx, model, assets);
  assert.notDeepEqual(pixel(ctx, 767, 430), [255, 0, 0, 255]);
  const authorized: EraLogo = {
    ...original,
    status: "authorized",
    path: "/images/army-pass/logos/test-only-seven.png",
    credit: "Synthetic test",
    authorizationReference: "test-only",
    usageConditions: "Test only",
  };
  try {
    eraThemes["map-of-the-soul"].logo = authorized;
    drawArmyPass(ctx, model, assets);
    assert.deepEqual(pixel(ctx, 767, 430), [255, 0, 0, 255]);
    assert.notDeepEqual(
      pixel(ctx, 767, 280),
      [255, 0, 0, 255],
      "contain must retain the 2:1 aspect ratio",
    );
  } finally {
    eraThemes["map-of-the-soul"].logo = original;
  }
});
