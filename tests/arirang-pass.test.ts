import assert from "node:assert/strict";
import { test } from "node:test";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import {
  drawArmyPass,
  type PreparedImage,
} from "../src/features/army-pass/renderer";
import { drawFittedText } from "../src/features/army-pass/canvas-layout";
import {
  arirangFrames,
  arirangLayout,
  arirangQuote,
} from "../src/features/army-pass/arirang-renderer";
import { arirangBtsLogo, eraThemes } from "../src/features/army-pass/themes";
import { initialFields, defaultCrop } from "../src/features/army-pass/state";
import type { PassModel } from "../src/features/army-pass/types";

const fields = {
  ...initialFields,
  displayName: "Ana ARMY",
  city: "São Paulo",
  state: "SP",
  armySince: "2018",
  favoriteSong: "Minha trilha",
  experience: "Cinema",
  message: "Minha história especial.",
};
const model: PassModel = {
  era: "arirang",
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
  const image = createCanvas(w, h),
    ctx = image.getContext("2d");
  ctx.fillStyle = a;
  ctx.fillRect(0, 0, w / 2, h);
  ctx.fillStyle = b;
  ctx.fillRect(w / 2, 0, w / 2, h);
  return { image: image as unknown as CanvasImageSource, width: w, height: h };
}
const pixel = (ctx: CanvasRenderingContext2D, x: number, y: number) => [
  ...ctx.getImageData(
    Math.round((x * 1080) / 900),
    Math.round((y * 1920) / 1600),
    1,
    1,
  ).data,
];

test("ARIRANG mantém duas fotografias independentes, cover e retrato circular", () => {
  assert.equal(arirangFrames.personal.width, arirangFrames.personal.height);
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
  assert.deepEqual(pixel(ctx, 235, 1007), [0, 255, 0, 255]);
  assert.notDeepEqual(pixel(ctx, 81, 853), [0, 255, 0, 255]);
  drawArmyPass(ctx, { ...input, crop: { zoom: 3, x: 100, y: 50 } }, assets);
  assert.deepEqual(pixel(ctx, 450, 700), [255, 255, 0, 255]);
  assert.deepEqual(pixel(ctx, 235, 1007), [0, 255, 0, 255]);
  drawArmyPass(
    ctx,
    {
      ...input,
      personalPhoto: { url: "blob:test-only", crop: { zoom: 3, x: 0, y: 50 } },
    },
    assets,
  );
  assert.deepEqual(pixel(ctx, 450, 700), [255, 0, 0, 255]);
  assert.deepEqual(pixel(ctx, 235, 1007), [0, 0, 255, 255]);
});

