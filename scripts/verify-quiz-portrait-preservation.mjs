import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import sharp from "sharp";

const folder = "test-artifacts/quiz-portraits";
const baseline = JSON.parse(
  await fs.readFile(`${folder}/baseline-layout.json`, "utf8"),
);
const browser = await chromium.launch({ channel: "msedge" });
const report = {};
try {
  for (const [name, width, height] of [
    ["desktop", 1440, 900],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
    ["small", 320, 740],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto("http://localhost:3100/jogos/quiz");
    await page.evaluate(() => document.fonts.ready);
    const card = page.getByRole("link", {
      name: "Começar quiz BTS — OT7",
      exact: true,
    });
    await card.getByRole("img").evaluate((image) => image.decode());
    const box = await card.boundingBox();
    assert.deepEqual(box, baseline[name].box, `${name}: OT7 bounding box`);
    assert.equal(
      await card.innerHTML(),
      baseline[name].html,
      `${name}: OT7 markup`,
    );
    await card.screenshot({ path: `${folder}/ot7-after-${name}.png` });
    const before = await sharp(`${folder}/ot7-before-${name}.png`)
      .raw()
      .toBuffer();
    const after = await sharp(`${folder}/ot7-after-${name}.png`)
      .raw()
      .toBuffer();
    assert.ok(before.equals(after), `${name}: OT7 pixels`);
    for (const id of [
      "rm",
      "jin",
      "suga",
      "j-hope",
      "jimin",
      "v",
      "jung-kook",
    ]) {
      const link = page.locator(`a[href="/jogos/quiz/${id}"]`);
      const image = link.getByRole("img");
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((image) => image.decode());
      const imageBox = await image.boundingBox();
      const textBox = await image
        .locator("../..")
        .locator(":scope > span")
        .boundingBox();
      assert.ok(
        textBox.x + textBox.width <= imageBox.x - 5,
        `${name}: ${id} portrait/text overlap`,
      );
    }
    report[name] = {
      box,
      markupIdentical: true,
      pixelsIdentical: true,
      noOverlap: true,
    };
    await page.screenshot({
      path: `test-artifacts/quiz-portraits-final-${name}.png`,
      fullPage: true,
      style: ".skip-link { visibility: hidden; }",
    });
    await page.close();
  }
  const hashes = JSON.parse(
    await fs.readFile(`${folder}/baseline-hashes.json`, "utf8"),
  );
  for (const [file, hash] of Object.entries(hashes))
    assert.equal(
      createHash("sha256")
        .update(await fs.readFile(file))
        .digest("hex"),
      hash,
      file,
    );
  await fs.writeFile(
    `${folder}/preservation-report.json`,
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
  console.log("Game files and OT7 source image: SHA-256 unchanged.");
} finally {
  await browser.close();
}
