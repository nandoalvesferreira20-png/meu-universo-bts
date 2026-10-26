import assert from "node:assert/strict";
import { test } from "node:test";
import { createCanvas, loadImage as nativeLoadImage } from "@napi-rs/canvas";
import {
  authorizedLogoPath,
  containLogo,
  prepareEraLogo,
} from "../src/features/army-pass/era-logos";
import { eraThemes } from "../src/features/army-pass/themes";
import { eraIds, type EraLogo } from "../src/features/army-pass/types";
import { drawArmyPass, drawEraLogo } from "../src/features/army-pass/renderer";
import { artworkSvg } from "../src/features/army-pass/artwork";
import { initialFields, defaultCrop } from "../src/features/army-pass/state";

test("as outras três identidades permanecem pendentes e não carregam assets sem autorização", async () => {
  let loads = 0;
  for (const era of eraIds.filter((id) => id !== "arirang")) {
    assert.equal(eraThemes[era].logo.status, "pending-authorization");
    assert.equal(eraThemes[era].logo.path, null);
    assert.equal(authorizedLogoPath(eraThemes[era].logo), null);
    assert.equal(
      await prepareEraLogo(eraThemes[era].logo, async () => {
        loads++;
        throw new Error("Não deveria carregar");
      }),
      undefined,
    );
  }
  assert.equal(loads, 0);
});

const authorized: EraLogo = {
  ...eraThemes.wings.logo,
  status: "authorized",
  path: "/images/army-pass/logos/test-fixture.png",
  credit: "Arte geométrica sintética de teste",
  authorizationReference: "teste-sem-material-oficial",
  usageConditions: "Uso apenas no teste automatizado",
};

test("a autorização exige crédito, origem, referência e condições; não permite caminhos externos", () => {
  assert.equal(authorizedLogoPath(authorized), authorized.path);
  assert.equal(
    authorizedLogoPath({
      ...authorized,
      path: "/images/army-pass/logos/arirang-logo-novo.jpeg",
    }),
    "/images/army-pass/logos/arirang-logo-novo.jpeg",
  );
  for (const invalid of [
    { status: "pending-authorization" as const },
    { path: null },
    { path: "https://example.com/mark.svg" },
    { path: "/images/army-pass/logos/../wings.svg" },
    { path: "/images/army-pass/logos/wings.svg?url=x" },
    { credit: "" },
    { authorizationReference: "" },
    { usageConditions: null },
    { source: "" },
  ])
    assert.equal(authorizedLogoPath({ ...authorized, ...invalid }), null);
});

test("logo autorizado mantém proporção e falhas usam fallback sem interromper geração", async () => {
  const synthetic = await nativeLoadImage(
    Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="red"/></svg>',
    ),
  );
  const photo = await nativeLoadImage(Buffer.from(artworkSvg("wings", 0)));
  Object.defineProperties(synthetic, {
    naturalWidth: { value: 400 },
    naturalHeight: { value: 200 },
  });
  let requested = "";
  const prepared = await prepareEraLogo(authorized, async (path) => {
    requested = path;
    return synthetic as unknown as HTMLImageElement;
  });
  assert.equal(requested, authorized.path);
  assert.equal(prepared?.width, 400);
  const fit = containLogo(400, 200, authorized.placement);
  assert.equal(fit.width / fit.height, 2);
  assert.ok(fit.x >= authorized.placement.x && fit.y >= authorized.placement.y);
  assert.ok(
    fit.x + fit.width <= authorized.placement.x + authorized.placement.width,
  );
  assert.equal(
    await prepareEraLogo(authorized, async () => {
      throw new Error("404");
    }),
    undefined,
  );
  const canvas = createCanvas(1080, 1920);
  const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;
  assert.equal(drawEraLogo(ctx, prepared, eraThemes.wings.logo), false);
  assert.equal(drawEraLogo(ctx, prepared, authorized), true);
  assert.equal(
    ctx.getImageData(
      Math.round(fit.x + fit.width / 2),
      Math.round(fit.y + fit.height / 2),
      1,
      1,
    ).data[0],
    255,
  );
  assert.equal(
    authorizedLogoPath(eraThemes.arirang.logo),
    "/images/army-pass/logos/arirang-logo-novo.jpeg",
  );
  assert.equal(eraThemes.arirang.logo.placement.height, 330);

  const model = {
    era: "wings" as const,
    fields: { ...initialFields, displayName: "ARMY" },
    source: "artwork" as const,
    artwork: 0 as const,
    imageUrl: null,
    crop: defaultCrop,
  };
  const image = {
    image: photo as unknown as CanvasImageSource,
    width: 720,
    height: 740,
  };
  drawArmyPass(ctx, model, image);
  const fallback = canvas.toBuffer("image/png");
  const original = eraThemes.wings.logo;
  try {
    eraThemes.wings.logo = authorized;
    drawArmyPass(ctx, model, { ...image, logo: prepared });
    assert.notDeepEqual(canvas.toBuffer("image/png"), fallback);
    drawArmyPass(ctx, model, image);
    assert.deepEqual(canvas.toBuffer("image/png"), fallback);
  } finally {
    eraThemes.wings.logo = original;
  }
});
