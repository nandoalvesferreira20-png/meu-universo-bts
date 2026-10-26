import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { worldTourPhotos } from "../src/data/arirang-world-gallery";
test("galeria mundial: todos os 12 arquivos reais, formatos e dimensões corretos, sem metadados inventados", async () => {
  const directory = "public/images/arirang-tour/world-tour";
  assert.equal(worldTourPhotos.length, 12);
  assert.deepEqual(
    worldTourPhotos.map((p) => path.basename(p.src)).sort(),
    (await fs.readdir(directory)).sort(),
  );
  assert.equal(new Set(worldTourPhotos.map((p) => p.src)).size, 12);
  let jpeg = 0,
    webp = 0;
  for (const photo of worldTourPhotos) {
    const m = await sharp(await fs.readFile("public" + photo.src)).metadata();
    assert.equal(m.width, photo.width);
    assert.equal(m.height, photo.height);
    assert.ok(["jpeg", "webp"].includes(m.format!));
    if (m.format === "jpeg") jpeg++;
    else webp++;
    assert.ok(photo.alt.length > 10);
    assert.equal(photo.credit, undefined);
    assert.equal(photo.source, undefined);
    assert.equal(photo.caption, undefined);
  }
  assert.equal(jpeg, 9);
  assert.equal(webp, 3);
  assert.ok(worldTourPhotos.some((p) => p.src.endsWith("/tour-12-los")));
});