test("ARIRANG cabe nos slots com textos máximos e preserva espaço separado para a frase", () => {
  const limits = {
    displayName: 30,
    city: 65,
    bias: 9,
    armySince: 4,
    favoriteSong: 80,
    experience: 20,
    message: 140,
  };
  for (const input of [
    fields,
    { ...initialFields, message: "W".repeat(140) },
  ]) {
    const layout = arirangLayout(input),
      s = layout.slots;
    assert.ok(s.message.y + s.message.height <= 1472);
    assert.ok(s.message.x > layout.quote.x + layout.quote.width);
    assert.ok(layout.quote.y + layout.quote.height <= 1530);
    for (const key of Object.keys(limits) as (keyof typeof limits)[]) {
      const base = context(),
        slot = s[key];
      let count = 0;
      const ctx = new Proxy(base, {
        get(target, prop) {
          if (prop === "fillText")
            return (value: string, x: number, y: number) => {
              count += value.length;
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
        size: key === "displayName" ? 43 : 27,
        family: "Arial",
      });
      assert.equal(count, limits[key]);
    }
  }
});

test("ARIRANG oculta opcionais vazios e mantém a frase autoral mesmo com mensagem pessoal", () => {
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
  const asset = split(1, 1, "black", "black");
  drawArmyPass(
    ctx,
    { ...model, fields: { ...initialFields, displayName: "ARMY" } },
    asset,
  );
  const joined = painted.join(" ");
  for (const unwanted of [
    "FERNANDO",
    "SWIM",
    "Meu encontro com o BTS",
    "Prefiro não informar",
    "Seu nome aqui",
  ])
    assert.ok(!joined.includes(unwanted));
  assert.ok(joined.includes(arirangQuote));
  // Labels are tracked character-by-character; verify no empty optional values.
  assert.ok(!painted.includes("2018"));
  painted.length = 0;
  drawArmyPass(
    ctx,
    { ...model, fields: { ...fields, message: "보라해 💜 Meu caminho." } },
    asset,
  );
  assert.ok(painted.join(" ").includes("보라해 💜 Meu caminho."));
  assert.ok(painted.join(" ").includes(arirangQuote));
});

test("ARIRANG não desenha os três símbolos nem wordmark substituto sem asset autorizado", () => {
  const ctx = context(),
    asset = split(1, 1, "black", "black");
  drawArmyPass(ctx, model, asset);
  const empty = pixel(ctx, 340, 180);
  const original = eraThemes.arirang.logo;
  try {
    eraThemes.arirang.logo = { ...original, status: "pending-authorization" };
    drawArmyPass(ctx, model, { ...asset, logo: split(400, 200, "red", "red") });
  } finally {
    eraThemes.arirang.logo = original;
  }
  assert.deepEqual(
    pixel(ctx, 340, 180),
    empty,
    "an unauthorized prepared image must be ignored",
  );
});

test("ARIRANG integra exclusivamente o asset autorizado e preserva sua proporção", async () => {
  const original = eraThemes.arirang.logo,
    image = await loadImage(
      Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" width="739" height="415"><rect width="739" height="415" fill="red"/></svg>',
      ),
    );
  const ctx = context(),
    asset = {
      ...split(1, 1, "black", "black"),
      logo: {
        image: image as unknown as CanvasImageSource,
        width: 739,
        height: 415,
      },
    };
  try {
    eraThemes.arirang.logo = {
      ...original,
      status: "authorized",
      path: "/images/army-pass/logos/test-only-arirang.png",
      credit: "Synthetic test",
      authorizationReference: "test-only",
      usageConditions: "Test only",
    };
    drawArmyPass(ctx, model, asset);
    assert.deepEqual(pixel(ctx, 340, 190), [255, 0, 0, 255]);
    assert.notDeepEqual(pixel(ctx, 340, 0), [255, 0, 0, 255]);
  } finally {
    eraThemes.arirang.logo = original;
  }
});

test("ARIRANG claro compacta somente campos opcionais e mantém os cartões acima do rodapé", () => {
  const full = arirangLayout(fields);
  const empty = arirangLayout({ ...initialFields, displayName: "Ana" });
  assert.deepEqual(
    full.cards.filter((card) => card.visible).map((card) => card.key),
    [
      "displayName",
      "city",
      "bias",
      "armySince",
      "favoriteSong",
      "experience",
      "message",
    ],
  );
  assert.deepEqual(
    empty.cards.filter((card) => card.visible).map((card) => card.key),
    ["displayName", "bias"],
  );
  assert.ok(empty.slots.bias.y < full.slots.bias.y);
  for (const layout of [full, empty]) {
    const visible = layout.cards.filter((card) => card.visible);
    for (let i = 0; i < visible.length; i++) {
      assert.ok(visible[i].y + visible[i].height < 1493);
      if (i) assert.ok(visible[i].y > visible[i - 1].y + visible[i - 1].height);
    }
  }
});

test("ARIRANG usa os dois arquivos locais e altera pixels somente nas duas áreas dos logos", async () => {
  const album = await loadImage(
    "public/images/army-pass/logos/arirang-logo-novo.jpeg",
  );
  const bts = await loadImage("public/images/army-pass/logos/bts-logo.png");
  assert.equal(eraThemes.arirang.logo.status, "authorized");
  assert.equal(arirangBtsLogo.status, "authorized");
  const asset = split(1, 1, "black", "black");
  const before = context(),
    after = context();
  drawArmyPass(before, model, asset);
  drawArmyPass(after, model, {
    ...asset,
    logo: {
      image: album as unknown as CanvasImageSource,
      width: album.width,
      height: album.height,
    },
    btsLogo: {
      image: bts as unknown as CanvasImageSource,
      width: bts.width,
      height: bts.height,
    },
  });
  const a = before.getImageData(0, 0, 1080, 1920).data,
    b = after.getImageData(0, 0, 1080, 1920).data;
  let albumPixels = 0,
    btsPixels = 0;
  for (let y = 0; y < 1920; y++)
    for (let x = 0; x < 1080; x++) {
      const i = (y * 1080 + x) * 4;
      if (
        a[i] === b[i] &&
        a[i + 1] === b[i + 1] &&
        a[i + 2] === b[i + 2] &&
        a[i + 3] === b[i + 3]
      )
        continue;
      if (x >= 220 && x <= 851 && y >= 23 && y <= 355) albumPixels++;
      else if (x >= 955 && x <= 1005 && y >= 73 && y <= 175) btsPixels++;
      else
        assert.fail(`Unexpected changed pixel outside logo areas: ${x}, ${y}`);
    }
  assert.ok(albumPixels > 20000);
  assert.ok(btsPixels > 1000);
  assert.equal(album.width, 739);
  assert.equal(album.height, 415);
  const logoCanvas = createCanvas(1080, 1920),
    logoCtx = logoCanvas.getContext("2d");
  drawArmyPass(logoCtx as unknown as CanvasRenderingContext2D, model, {
    ...asset,
    logo: {
      image: album as unknown as CanvasImageSource,
      width: album.width,
      height: album.height,
    },
  });
  const wordmark = logoCtx.getImageData(300, 260, 480, 90).data;
  let redWordmarkPixels = 0;
  for (let i = 0; i < wordmark.length; i += 4)
    if (wordmark[i] > 170 && wordmark[i + 1] < 100 && wordmark[i + 2] < 120)
      redWordmarkPixels++;
  assert.ok(redWordmarkPixels > 10000, "ARIRANG wordmark should be visible");
  const btsCanvas = createCanvas(bts.width, bts.height),
    btsContext = btsCanvas.getContext("2d");
  btsContext.drawImage(bts, 0, 0);
  assert.equal(
    btsContext.getImageData(0, 0, 1, 1).data[3],
    0,
    "BTS logo background must remain transparent",
  );
});
