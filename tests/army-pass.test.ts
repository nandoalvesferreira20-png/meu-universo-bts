import assert from "node:assert/strict";
import { test, after } from "node:test";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import {
  createCanvas,
  loadImage as nativeLoadImage,
  GlobalFonts,
  type Canvas,
} from "@napi-rs/canvas";
import { armyPassSchema } from "../src/lib/validation";
import { artworkSvg } from "../src/features/army-pass/artwork";
import {
  containRectangle,
  cropRectangle,
  detectPhotoType,
  MAX_PHOTO_BYTES,
  processPersonalPhoto,
  validatePhotoHeader,
} from "../src/features/army-pass/image-processing";
import {
  createInitialBuilderState,
  builderReducer,
  defaultCrop,
  initialBuilderState,
  initialFields,
} from "../src/features/army-pass/state";
import { PhotoSession } from "../src/features/army-pass/photo-session";
import {
  drawWingsValue,
  wingsSlots,
} from "../src/features/army-pass/wings-renderer";
import {
  MAX_GALLERY_PHOTOS_PER_ERA,
  eraPhotoManifest,
  initialCropForPhoto,
  photosForEra,
} from "../src/features/army-pass/themes";
import {
  detailRows,
  drawArmyPass,
  imageFrames,
  PASS_HEIGHT,
  PASS_WIDTH,
  wrapText,
} from "../src/features/army-pass/renderer";
import {
  canSharePass,
  downloadPass,
  exportArmyPass,
} from "../src/features/army-pass/export";
import {
  eraIds,
  type AuthorizedEraPhoto,
  type EraId,
  type PassModel,
} from "../src/features/army-pass/types";

// O renderizador de teste não recebe automaticamente todas as fontes do sistema.
for (const [path, name] of [
  ["C:/Windows/Fonts/seguiemj.ttf", "Segoe UI Emoji"],
  ["C:/Windows/Fonts/malgun.ttf", "Malgun Gothic"],
]) {
  if (existsSync(path)) GlobalFonts.registerFromPath(path, name);
}

const fields = {
  ...initialFields,
  displayName: "Ana 💜",
  city: "São Paulo",
  state: "SP",
  armySince: "2018",
  bias: "OT7",
  favoriteSong: "Uma música especial",
  experience: "Cinema",
  message: "Uma conexão que atravessa distâncias. 보라해 💜",
};
const model: PassModel = {
  era: "wings",
  fields,
  source: "artwork",
  artwork: 0,
  imageUrl: null,
  crop: defaultCrop,
};
const fixtureSvg = (era: EraId, variant: 0 | 1 | 2) =>
  era === "persona" || era === "arirang"
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="740"></svg>'
    : artworkSvg(era, variant);
const toContext = (canvas: Canvas) =>
  canvas.getContext("2d") as unknown as CanvasRenderingContext2D;

test("WINGS mantém duas fotografias independentes, recortes cover e retrato circular", () => {
  const group = createCanvas(800, 400);
  const gc = group.getContext("2d");
  gc.fillStyle = "#ff0000";
  gc.fillRect(0, 0, 400, 400);
  gc.fillStyle = "#ffff00";
  gc.fillRect(400, 0, 400, 400);
  const portrait = createCanvas(400, 800);
  const pc = portrait.getContext("2d");
  pc.fillStyle = "#0000ff";
  pc.fillRect(0, 0, 200, 800);
  pc.fillStyle = "#00ff00";
  pc.fillRect(200, 0, 200, 800);
  const assets = {
    image: group as unknown as CanvasImageSource,
    width: 800,
    height: 400,
    personal: {
      image: portrait as unknown as CanvasImageSource,
      width: 400,
      height: 800,
    },
  };
  const canvas = createCanvas(1080, 1920),
    ctx = toContext(canvas);
  const input: PassModel = {
    ...model,
    source: "gallery",
    crop: { zoom: 3, x: 0, y: 50 },
    personalPhoto: { url: "blob:test-only", crop: { zoom: 3, x: 0, y: 50 } },
  };
  const pixel = (x: number, y: number) => [
    ...ctx.getImageData(
      Math.round((x * 1080) / 941),
      Math.round((y * 1920) / 1672),
      1,
      1,
    ).data,
  ];
  drawArmyPass(ctx, input, assets);
  assert.deepEqual(pixel(470, 700), [255, 0, 0, 255]);
  assert.deepEqual(pixel(211, 1111), [0, 0, 255, 255]);
  assert.notDeepEqual(
    pixel(78, 978),
    [0, 0, 255, 255],
    "portrait must not paint the square corners",
  );
  drawArmyPass(
    ctx,
    {
      ...input,
      personalPhoto: {
        ...input.personalPhoto!,
        crop: { zoom: 3, x: 100, y: 50 },
      },
    },
    assets,
  );
  assert.deepEqual(pixel(211, 1111), [0, 255, 0, 255]);
  assert.deepEqual(
    pixel(470, 700),
    [255, 0, 0, 255],
    "portrait crop cannot change group photo",
  );
  drawArmyPass(ctx, { ...input, crop: { zoom: 3, x: 100, y: 50 } }, assets);
  assert.deepEqual(pixel(470, 700), [255, 255, 0, 255]);
  assert.deepEqual(
    pixel(211, 1111),
    [0, 0, 255, 255],
    "group crop cannot change portrait",
  );
});

