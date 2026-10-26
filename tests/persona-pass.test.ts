import assert from "node:assert/strict";
import { test } from "node:test";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import {
  drawArmyPass,
  type PreparedImage,
} from "../src/features/army-pass/renderer";
import { drawFittedText } from "../src/features/army-pass/canvas-layout";
import {
  personaFrames,
  personaLayout,
} from "../src/features/army-pass/persona-renderer";
import { initialFields, defaultCrop } from "../src/features/army-pass/state";
import { eraThemes } from "../src/features/army-pass/themes";
import { eraIds, type PassModel } from "../src/features/army-pass/types";

const fields = {
  ...initialFields,
  displayName: "Ana ARMY",
  city: "São Paulo",
  state: "SP",
  armySince: "2018",
  favoriteSong: "Minha trilha sonora",
  experience: "Cinema",
  message: "Uma história de encontros.",
};
const model: PassModel = {
  era: "persona",
  fields,
  source: "artwork",
  artwork: 0,
  imageUrl: null,
  crop: defaultCrop,
};
const context = () =>
  createCanvas(1080, 1920).getContext(
    "2d",
  ) as unknown as CanvasRenderingContext2D;
function split(w: number, h: number, a: string, b: string): PreparedImage {
  const canvas = createCanvas(w, h),
    ctx = canvas.getContext("2d");
  ctx.fillStyle = a;
  ctx.fillRect(0, 0, w / 2, h);
  ctx.fillStyle = b;
  ctx.fillRect(w / 2, 0, w / 2, h);
  return { image: canvas as unknown as CanvasImageSource, width: w, height: h };
}
const pixel = (ctx: CanvasRenderingContext2D, x: number, y: number) => [
  ...ctx.getImageData(
    Math.round((x * 1080) / 941),
    Math.round((y * 1920) / 1672),
    1,
    1,
  ).data,
];

test("PERSONA integra a lista pública oficial, sem BE nem variantes", () => {
  assert.deepEqual(eraIds, ["wings", "map-of-the-soul", "persona", "arirang"]);
  assert.equal(eraThemes.persona.name, "MAP OF THE SOUL: PERSONA");
  assert.equal(personaFrames.personal.width, personaFrames.personal.height);
});

test("PERSONA mantém grupo e retrato independentes, cover e clips oblíquo/circular", () => {
  const ctx = context(),
    assets = {
      ...split(800, 400, "red", "yellow"),
      personal: split(400, 800, "blue", "lime"),
    };
  const input: PassModel = {
    ...model,
    source: "gallery",
    crop: { zoom: 3, x: 0, y: 50 },
    personalPhoto: { url: "blob:test-only", crop: { zoom: 3, x: 100, y: 50 } },
  };
  drawArmyPass(ctx, input, assets);
  assert.deepEqual(pixel(ctx, 450, 700), [255, 0, 0, 255]);
  assert.deepEqual(pixel(ctx, 290, 1036), [0, 255, 0, 255]);
  assert.notDeepEqual(
    pixel(ctx, 800, 490),
    [255, 0, 0, 255],
    "upper sloping edge clips the photo",
  );
  assert.notDeepEqual(
    pixel(ctx, 115, 861),
    [0, 255, 0, 255],
    "circle does not paint its square corners",
  );
  drawArmyPass(ctx, { ...input, crop: { zoom: 3, x: 100, y: 50 } }, assets);
  assert.deepEqual(pixel(ctx, 450, 700), [255, 255, 0, 255]);
  assert.deepEqual(pixel(ctx, 290, 1036), [0, 255, 0, 255]);
  drawArmyPass(
    ctx,
    {
      ...input,
      personalPhoto: { url: "blob:test-only", crop: { zoom: 3, x: 0, y: 50 } },
    },
    assets,
  );
  assert.deepEqual(pixel(ctx, 450, 700), [255, 0, 0, 255]);
  assert.deepEqual(pixel(ctx, 290, 1036), [0, 0, 255, 255]);
});

test("PERSONA fecha linhas opcionais vazias e mantém todos os campos máximos nos limites", () => {
  const full = personaLayout(fields),
    sparse = personaLayout(initialFields);
  assert.equal(full.slots.message.y, 1354);
  assert.ok(sparse.slots.message.y < full.slots.message.y);
  const limits = {
    displayName: 30,
    city: 65,
    bias: 9,
    armySince: 4,
    favoriteSong: 80,
    experience: 20,
    message: 140,
  };
  for (const layout of [full, sparse])
    for (const key of Object.keys(layout.slots) as (keyof typeof limits)[]) {
      const base = context(),
        slot = layout.slots[key];
      let content = "";
      const ctx = new Proxy(base, {
        get(target, prop) {
          if (prop === "fillText")
            return (value: string, x: number, y: number) => {
              content += value;
              const size = Number(target.font.match(/([\d.]+)px/)![1]);
              assert.ok(
                x >= slot.x &&
                  x + target.measureText(value).width <=
                    slot.x + slot.width + 0.01,
                key,
              );
              assert.ok(
                y >= slot.y && y + size * 1.22 <= slot.y + slot.height + 0.01,
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
      drawFittedText(ctx, "W".repeat(limits[key]), slot, {
        size: key === "displayName" ? 47 : 29,
        family: "Arial",
      });
      assert.equal(content.length, limits[key]);
    }
});

test("PERSONA não exporta exemplos, letras da referência ou campos opcionais vazios", () => {
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
  const content = painted.join(" ");
  assert.ok(content.includes("Entre encontros"));
  for (const unwanted of [
    "FERNANDO",
    "Boy With Luv",
    "The person",
    "Prefiro não informar",
    "ARMY DESDE",
    "MINHA TRILHA SONORA",
    "MEU ENCONTRO DOS SONHOS",
  ])
    assert.ok(!content.includes(unwanted), unwanted);
  painted.length = 0;
  drawArmyPass(
    ctx,
    {
      ...model,
      fields: {
        ...initialFields,
        displayName: "ARMY",
        message: "보라해 💜 Uma conexão especial.",
      },
    },
    split(1, 1, "black", "black"),
  );
  assert.ok(painted.join(" ").includes("보라해 💜"));
  assert.ok(!painted.join(" ").includes("Entre encontros"));
});

test("PERSONA só desenha a identidade autorizada na área reservada e sem distorção", async () => {
  const original = eraThemes.persona.logo,
    image = await loadImage(
      Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="red"/></svg>',
      ),
    );
  const ctx = context(),
    assets = {
      ...split(1, 1, "black", "black"),
      logo: {
        image: image as unknown as CanvasImageSource,
        width: 400,
        height: 200,
      },
    };
  drawArmyPass(ctx, model, assets);
  assert.notDeepEqual(pixel(ctx, 563, 372), [255, 0, 0, 255]);
  try {
    eraThemes.persona.logo = {
      ...original,
      status: "authorized",
      path: "/images/army-pass/logos/test-only-persona.png",
      credit: "Synthetic test",
      authorizationReference: "test-only",
      usageConditions: "Test only",
    };
    drawArmyPass(ctx, model, assets);
    assert.deepEqual(pixel(ctx, 563, 372), [255, 0, 0, 255]);
    assert.notDeepEqual(pixel(ctx, 563, 250), [255, 0, 0, 255]);
  } finally {
    eraThemes.persona.logo = original;
  }
});
