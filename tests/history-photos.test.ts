import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import {
  authorizedHistoryPhotos,
  pendingHistoryPhotos,
  getHistoryPhoto,
} from "../src/data/history-photos";

test("fotografias: arquivo, formato, dimensões reais, integridade e licença de cada ano", async () => {
  const evidence = JSON.parse(
    await readFile("docs/history-photo-license-evidence.json", "utf8"),
  );
  for (const photo of authorizedHistoryPhotos) {
    assert.equal(photo.status, "authorized");
    assert.equal(photo.filename, `bts-${photo.year}.webp`);
    assert.equal(photo.src, `/images/historia/${photo.filename}`);
    assert.ok(photo.eventDate.startsWith(String(photo.year)));
    assert.ok(photo.alt.length > 30 && photo.credit.length > 0);
    assert.ok(
      photo.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:"),
    );
    assert.ok(photo.authorizationEvidence.includes("oldid="));
    assert.ok(
      photo.license.url.startsWith("https://creativecommons.org/licenses/"),
    );
    const source = evidence.find(
      (item: { year: number }) => item.year === photo.year,
    ).imageinfo[0];
    assert.equal(source.extmetadata.LicenseShortName.value, photo.license.name);
    assert.equal(source.width, photo.originalDimensions.width);
    assert.equal(source.height, photo.originalDimensions.height);
    const bytes = await readFile(path.join("public", photo.src));
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.format, "webp");
    assert.equal(meta.width, photo.width);
    assert.equal(meta.height, photo.height);
    assert.equal(bytes.length, photo.bytes);
    assert.ok(bytes.length < 1_000_000);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      photo.sha256,
    );
    assert.ok(
      photo.width <= photo.acquiredDimensions.width &&
        photo.height <= photo.acquiredDimensions.height,
    );
    assert.ok(
      Math.abs(
        photo.width / photo.height -
          photo.acquiredDimensions.width / photo.acquiredDimensions.height,
      ) < 0.003,
    );
  }
});

test("fotografias: nenhuma candidata é publicada e os 14 anos possuem uma única decisão de curadoria", () => {
  const years = [...authorizedHistoryPhotos, ...pendingHistoryPhotos]
    .map((photo) => photo.year)
    .sort((a, b) => a - b);
  assert.deepEqual(
    years,
    Array.from({ length: 14 }, (_, i) => 2013 + i),
  );
  assert.equal(new Set(years).size, 14);
  for (const candidate of pendingHistoryPhotos) {
    assert.equal(candidate.filename, null);
    assert.equal(candidate.license, null);
    assert.equal(getHistoryPhoto(candidate.year), undefined);
    assert.ok(candidate.reason.length > 40);
  }
});