test("WINGS mede cada campo máximo dentro de seu slot, sem truncar ou desenhar placeholders", () => {
  const canvas = createCanvas(1080, 1920),
    base = toContext(canvas);
  const limits = {
    displayName: 30,
    city: 65,
    bias: 9,
    armySince: 4,
    favoriteSong: 80,
    experience: 20,
    message: 140,
  };
  for (const key of Object.keys(wingsSlots) as (keyof typeof wingsSlots)[]) {
    const slot = wingsSlots[key];
    let count = 0;
    const ctx = new Proxy(base, {
      get(target, prop) {
        if (prop === "fillText")
          return (text: string, x: number, y: number) => {
            count += text.length;
            assert.ok(
              x >= slot.x &&
                x + target.measureText(text).width <=
                  slot.x + slot.width + 0.01,
              key,
            );
            const size = Number.parseFloat(target.font);
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
    drawWingsValue(ctx, "W".repeat(limits[key]), slot);
    assert.equal(count, limits[key]);
    drawWingsValue(ctx, "", slot);
    assert.equal(count, limits[key]);
  }
});

test("recorte pessoal permanece disponível e independente da foto do grupo", () => {
  const photo = { url: "blob:local", width: 400, height: 800 };
  let state = builderReducer(initialBuilderState, { type: "photo", photo });
  state = builderReducer(state, {
    type: "personal-crop",
    crop: { zoom: 2, x: 0, y: 70 },
  });
  assert.equal(state.personalCrop.zoom, 2);
  assert.equal(state.galleryId, "wings-01");
  state = builderReducer(state, { type: "gallery", id: "wings-02" });
  assert.equal(state.personalCrop.zoom, 2);
  assert.equal(state.galleryId, "wings-02");
  assert.equal(state.photo, photo);
});

test("Zod aceita limites e caracteres especiais e rejeita nome vazio, campos longos e opções inválidas", () => {
  assert.equal(armyPassSchema.safeParse(fields).success, true);
  for (const bad of [
    { displayName: "  " },
    { displayName: "A".repeat(31) },
    { city: "c".repeat(61) },
    { favoriteSong: "s".repeat(81) },
    { message: "m".repeat(141) },
    { bias: "Outro" },
    { state: "XX" },
    { experience: "Tour VIP" },
    { armySince: "2012" },
    { armySince: String(new Date().getFullYear() + 1) },
    { armySince: "20aa" },
  ]) {
    assert.equal(
      armyPassSchema.safeParse({ ...fields, ...bad }).success,
      false,
      JSON.stringify(bad),
    );
  }
  assert.equal(
    armyPassSchema.safeParse({
      ...initialFields,
      displayName: "ARMY",
      message: "m".repeat(140),
      favoriteSong: "s".repeat(80),
      city: "c".repeat(60),
    }).success,
    true,
  );
});

test("etapas e quatro eras preservam dados e retrato; troca de era limpa somente a galeria", () => {
  const photo = { url: "blob:local-photo", width: 800, height: 1200 };
  let state = builderReducer(initialBuilderState, { type: "fields", fields });
  state = builderReducer(state, { type: "photo", photo });
  state = builderReducer(state, {
    type: "personal-crop",
    crop: { zoom: 2, x: 25, y: 70 },
  });
  for (const era of eraIds) {
    state = builderReducer(state, { type: "era", era });
    for (const step of [2, 3, 4, 2, 1])
      state = builderReducer(state, { type: "step", step });
    assert.deepEqual(state.fields, fields);
    assert.equal(state.photo, photo);
    assert.equal(state.personalCrop.zoom, 2);
  }
  state = builderReducer(
    { ...state, galleryId: "old-photo" },
    { type: "era", era: "be" },
  );
  assert.equal(state.galleryId, null);
  assert.equal(state.photo, photo);
  state = builderReducer(state, { type: "photo", photo: null });
  assert.equal(state.photo, null);
  assert.deepEqual(state.personalCrop, defaultCrop);
});

const galleryFixture = (
  era: EraId,
  index: number,
  overrides: Partial<AuthorizedEraPhoto> = {},
): AuthorizedEraPhoto => ({
  id: `${era}-${index + 1}`,
  era,
  path: `/images/army-pass/gallery/${galleryDirectory(era)}/${era}-${index + 1}.jpg`,
  description: `Foto de teste ${index + 1} da era ${era}`,
  credit: "Crédito de teste",
  source: "Fixture sintética de teste",
  authorization: { status: "authorized", reference: "permission-test" },
  fitMode: "cover",
  objectPositionX: 40 + index,
  objectPositionY: 60 - index,
  initialScale: 1 + index / 10,
  ...overrides,
});
const galleryDirectory = (era: EraId) =>
  era === "map-of-the-soul" ? "map-of-the-soul-7" : era;

test("manifesto lista as três fotos locais autorizadas de cada era", () => {
  assert.equal(photosForEra("wings").length, 3);
  assert.equal(photosForEra("map-of-the-soul").length, 3);
  assert.equal(photosForEra("persona").length, 3);
  assert.equal(photosForEra("arirang").length, 3);
  assert.ok(
    eraPhotoManifest.every((photo) => existsSync(`public${photo.path}`)),
    "Every published gallery path must exist in public/",
  );
  assert.deepEqual(
    photosForEra("wings").map((photo) => photo.id),
    ["wings-01", "wings-02", "wings-03"],
  );
  assert.deepEqual(
    photosForEra("map-of-the-soul").map((photo) => photo.id),
    ["mots7-white-swan", "mots7-black-swan", "mots7-banquet"],
  );
  assert.deepEqual(
    photosForEra("persona").map((photo) => photo.id),
    ["persona-pink-room", "persona-pastel-hearts", "persona-colorful-concept"],
  );
  assert.deepEqual(
    photosForEra("arirang").map((photo) => photo.id),
    ["arirang-dark-group", "arirang-red-group", "arirang-boat"],
  );
  assert.ok(
    photosForEra("map-of-the-soul").every(
      (photo) => photo.fitMode === "contain" && photo.initialScale === 1,
    ),
  );
  assert.ok(
    photosForEra("persona").every(
      (photo) =>
        photo.fitMode === "contain" &&
        photo.objectPositionX === 50 &&
        photo.objectPositionY === 50 &&
        photo.initialScale === 1,
    ),
  );
  assert.ok(
    photosForEra("arirang").every(
      (photo) =>
        photo.fitMode === "contain" &&
        photo.objectPositionX === 50 &&
        photo.objectPositionY === 50 &&
        photo.initialScale === 1,
    ),
  );
  const photo = galleryFixture("wings", 0);
  assert.deepEqual(photosForEra("wings", [photo]), [photo]);
  for (const path of [
    "https://example.com/photo.jpg",
    "/images/army-pass/gallery/be/photo.jpg",
    "/images/army-pass/gallery/wings/../photo.png",
    "/images/army-pass/gallery/wings/image.svg",
    "/images/army-pass/gallery/wings/%2e/photo.png",
  ])
    assert.equal(photosForEra("wings", [{ ...photo, path }]).length, 0);
  assert.equal(photosForEra("wings", [{ ...photo, credit: "" }]).length, 0);
  assert.equal(photosForEra("wings", [{ ...photo, source: "" }]).length, 0);
  assert.equal(
    photosForEra("wings", [{ ...photo, description: "" }]).length,
    0,
  );
  assert.equal(
    photosForEra("wings", [
      {
        ...photo,
        authorization: { status: "authorized", reference: "" },
      },
    ]).length,
    0,
  );
});

test("MAP OF THE SOUL: PERSONA usa os três arquivos reais na ordem dos conceitos", () => {
  const photos = photosForEra("persona");
  assert.deepEqual(
    photos.map((photo) => ({
      path: photo.path,
      description: photo.description,
    })),
    [
      {
        path: "/images/army-pass/gallery/persona/persona-01.jpg",
        description:
          "BTS reunido em um ambiente rosa e coral para o conceito Pink Room de MAP OF THE SOUL: PERSONA.",
      },
      {
        path: "/images/army-pass/gallery/persona/persona-02.jpg",
        description:
          "BTS em figurinos claros formando corações no conceito Pastel Hearts de MAP OF THE SOUL: PERSONA.",
      },
      {
        path: "/images/army-pass/gallery/persona/persona-03.jpg",
        description:
          "BTS em figurinos coloridos para o conceito Colorful Concept de MAP OF THE SOUL: PERSONA.",
      },
    ],
  );
  assert.ok(photos.every((photo) => existsSync(`public${photo.path}`)));
  for (const [width, height] of [
    [1400, 933],
    [1200, 800],
    [995, 638],
  ]) {
    const frame = containRectangle(width, height, 780, 404, defaultCrop);
    assert.ok(Math.abs(frame.width / frame.height - width / height) < 0.001);
    assert.ok(frame.width < 780);
    assert.ok(frame.x > 0);
  }
});

test("MAP OF THE SOUL: 7 usa as fotos locais corretas com contain e posição central", () => {
  const photos = photosForEra("map-of-the-soul");
  assert.deepEqual(
    photos.map(({ path, objectPositionX, objectPositionY }) => ({
      path,
      objectPositionX,
      objectPositionY,
    })),
    [
      {
        path: "/images/army-pass/gallery/map-of-the-soul-7/mots7-01.jpg",
        objectPositionX: 50,
        objectPositionY: 50,
      },
      {
        path: "/images/army-pass/gallery/map-of-the-soul-7/mots7-02.jpg",
        objectPositionX: 50,
        objectPositionY: 50,
      },
      {
        path: "/images/army-pass/gallery/map-of-the-soul-7/mots7-03.jpg",
        objectPositionX: 50,
        objectPositionY: 50,
      },
    ],
  );
  const frame = containRectangle(2000, 1271, 752, 360, defaultCrop);
  assert.ok(Math.abs(frame.width / frame.height - 2000 / 1271) < 0.001);
  assert.ok(frame.width < 752);
  assert.ok(frame.x > 0);
  for (const [width, height] of [
    [1080, 720],
    [1200, 800],
  ]) {
    const box = containRectangle(width, height, 752, 360, defaultCrop);
    assert.ok(Math.abs(box.width / box.height - width / height) < 0.001);
    assert.ok(box.width < 752);
    assert.ok(box.x > 0);
  }
});

test("galeria lista no máximo três fotos por era e nunca mistura caminhos", () => {
  const manifest = eraIds.flatMap((era) =>
    Array.from({ length: 4 }, (_, index) => galleryFixture(era, index)),
  );
  for (const era of eraIds) {
    const photos = photosForEra(era, manifest);
    assert.equal(photos.length, MAX_GALLERY_PHOTOS_PER_ERA);
    assert.ok(photos.every((photo) => photo.era === era));
    assert.ok(
      photos.every((photo) =>
        photo.path.includes(
          `/gallery/${era === "map-of-the-soul" ? "map-of-the-soul-7" : era}/`,
        ),
      ),
    );
  }
});

test("enquadramentos WINGS mantêm proporção e preservam a composição inicial", () => {
  const [first, second, third] = photosForEra("wings");
  assert.equal(first.fitMode, "contain");
  assert.equal(second.fitMode, "contain");
  assert.equal(third.fitMode, "cover");
  assert.deepEqual(initialCropForPhoto(first), {
    zoom: 1,
    x: 50,
    y: 50,
  });
  assert.deepEqual(initialCropForPhoto(third), {
    zoom: 1,
    x: 50,
    y: 78,
  });

  for (const [width, height] of [
    [900, 889],
    [1200, 1186],
  ]) {
    const frame = containRectangle(width, height, 821, 383, defaultCrop);
    assert.ok(Math.abs(frame.width / frame.height - width / height) < 0.001);
    assert.ok(frame.width < 821);
    assert.equal(frame.height, 383);
    assert.ok(frame.x > 0);
  }

  const cover = cropRectangle(2568, 1806, 821, 383, initialCropForPhoto(third));
  assert.ok(cover.sy > 400);
  assert.ok(cover.sy + cover.sh > 1650);
});

test("seleção e troca de era preservam preferência e foto pessoal", () => {
  const manifest = [
    galleryFixture("wings", 0),
    galleryFixture("wings", 1),
    galleryFixture("map-of-the-soul", 0, { id: "mots7-white-swan" }),
    galleryFixture("map-of-the-soul", 1, { id: "mots7-black-swan" }),
    galleryFixture("persona", 0),
    galleryFixture("arirang", 0),
  ];
  let state = createInitialBuilderState(manifest);
  assert.equal(state.galleryId, "wings-1");
  state = builderReducer(state, { type: "fields", fields }, manifest);
  const portrait = { url: "blob:private-photo", width: 800, height: 1200 };
  state = builderReducer(state, { type: "photo", photo: portrait }, manifest);
  state = builderReducer(state, { type: "gallery", id: "wings-2" }, manifest);
  assert.equal(state.galleryId, "wings-2");
  state = builderReducer(
    state,
    { type: "era", era: "map-of-the-soul" },
    manifest,
  );
  assert.equal(state.galleryId, "mots7-white-swan");
  state = builderReducer(
    state,
    { type: "gallery", id: "mots7-black-swan" },
    manifest,
  );
  state = builderReducer(state, { type: "era", era: "wings" }, manifest);
  assert.equal(state.galleryId, "wings-2");
  state = builderReducer(
    state,
    { type: "era", era: "map-of-the-soul" },
    manifest,
  );
  assert.equal(state.galleryId, "mots7-black-swan");
  assert.deepEqual(state.fields, fields);
  assert.equal(state.photo, portrait);
  assert.equal(
    builderReducer(state, { type: "gallery", id: "persona-1" }, manifest)
      .galleryId,
    "mots7-black-swan",
  );
});

test("assinatura real do arquivo e limite de 10 MB são verificados sem confiar na extensão", () => {
  const jpeg = new Uint8Array([255, 216, 255, 224]);
  const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const webp = new TextEncoder().encode("RIFFxxxxWEBP");
  assert.equal(detectPhotoType(jpeg), "image/jpeg");
  assert.equal(detectPhotoType(png), "image/png");
  assert.equal(detectPhotoType(webp), "image/webp");
  assert.equal(validatePhotoHeader(MAX_PHOTO_BYTES, jpeg), "image/jpeg");
  assert.throws(() => validatePhotoHeader(MAX_PHOTO_BYTES + 1, jpeg), /10 MB/);
  assert.throws(
    () => validatePhotoHeader(100, new TextEncoder().encode("<svg>")),
    /Formato inválido/,
  );
  assert.throws(() => validatePhotoHeader(0, png), /vazio/);
});

test("recorte nunca distorce nem ultrapassa limites em fotos verticais, horizontais ou quadradas", () => {
  for (const frame of Object.values(imageFrames))
    for (const [w, h] of [
      [3000, 2000],
      [2000, 3000],
      [1080, 1080],
    ])
      for (const zoom of [1, 1.5, 3])
        for (const pos of [0, 50, 100]) {
          const rect = cropRectangle(w, h, frame.width, frame.height, {
            zoom,
            x: pos,
            y: 100 - pos,
          });
          assert.ok(
            rect.sx >= -1e-9 &&
              rect.sy >= -1e-9 &&
              rect.sx + rect.sw <= w + 1e-9 &&
              rect.sy + rect.sh <= h + 1e-9,
          );
          assert.ok(
            Math.abs(rect.sw / rect.sh - frame.width / frame.height) < 1e-9,
          );
        }
  assert.throws(() => cropRectangle(0, 100, 20, 20, defaultCrop), /Dimensões/);
});

test("quebra de texto preserva palavras longas, emojis e acentos sem sair da largura", () => {
  const ctx = toContext(createCanvas(1080, 1920));
  ctx.font = "32px Arial";
  const text = "W".repeat(80) + " 💜 São Paulo 보라해 👩‍👩‍👧‍👧";
  const lines = wrapText(ctx, text, 400);
  assert.equal(lines.join("").replace(/\s/g, ""), text.replace(/\s/g, ""));
  assert.ok(lines.every((line) => ctx.measureText(line).width <= 400));
  assert.deepEqual(detailRows({ ...initialFields, displayName: "A" }), [
    { label: "BIAS", value: "OT7" },
  ]);
});

test("quatro templates são distintos; textos máximos ficam antes do rodapé", async () => {
  await mkdir("test-artifacts", { recursive: true });
  const outputs = new Set<string>();
  for (const era of eraIds) {
    for (const variant of [0] as const) {
      const image = await nativeLoadImage(
        Buffer.from(fixtureSvg(era, variant)),
      );
      assert.equal(image.width, 720);
      assert.equal(image.height, 740);
      const canvas = createCanvas(PASS_WIDTH, PASS_HEIGHT);
      const base = toContext(canvas);
      const textPositions: { text: string; y: number; bottom: number }[] = [];
      const ctx = new Proxy(base, {
        get(target, key) {
          if (key === "fillText")
            return (text: string, x: number, y: number) => {
              const metrics = target.measureText(text);
              if (
                (era === "wings"
                  ? y >= 963 && y < 1490
                  : era === "map-of-the-soul" ||
                      era === "persona" ||
                      era === "arirang"
                    ? y >= (era === "arirang" ? 844 : 914) && y < 1534
                    : y >= 1075) &&
                !text.includes("EDIÇÃO DE FÃ") &&
                !text.startsWith("EM COLABORAÇÃO")
              ) {
                assert.ok(
                  x + metrics.width <= 1005,
                  `${era}: texto fora da largura: ${text}`,
                );
                textPositions.push({
                  text,
                  y,
                  bottom: y + metrics.actualBoundingBoxDescent,
                });
              }
              target.fillText(text, x, y);
            };
          const value = Reflect.get(target, key);
          return typeof value === "function" ? value.bind(target) : value;
        },
        set(target, key, value) {
          return Reflect.set(target, key, value);
        },
      });
      const longFields = {
        ...fields,
        displayName: "W".repeat(30),
        city: "W".repeat(60),
        favoriteSong: "W".repeat(80),
        message: "W".repeat(140),
        experience: "Acompanhando de casa",
      };
      const texture =
        era === "wings" ||
        era === "map-of-the-soul" ||
        era === "persona" ||
        era === "arirang"
          ? {
              image: (await nativeLoadImage(
                era === "wings"
                  ? "public/images/army-pass/textures/wings-smoke.png"
                  : era === "persona"
                    ? "public/images/army-pass/textures/persona-atmosphere.png"
                    : era === "arirang"
                      ? "public/images/army-pass/textures/arirang-light-paper.png"
                      : "public/images/army-pass/textures/map-atmosphere.png",
              )) as unknown as CanvasImageSource,
              width: 941,
              height: 1672,
            }
          : undefined;
      drawArmyPass(
        ctx,
        { ...model, era, artwork: variant, fields: longFields },
        {
          texture,
          image: image as unknown as CanvasImageSource,
          width: image.width,
          height: image.height,
        },
      );
      assert.ok(
        textPositions.every((item) => item.bottom < 1778),
        `${era}: texto sobrepõe rodapé`,
      );
      // Sem truncamento dos campos mesmo no limite.
      assert.equal(
        textPositions
          .filter((item) => item.text.length > 1 && item.text.includes("W"))
          .map((item) => item.text)
          .join("")
          .split("W").length - 1,
        310,
      );
      const png = canvas.toBuffer("image/png");
      outputs.add(png.toString("base64"));
      if (variant === 0) {
        drawArmyPass(
          base,
          { ...model, era },
          {
            texture,
            image: image as unknown as CanvasImageSource,
            width: image.width,
            height: image.height,
          },
        );
        await writeFile(
          `test-artifacts/army-pass-${era}.png`,
          canvas.toBuffer("image/png"),
        );
      }
    }
  }
  assert.equal(outputs.size, 4);
});

test("mensagens com muitas quebras de linha são redistribuídas e não ultrapassam a área de texto", async () => {
  for (const era of eraIds) {
    const image = await nativeLoadImage(Buffer.from(fixtureSvg(era, 0)));
    const base = toContext(createCanvas(PASS_WIDTH, PASS_HEIGHT));
    let visibleLetters = 0;
    const ctx = new Proxy(base, {
      get(target, key) {
        if (key === "fillText")
          return (text: string, x: number, y: number) => {
            if (/^[w\s]+$/.test(text)) {
              visibleLetters += text.replace(/\s/g, "").length;
              assert.ok(
                y + target.measureText(text).actualBoundingBoxDescent < 1745,
              );
            }
            target.fillText(text, x, y);
          };
        const value = Reflect.get(target, key);
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target, key, value) {
        return Reflect.set(target, key, value);
      },
    });
    drawArmyPass(
      ctx,
      {
        ...model,
        era,
        fields: {
          ...fields,
          displayName: "W".repeat(30),
          city: "W".repeat(60),
          favoriteSong: "W".repeat(80),
          message: "w\n".repeat(70),
          experience: "Acompanhando de casa",
        },
      },
      { image: image as unknown as CanvasImageSource, width: 720, height: 740 },
    );
    assert.equal(visibleLetters, 70);
  }
});

test("URLs são liberadas na troca, remoção e saída; processamento atrasado nunca recupera uma foto removida", () => {
  const revoked: string[] = [];
  const session = new PhotoSession((url) => revoked.push(url));
  const photo = (url: string) => ({ url, width: 100, height: 100 });
  const first = session.begin();
  assert.equal(session.accept(first, photo("blob:first")), true);
  const older = session.begin();
  const latest = session.begin();
  assert.equal(session.accept(older, photo("blob:stale")), false);
  assert.equal(session.accept(latest, photo("blob:latest")), true);
  session.clear();
  session.clear();
  assert.equal(session.accept(latest, photo("blob:late-after-unmount")), false);
  assert.deepEqual(revoked, [
    "blob:stale",
    "blob:first",
    "blob:latest",
    "blob:late-after-unmount",
  ]);
});

// Adaptador de APIs de navegador para exercitar a exportação real usando Canvas
// nativo. Não substitui testes em Safari/Chrome ou a Web Share API do aparelho.
const originals = {
  document: Object.getOwnPropertyDescriptor(globalThis, "document"),
  Image: Object.getOwnPropertyDescriptor(globalThis, "Image"),
  navigator: Object.getOwnPropertyDescriptor(globalThis, "navigator"),
  window: Object.getOwnPropertyDescriptor(globalThis, "window"),
  bitmap: Object.getOwnPropertyDescriptor(globalThis, "createImageBitmap"),
};
const imageRequests: string[] = [];
test("exportador produz arquivo PNG real 1080 × 1920 fiel ao desenho e sem chamadas externas", async () => {
  // Image retorna uma instância nativa com setter para URLs e largura natural.
  const NativeImage = (await import("@napi-rs/canvas")).Image;
  function BrowserNativeImage() {
    const image = new NativeImage();
    const descriptor = Object.getOwnPropertyDescriptor(
      NativeImage.prototype,
      "src",
    )!;
    const assign = (bytes: Uint8Array) => descriptor.set!.call(image, bytes);
    Object.defineProperty(image, "src", {
      set(value: string) {
        imageRequests.push(value);
        if (value.startsWith("data:"))
          assign(Buffer.from(decodeURIComponent(value.split(",")[1])));
        else if (value.startsWith("blob:"))
          void fetch(value)
            .then((r) => r.arrayBuffer())
            .then((buffer) => assign(Buffer.from(buffer)));
        else if (
          value === "/images/army-pass/logos/arirang-logo-novo.jpeg" ||
          value === "/images/army-pass/logos/bts-logo.png" ||
          value === "/images/army-pass/textures/wings-smoke.png" ||
          value === "/images/army-pass/textures/map-atmosphere.png" ||
          value === "/images/army-pass/textures/persona-atmosphere.png" ||
          value === "/images/army-pass/textures/arirang-light-paper.png"
        )
          void readFile("public" + value).then(assign);
        else if (
          value === "/images/army-pass/gallery/wings/test-only.png" ||
          value ===
            "/images/army-pass/gallery/map-of-the-soul-7/test-only.png" ||
          value === "/images/army-pass/gallery/persona/test-only.png" ||
          value === "/images/army-pass/gallery/arirang/test-only.png"
        )
          void readFile("test-artifacts/test-only-group.png").then(assign);
        else image.onerror?.(new Event("error"));
      },
    });
    return image;
  }
  Object.defineProperty(globalThis, "Image", {
    configurable: true,
    value: BrowserNativeImage,
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      fonts: { ready: Promise.resolve() },
      createElement: () => {
        const canvas = createCanvas(PASS_WIDTH, PASS_HEIGHT);
        return Object.assign(canvas, {
          toBlob: (cb: (blob: Blob) => void) =>
            cb(
              new Blob([new Uint8Array(canvas.toBuffer("image/png"))], {
                type: "image/png",
              }),
            ),
        });
      },
    },
  });
  for (const era of eraIds) {
    const file = await exportArmyPass({ ...model, era });
    assert.equal(file.name, `army-pass-${era}.png`);
    assert.equal(file.type, "image/png");
    const bytes = Buffer.from(await file.arrayBuffer());
    assert.equal(bytes.readUInt32BE(16), 1080);
    assert.equal(bytes.readUInt32BE(20), 1920);
    const canvas = createCanvas(PASS_WIDTH, PASS_HEIGHT);
    const image = await nativeLoadImage(Buffer.from(fixtureSvg(era, 0)));
    const texture =
      era === "wings" ||
      era === "map-of-the-soul" ||
      era === "persona" ||
      era === "arirang"
        ? {
            image: (await nativeLoadImage(
              era === "wings"
                ? "public/images/army-pass/textures/wings-smoke.png"
                : era === "persona"
                  ? "public/images/army-pass/textures/persona-atmosphere.png"
                  : era === "arirang"
                    ? "public/images/army-pass/textures/arirang-light-paper.png"
                    : "public/images/army-pass/textures/map-atmosphere.png",
            )) as unknown as CanvasImageSource,
            width: 941,
            height: 1672,
          }
        : undefined;
    drawArmyPass(
      toContext(canvas),
      { ...model, era },
      {
        image: image as unknown as CanvasImageSource,
        width: 720,
        height: 740,
        texture,
        ...(era === "arirang"
          ? {
              logo: {
                image: (await nativeLoadImage(
                  "public/images/army-pass/logos/arirang-logo-novo.jpeg",
                )) as unknown as CanvasImageSource,
                width: 460,
                height: 158,
              },
              btsLogo: {
                image: (await nativeLoadImage(
                  "public/images/army-pass/logos/bts-logo.png",
                )) as unknown as CanvasImageSource,
                width: 193,
                height: 425,
              },
            }
          : {}),
      },
    );
    assert.deepEqual(bytes, canvas.toBuffer("image/png"));
  }
  const photoCanvas = createCanvas(900, 1400);
  const photoCtx = photoCanvas.getContext("2d");
  photoCtx.fillStyle = "#ff0000";
  photoCtx.fillRect(0, 0, 450, 1400);
  photoCtx.fillStyle = "#0000ff";
  photoCtx.fillRect(450, 0, 450, 1400);
  const blob = new Blob([new Uint8Array(photoCanvas.toBuffer("image/png"))], {
    type: "image/png",
  });
  const url = URL.createObjectURL(blob);
  try {
    // Test-only authorization + pixels. Nothing is added to the public gallery.
    await writeFile(
      "test-artifacts/test-only-group.png",
      photoCanvas.toBuffer("image/png"),
    );
    const manifest = eraPhotoManifest as AuthorizedEraPhoto[];
    for (const era of [
      "wings",
      "map-of-the-soul",
      "persona",
      "arirang",
    ] as const) {
      const authorized: AuthorizedEraPhoto = {
        id: "test-only",
        era,
        path: `/images/army-pass/gallery/${galleryDirectory(era)}/test-only.png`,
        description: "Synthetic test pixels",
        credit: "Teste",
        source: "Fixture sintética de teste",
        authorization: { status: "authorized", reference: "test-only" },
        fitMode: "cover",
        objectPositionX: defaultCrop.x,
        objectPositionY: defaultCrop.y,
        initialScale: defaultCrop.zoom,
      };
      const originalManifest = [...manifest];
      manifest.splice(
        0,
        manifest.length,
        ...originalManifest.filter((photo) => photo.era !== era),
        authorized,
      );
      try {
        const state = builderReducer(
          { ...initialBuilderState, era },
          {
            type: "gallery",
            id: authorized.id,
          },
        );
        assert.equal(state.galleryId, authorized.id);
        const galleryModel: PassModel = {
          ...model,
          era,
          source: "gallery",
          imageUrl: authorized.path,
          personalPhoto: { url, crop: { zoom: 3, x: 100, y: 50 } },
        };
        const file = await exportArmyPass(galleryModel);
        const decoded = await nativeLoadImage(
          Buffer.from(await file.arrayBuffer()),
        );
        const check = createCanvas(1080, 1920);
        check.getContext("2d").drawImage(decoded, 0, 0);
        const pixel = (x: number, y: number) => [
          ...check
            .getContext("2d")
            .getImageData(
              Math.round((x * 1080) / (era === "arirang" ? 900 : 941)),
              Math.round((y * 1920) / (era === "arirang" ? 1600 : 1672)),
              1,
              1,
            ).data,
        ];
        assert.deepEqual(pixel(120, 700), [255, 0, 0, 255]);
        assert.deepEqual(
          pixel(
            era === "wings"
              ? 211
              : era === "persona"
                ? 290
                : era === "arirang"
                  ? 235
                  : 277,
            era === "wings"
              ? 1111
              : era === "persona"
                ? 1036
                : era === "arirang"
                  ? 1007
                  : 1033,
          ),
          [0, 0, 255, 255],
        );
      } finally {
        manifest.splice(0, manifest.length, ...originalManifest);
      }
    }
    const first = await exportArmyPass({
      ...model,
      source: "personal",
      imageUrl: url,
      crop: { zoom: 3, x: 0, y: 50 },
    });
    const second = await exportArmyPass({
      ...model,
      source: "personal",
      imageUrl: url,
      crop: { zoom: 3, x: 100, y: 50 },
    });
    assert.notDeepEqual(
      Buffer.from(await first.arrayBuffer()),
      Buffer.from(await second.arrayBuffer()),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
  assert.ok(
    imageRequests.every(
      (url) =>
        url.startsWith("data:") ||
        url.startsWith("blob:") ||
        url === "/images/army-pass/gallery/wings/test-only.png" ||
        url === "/images/army-pass/gallery/map-of-the-soul-7/test-only.png" ||
        url === "/images/army-pass/gallery/persona/test-only.png" ||
        url === "/images/army-pass/gallery/arirang/test-only.png" ||
        url === "/images/army-pass/logos/arirang-logo-novo.jpeg" ||
        url === "/images/army-pass/logos/bts-logo.png" ||
        url === "/images/army-pass/textures/wings-smoke.png" ||
        url === "/images/army-pass/textures/map-atmosphere.png" ||
        url === "/images/army-pass/textures/persona-atmosphere.png" ||
        url === "/images/army-pass/textures/arirang-light-paper.png",
    ),
  );
});

test("upload processa pixels localmente, aplica from-image, fecha bitmap e revoga URL de entrada no fallback", async () => {
  const canvas = createCanvas(300, 400);
  const bytes = new Uint8Array(canvas.toBuffer("image/png"));
  let closed = 0;
  let orientation = "";
  Object.defineProperty(globalThis, "createImageBitmap", {
    configurable: true,
    value: async (file: File, options: ImageBitmapOptions) => {
      orientation = String(options.imageOrientation);
      const image = await nativeLoadImage(
        Buffer.from(await file.arrayBuffer()),
      );
      return Object.assign(image, { close: () => closed++ });
    },
  });
  const photo = await processPersonalPhoto(
    new File([bytes], "test.png", { type: "image/png" }),
  );
  assert.equal(orientation, "from-image");
  assert.equal(closed, 1);
  assert.equal(photo.width, 300);
  assert.equal(photo.height, 400);
  assert.ok(photo.url.startsWith("blob:"));
  URL.revokeObjectURL(photo.url);
  await assert.rejects(
    processPersonalPhoto(
      new File(["not an image"], "fake.jpg", { type: "image/jpeg" }),
    ),
    /Formato inválido/,
  );
  await assert.rejects(
    processPersonalPhoto(
      new File([new Uint8Array([255, 216, 255, 0])], "broken.jpg"),
    ),
    /danificado/,
  );
  Object.defineProperty(globalThis, "createImageBitmap", {
    configurable: true,
    value: undefined,
  });
  const fallback = await processPersonalPhoto(new File([bytes], "test.png"));
  assert.equal(fallback.height, 400);
  URL.revokeObjectURL(fallback.url);
});

test("compartilhamento detecta suporte a arquivos e lida com indisponibilidade ou rejeição da API", () => {
  const file = new File(["png"], "army-pass.png", { type: "image/png" });
  for (const navigator of [
    {},
    { share: () => {}, canShare: () => false },
    {
      share: () => {},
      canShare: () => {
        throw new Error("Unsupported");
      },
    },
  ]) {
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: navigator,
    });
    assert.equal(canSharePass(file), false);
  }
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      share: () => {},
      canShare: ({ files }: { files: File[] }) => files[0] === file,
    },
  });
  assert.equal(canSharePass(file), true);
});

test("download usa nome previsto e revoga a URL após iniciar a transferência", () => {
  const originalRevoke = URL.revokeObjectURL;
  let revoked = "";
  let clicked = false;
  let name = "";
  const anchor = {
    href: "",
    set download(value: string) {
      name = value;
    },
    click: () => {
      clicked = true;
    },
    remove: () => {},
  };
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { body: { append: () => {} }, createElement: () => anchor },
  });
  let cleanup: (() => void) | undefined;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      setTimeout: (callback: () => void) => {
        cleanup = callback;
        return 1;
      },
    },
  });
  URL.revokeObjectURL = (url: string) => {
    revoked = url;
    originalRevoke(url);
  };
  try {
    downloadPass(new File(["png"], "army-pass-wings.png"));
    assert.equal(clicked, true);
    assert.equal(name, "army-pass-wings.png");
    assert.equal(revoked, "");
    cleanup?.();
    assert.ok(revoked.startsWith("blob:"));
  } finally {
    URL.revokeObjectURL = originalRevoke;
  }
});

after(() => {
  for (const [name, descriptor] of Object.entries(originals)) {
    const key = name === "bitmap" ? "createImageBitmap" : name;
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
});
