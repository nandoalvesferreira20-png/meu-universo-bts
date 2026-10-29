import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createCanvas } from "@napi-rs/canvas";
import { armyPassCaption } from "../../src/features/army-pass/share-caption";

const eras = ["wings", "map-of-the-soul", "persona", "arirang"];
const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/army-pass");
  await expect(page.locator("canvas").locator("..")).toHaveAttribute(
    "aria-busy",
    "false",
  );
});
test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});

async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
}
async function checkStyledForm(page: Page, mobile: boolean) {
  const grid = page.locator('[class*="formGrid"]');
  await expect(grid).toHaveCSS("display", "grid");
  await expect(grid).toHaveAttribute("class", /formGrid/);
  expect(
    await page
      .locator("form")
      .evaluate((form) =>
        [...form.querySelectorAll("[class]")].some((element) =>
          element.getAttribute("class")?.includes("undefined"),
        ),
      ),
  ).toBe(false);
  const bounds = await page
    .locator("form input:not([type]), form select, form textarea")
    .evaluateAll((elements) =>
      elements.map((element) => {
        const control = element as HTMLElement;
        const luminance = (color: string) => {
          const values = (color.match(/[\d.]+/g) ?? [])
            .slice(0, 3)
            .map((value) => Number(value) / 255)
            .map((value) =>
              value <= 0.04045
                ? value / 12.92
                : ((value + 0.055) / 1.055) ** 2.4,
            );
          return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
        };
        const style = getComputedStyle(control);
        const l1 = luminance(style.borderTopColor);
        const l2 = luminance(style.backgroundColor);
        const rect = control.getBoundingClientRect();
        const label = control.closest("label")!;
        const heading = label.firstElementChild!.getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          right: rect.right,
          bottom: rect.bottom,
          height: rect.height,
          width: rect.width,
          labelWidth: label.getBoundingClientRect().width,
          headingBottom: heading.bottom,
          borderContrast: (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05),
        };
      }),
    );
  expect(bounds.length).toBe(8);
  for (const [index, rect] of bounds.entries()) {
    expect(rect.height).toBeGreaterThanOrEqual(48);
    expect(rect.borderContrast).toBeGreaterThanOrEqual(3);
    expect(rect.headingBottom).toBeLessThanOrEqual(rect.y);
    expect(Math.abs(rect.width - rect.labelWidth)).toBeLessThan(1);
    for (const other of bounds.slice(index + 1))
      expect(
        rect.right <= other.x ||
          other.right <= rect.x ||
          rect.bottom <= other.y ||
          other.bottom <= rect.y,
      ).toBe(true);
  }
  const editor = await page.locator("#army-pass-editor").boundingBox();
  const preview = await page.locator("#army-pass-preview").boundingBox();
  if (!mobile)
    expect(preview!.x).toBeGreaterThanOrEqual(editor!.x + editor!.width);
  const canvas = await page.locator("canvas").boundingBox();
  expect(canvas!.width / canvas!.height).toBeCloseTo(9 / 16, 3);
  await noOverflow(page);
}
async function fillForm(page: Page) {
  await page.getByLabel(/^Nome ou apelido/).fill("Ana ARMY 💜");
  await page.getByLabel(/^Cidade/).fill("São Paulo");
  await page.getByLabel(/^Estado/).selectOption("SP");
  await page.getByLabel(/^Bias favorito/).selectOption("Jimin");
  await page.getByLabel(/^ARMY desde/).fill("2018");
  await page.getByLabel(/^Música favorita/).fill("Uma música especial");
  await page.getByLabel(/^Minha experiência/).selectOption("Cinema");
  await page
    .getByLabel(/^Mensagem especial/)
    .fill("Uma conexão que atravessa distâncias. 보라해 💜");
}
async function downloadAndCompare(page: Page, era: string, info: TestInfo) {
  const downloadButton = page.getByRole("button", {
    name: "Baixar meu Army Pass",
  });
  await expect(downloadButton).toBeVisible();
  await expect(page.locator("canvas").locator("..")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  const expected = await page
    .locator("canvas")
    .evaluate((canvas) => (canvas as HTMLCanvasElement).toDataURL("image/png"));
  const waiting = page.waitForEvent("download");
  await downloadButton.click();
  const download = await waiting;
  expect(download.suggestedFilename()).toBe(`army-pass-${era}.png`);
  const path = info.outputPath(`army-pass-${era}.png`);
  await download.saveAs(path);
  const bytes = await readFile(path);
  await mkdir("test-artifacts/arirang-logos", { recursive: true });
  await writeFile(
    `test-artifacts/arirang-logos/${info.project.name}-${era}${info.title.startsWith("foto pessoal") ? "-portrait" : ""}.png`,
    bytes,
  );

  expect(bytes.subarray(0, 8)).toEqual(
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  );
  expect(bytes.readUInt32BE(16)).toBe(1080);
  expect(bytes.readUInt32BE(20)).toBe(1920);
  expect(bytes).toEqual(Buffer.from(expected.split(",")[1], "base64"));
  await noOverflow(page);
}

for (const era of eras)
  test(`${era}: CSS aplicado, quatro etapas, template único, prévia e download fiel`, async ({
    page,
  }, info) => {
    await expect(
      page
        .getByRole("navigation", { name: "Etapas do Army Pass" })
        .locator("ol"),
    ).toHaveCSS("display", "grid");
    await expect(page.locator('input[name="era"]')).toHaveCount(4);
    await expect(page.locator('input[name="era"][value="be"]')).toHaveCount(0);
    await page.locator(`input[name="era"][value="${era}"]`).check();
    await noOverflow(page);
    await page.getByRole("button", { name: "Personalizar meu pass" }).click();
    await checkStyledForm(page, info.project.name !== "desktop");
    await fillForm(page);
    if (era === "arirang") {
      await expect(page.locator("canvas").locator("..")).toHaveAttribute(
        "aria-busy",
        "false",
      );
      for (const path of [
        "/images/army-pass/logos/arirang-logo-novo.jpeg",
        "/images/army-pass/logos/bts-logo.png",
        "/images/army-pass/gallery/arirang/arirang-01.jpg",
        "/images/army-pass/gallery/arirang/arirang-02.jpg",
        "/images/army-pass/gallery/arirang/arirang-03.jpg",
      ]) {
        const response = await page.request.get(path);
        expect(response.status()).toBe(200);
      }
      const pixels = await page.locator("canvas").evaluate((canvas) => {
        const ctx = (canvas as HTMLCanvasElement).getContext("2d")!;
        return {
          red: [...ctx.getImageData(330, 145, 1, 1).data],
          black: [...ctx.getImageData(964, 120, 1, 1).data],
          wordmarkRedPixels: (() => {
            const { data } = ctx.getImageData(300, 260, 480, 90);
            let count = 0;
            for (let i = 0; i < data.length; i += 4)
              if (data[i] > 170 && data[i + 1] < 100 && data[i + 2] < 120)
                count++;
            return count;
          })(),
        };
      });
      expect(pixels.red[0]).toBeGreaterThan(180);
      expect(pixels.red[1]).toBeLessThan(100);
      expect(pixels.wordmarkRedPixels).toBeGreaterThan(10000);
      expect(pixels.black.slice(0, 3).every((channel) => channel < 80)).toBe(
        true,
      );
    }
    await expect(page.locator('input[name="artwork"]')).toHaveCount(0);
    await expect(page.locator('input[name="photo-source"]')).toHaveCount(0);
    await expect(page.locator("#personal-photo")).toBeAttached();
    await expect(
      page.getByRole("heading", { name: "Escolha sua foto do BTS" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Selecione uma das fotografias disponíveis da sua era favorita.",
      ),
    ).toBeVisible();
    if (era === "wings") {
      await expect(
        page.getByRole("heading", { name: "Novas imagens, em breve." }),
      ).toHaveCount(0);
      await expect(page.locator('[class*="artGrid"] img')).toHaveCount(3);
      await expect(page.locator('input[name="gallery-photo"]')).toHaveCount(3);
      await expect(
        page.locator('input[name="gallery-photo"]').first(),
      ).toBeChecked();
      await expect
        .poll(() =>
          page
            .locator('[class*="artGrid"] img')
            .evaluateAll((images) =>
              images.every(
                (image) =>
                  (image as HTMLImageElement).complete &&
                  (image as HTMLImageElement).naturalWidth > 0,
              ),
            ),
        )
        .toBe(true);
    } else if (era === "map-of-the-soul") {
      await expect(
        page.getByRole("heading", { name: "Novas imagens, em breve." }),
      ).toHaveCount(0);
      await expect(page.locator('[class*="artGrid"] img')).toHaveCount(3);
      await expect(page.locator('input[name="gallery-photo"]')).toHaveCount(3);
      await expect(
        page.locator('input[name="gallery-photo"]').first(),
      ).toBeChecked();
      await expect
        .poll(() =>
          page
            .locator('[class*="artGrid"] img')
            .evaluateAll((images) =>
              images.every(
                (image) =>
                  (image as HTMLImageElement).complete &&
                  (image as HTMLImageElement).naturalWidth > 0,
              ),
            ),
        )
        .toBe(true);
    } else if (era === "persona" || era === "arirang") {
      await expect(
        page.getByRole("heading", { name: "Novas imagens, em breve." }),
      ).toHaveCount(0);
      await expect(page.locator('[class*="artGrid"] img')).toHaveCount(3);
      await expect(page.locator('input[name="gallery-photo"]')).toHaveCount(3);
      await expect(
        page.locator('input[name="gallery-photo"]').first(),
      ).toBeChecked();
      await expect
        .poll(() =>
          page
            .locator('[class*="artGrid"] img')
            .evaluateAll((images) =>
              images.every(
                (image) =>
                  (image as HTMLImageElement).complete &&
                  (image as HTMLImageElement).naturalWidth > 0,
              ),
            ),
        )
        .toBe(true);
      if (era === "arirang")
        await expect(
          page.locator("#group-zoom, #group-x, #group-y"),
        ).toHaveCount(0);
    } else {
      await expect(
        page.getByRole("heading", { name: "Novas imagens, em breve." }),
      ).toBeVisible();
      await expect(page.locator('[class*="artGrid"] img')).toHaveCount(0);
    }
    if (eras.includes(era)) {
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await page.screenshot({
        path: `test-artifacts/arirang-logos/studio-${era}-${info.project.name}.png`,
        fullPage: true,
      });
    }
    await page
      .getByRole("button", { name: "Revisar passaporte", exact: true })
      .last()
      .click();
    await expect(
      page
        .getByRole("navigation", { name: "Etapas do Army Pass" })
        .locator('[aria-current="step"]'),
    ).toContainText("Visualize");
    if (info.project.name !== "desktop")
      await expect(page.locator("canvas")).toBeInViewport();
    await noOverflow(page);
    await page.getByRole("button", { name: "Voltar", exact: true }).click();
    await expect(page.getByLabel(/^Nome ou apelido/)).toHaveValue(
      "Ana ARMY 💜",
    );
    await page
      .getByRole("button", { name: "Revisar passaporte", exact: true })
      .last()
      .click();
    await page.getByRole("button", { name: "Preparar meu PNG" }).click();
    await downloadAndCompare(page, era, info);
  });

test("seleção de foto WINGS atualiza a prévia e o PNG exportado", async ({
  page,
}, info) => {
  await page.getByRole("button", { name: "Personalizar meu pass" }).click();
  await fillForm(page);

  const photos = page.locator('input[name="gallery-photo"]');
  await expect(photos).toHaveCount(3);
  await expect(page.locator("#group-zoom, #group-x, #group-y")).toHaveCount(0);
  await expect(
    page.locator('[class*="artGrid"]').getByRole("button"),
  ).toHaveCount(0);
  await expect(
    page.locator('[class*="artGrid"]').getByText(/arquivo fornecido/),
  ).toHaveCount(0);
  expect(
    await page
      .locator('[class*="artGrid"] img')
      .evaluateAll((images) =>
        images.every(
          (image) =>
            (image as HTMLImageElement).complete &&
            (image as HTMLImageElement).naturalWidth > 0,
        ),
      ),
  ).toBe(true);
  for (const index of [0, 1, 2]) {
    const originalPreview = await page
      .locator("canvas")
      .evaluate((canvas) =>
        (canvas as HTMLCanvasElement).toDataURL("image/png"),
      );
    await photos.nth(index).check();
    await expect(photos.nth(index)).toBeChecked();
    await expect(page.locator('[class*="artGrid"] img').nth(index)).toHaveCSS(
      "object-fit",
      index < 2 ? "contain" : "cover",
    );
    if (index > 0)
      await expect
        .poll(() =>
          page
            .locator("canvas")
            .evaluate((canvas) =>
              (canvas as HTMLCanvasElement).toDataURL("image/png"),
            ),
        )
        .not.toBe(originalPreview);

    await page
      .getByRole("button", { name: "Revisar passaporte", exact: true })
      .last()
      .click();
    await page.getByRole("button", { name: "Preparar meu PNG" }).click();
    await downloadAndCompare(page, "wings", info);
    if (index < 2) {
      await page.getByRole("button", { name: "Editar passaporte" }).click();
      await expect(page.getByLabel(/^Nome ou apelido/)).toHaveValue(
        "Ana ARMY 💜",
      );
      await expect(photos.nth(index)).toBeChecked();
      await expect(page.locator("#group-zoom, #group-x, #group-y")).toHaveCount(
        0,
      );
    }
  }
});

test("seleção das três fotos MAP atualiza a prévia e o PNG exportado", async ({
  page,
}, info) => {
  await page.locator('input[name="era"][value="map-of-the-soul"]').check();
  await page.getByRole("button", { name: "Personalizar meu pass" }).click();
  await fillForm(page);

  const photos = page.locator('input[name="gallery-photo"]');
  await expect(photos).toHaveCount(3);
  await expect(page.locator("#group-zoom, #group-x, #group-y")).toHaveCount(0);
  await expect(
    page.locator('[class*="artGrid"]').getByRole("button"),
  ).toHaveCount(0);
  await expect(
    page.locator('[class*="artGrid"]').getByText(/arquivo fornecido/),
  ).toHaveCount(0);
  for (const index of [0, 1, 2]) {
    const originalPreview = await page
      .locator("canvas")
      .evaluate((canvas) =>
        (canvas as HTMLCanvasElement).toDataURL("image/png"),
      );
    await photos.nth(index).check();
    await expect(photos.nth(index)).toBeChecked();
    await expect(page.locator('[class*="artGrid"] img').nth(index)).toHaveCSS(
      "object-fit",
      "contain",
    );
    if (index > 0)
      await expect
        .poll(() =>
          page
            .locator("canvas")
            .evaluate((canvas) =>
              (canvas as HTMLCanvasElement).toDataURL("image/png"),
            ),
        )
        .not.toBe(originalPreview);

    await page
      .getByRole("button", { name: "Revisar passaporte", exact: true })
      .last()
      .click();
    await page.getByRole("button", { name: "Preparar meu PNG" }).click();
    await downloadAndCompare(page, "map-of-the-soul", info);
    if (index < 2) {
      await page.getByRole("button", { name: "Editar passaporte" }).click();
      await expect(photos.nth(index)).toBeChecked();
    }
  }
});

test("seleção das três fotos PERSONA atualiza a prévia e o PNG exportado", async ({
  page,
}, info) => {
  await page.locator('input[name="era"][value="persona"]').check();
  await page.getByRole("button", { name: "Personalizar meu pass" }).click();
  await fillForm(page);

  const photos = page.locator('input[name="gallery-photo"]');
  await expect(photos).toHaveCount(3);
  await expect(page.locator("#group-zoom, #group-x, #group-y")).toHaveCount(0);
  await expect(
    page.locator('[class*="artGrid"]').getByRole("button"),
  ).toHaveCount(0);
  const thumbnails = page.locator('[class*="artGrid"] img');
  await expect(thumbnails).toHaveCount(3);
  expect(
    await thumbnails.evaluateAll((images) =>
      images.every(
        (image) =>
          (image as HTMLImageElement).complete &&
          (image as HTMLImageElement).naturalWidth > 0,
      ),
    ),
  ).toBe(true);

  for (const index of [0, 1, 2]) {
    const originalPreview = await page
      .locator("canvas")
      .evaluate((canvas) =>
        (canvas as HTMLCanvasElement).toDataURL("image/png"),
      );
    await photos.nth(index).check();
    await expect(photos.nth(index)).toBeChecked();
    await expect(thumbnails.nth(index)).toHaveCSS("object-fit", "contain");
    if (index > 0)
      await expect
        .poll(() =>
          page
            .locator("canvas")
            .evaluate((canvas) =>
              (canvas as HTMLCanvasElement).toDataURL("image/png"),
            ),
        )
        .not.toBe(originalPreview);

    await page
      .getByRole("button", { name: "Revisar passaporte", exact: true })
      .last()
      .click();
    await page.getByRole("button", { name: "Preparar meu PNG" }).click();
    await downloadAndCompare(page, "persona", info);
    if (index < 2) {
      await page.getByRole("button", { name: "Editar passaporte" }).click();
      await expect(photos.nth(index)).toBeChecked();
    }
  }
});

test("seleção das três fotos ARIRANG atualiza a prévia e o PNG exportado", async ({
  page,
}, info) => {
  await page.locator('input[name="era"][value="arirang"]').check();
  await page.getByRole("button", { name: "Personalizar meu pass" }).click();
  await fillForm(page);

  const photos = page.locator('input[name="gallery-photo"]');
  const thumbnails = page.locator('[class*="artGrid"] img');
  await expect(photos).toHaveCount(3);
  await expect(thumbnails).toHaveCount(3);
  await expect(photos.first()).toBeChecked();
  await expect(page.locator("#group-zoom, #group-x, #group-y")).toHaveCount(0);
  expect(
    await thumbnails.evaluateAll((images) =>
      images.every(
        (image) =>
          (image as HTMLImageElement).complete &&
          (image as HTMLImageElement).naturalWidth > 0,
      ),
    ),
  ).toBe(true);

  for (const index of [0, 1, 2]) {
    const originalPreview = await page
      .locator("canvas")
      .evaluate((canvas) =>
        (canvas as HTMLCanvasElement).toDataURL("image/png"),
      );
    await photos.nth(index).check();
    await expect(photos.nth(index)).toBeChecked();
    await expect(thumbnails.nth(index)).toHaveCSS("object-fit", "contain");
    if (index > 0)
      await expect
        .poll(() =>
          page
            .locator("canvas")
            .evaluate((canvas) =>
              (canvas as HTMLCanvasElement).toDataURL("image/png"),
            ),
        )
        .not.toBe(originalPreview);

    await page
      .getByRole("button", { name: "Revisar passaporte", exact: true })
      .last()
      .click();
    await page.getByRole("button", { name: "Preparar meu PNG" }).click();
    await downloadAndCompare(page, "arirang", info);
    if (index < 2) {
      await page.getByRole("button", { name: "Editar passaporte" }).click();
      await expect(photos.nth(index)).toBeChecked();
    }
  }

  await page.getByRole("button", { name: "Editar passaporte" }).click();
  await page.getByRole("button", { name: "Voltar", exact: true }).click();
  await page.locator('input[name="era"][value="wings"]').check();
  await page.getByRole("button", { name: "Personalizar meu pass" }).click();
  await expect(page.locator('input[name="gallery-photo"]')).toHaveCount(3);
  await expect(
    page.locator('input[name="gallery-photo"]').first(),
  ).toBeChecked();
  await page.getByRole("button", { name: "Voltar", exact: true }).click();
  await page.locator('input[name="era"][value="arirang"]').check();
  await page.getByRole("button", { name: "Personalizar meu pass" }).click();
  await expect(page.locator('input[name="gallery-photo"]')).toHaveCount(3);
  await expect(
    page.locator('input[name="gallery-photo"]').nth(2),
  ).toBeChecked();
  await expect(page.getByLabel(/^Nome ou apelido/)).toHaveValue("Ana ARMY 💜");

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: `test-artifacts/arirang-logos/gallery-arirang-${info.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Revisar passaporte", exact: true })
    .last()
    .click();
  await page.screenshot({
    path: `test-artifacts/arirang-logos/pass-arirang-${info.project.name}.png`,
    fullPage: true,
  });
});

for (const photoEra of eras)
  test(`foto pessoal com enquadramento padrão, troca, remoção e preservação sem envio ao servidor (${photoEra})`, async ({
    page,
  }, info) => {
    const posts: string[] = [];
    page.on("request", (request) => {
      if (request.method() !== "GET") posts.push(request.url());
    });
    await page.locator(`input[name="era"][value="${photoEra}"]`).check();
    await page.getByRole("button", { name: "Personalizar meu pass" }).click();
    await fillForm(page);
    const fixture = createCanvas(480, 640);
    const ctx = fixture.getContext("2d");
    ctx.fillStyle = "#71324A";
    ctx.fillRect(0, 0, 240, 640);
    ctx.fillStyle = "#B99AE8";
    ctx.fillRect(240, 0, 240, 640);
    const upload = async () => {
      await page.locator("#personal-photo").setInputFiles({
        name: "test-photo.png",
        mimeType: "image/png",
        buffer: fixture.toBuffer("image/png"),
      });
      await expect(
        page.getByRole("button", { name: "Remover foto" }),
      ).toBeVisible();
      await expect(page.getByRole("slider")).toHaveCount(0);
      await expect(
        page.getByText("Ajuste o enquadramento", { exact: true }),
      ).toHaveCount(0);
      await expect(page.locator("canvas").locator("..")).toHaveAttribute(
        "aria-busy",
        "false",
      );
    };
    const sample = () =>
      page.locator("canvas").evaluate(async (canvas, era) => {
        // Sample a decoded PNG copy. Reading the live canvas repeatedly can
        // switch Chromium's rendering backend and perturb gradients by 1/255.
        const image = new Image();
        const ready = new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = reject;
        });
        image.src = (canvas as HTMLCanvasElement).toDataURL("image/png");
        await ready;
        const copy = document.createElement("canvas");
        copy.width = 1080;
        copy.height = 1920;
        const ctx = copy.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(image, 0, 0);
        const px = (x: number, y: number) => [
          ...ctx.getImageData(
            Math.round((x * 1080) / (era === "arirang" ? 900 : 941)),
            Math.round((y * 1920) / (era === "arirang" ? 1600 : 1672)),
            1,
            1,
          ).data,
        ];
        return {
          group: px(450, 700),
          portrait:
            era === "wings"
              ? px(211, 1111)
              : era === "persona"
                ? px(290, 1036)
                : era === "arirang"
                  ? px(235, 1007)
                  : px(277, 1033),
        };
      }, photoEra);
    const beforePhoto = await sample();
    await upload();
    const afterPhoto = await sample();
    afterPhoto.group.forEach((channel, index) =>
      expect(Math.abs(channel - beforePhoto.group[index])).toBeLessThanOrEqual(
        1,
      ),
    );
    expect(afterPhoto.portrait).not.toEqual(beforePhoto.portrait);

    await upload();
    const afterReplacement = await sample();
    expect(afterReplacement.portrait).toEqual(afterPhoto.portrait);
    await page.getByRole("button", { name: "Remover foto" }).click();
    await expect(
      page.getByRole("button", { name: "Remover foto" }),
    ).toHaveCount(0);
    await upload();
    await page
      .getByRole("button", { name: "Revisar passaporte", exact: true })
      .last()
      .click();
    await expect(page.getByRole("slider")).toHaveCount(0);
    await page.getByRole("button", { name: "Preparar meu PNG" }).click();
    await downloadAndCompare(page, photoEra, info);
    await page.getByRole("button", { name: "Experimentar outra era" }).click();
    await page.locator('input[name="era"][value="arirang"]').check();
    await page.getByRole("button", { name: "Personalizar meu pass" }).click();
    await expect(page.getByLabel(/^Nome ou apelido/)).toHaveValue(
      "Ana ARMY 💜",
    );
    await expect(
      page.getByRole("button", { name: "Remover foto" }),
    ).toBeVisible();
    expect(posts).toEqual([]);
    expect(
      await page.evaluate(() => [localStorage.length, sessionStorage.length]),
    ).toEqual([0, 0]);
    await noOverflow(page);
  });

test("prévia ampliada, foco e fallback de logos pendentes", async ({
  page,
}) => {
  const logoRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/logos/")) logoRequests.push(request.url());
  });
  const expand = page.getByRole("button", { name: "Ampliar passaporte" });
  await expand.click();
  const dialog = page.getByRole("dialog", { name: "Passaporte ampliado" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("canvas").locator("..")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(expand).toBeFocused();
  await expect(page.locator("canvas")).toHaveCount(1);
  expect(logoRequests).toEqual([]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.locator('input[name="era"]').first().locator(".."),
  ).toHaveCSS("transition-duration", "0s");
  await noOverflow(page);
});

for (const shareEra of eras)
  test(`compartilhamento usa o PNG pronto e trata cancelamento (${shareEra})`, async ({
    page,
  }) => {
    await page.evaluate(() => {
      let calls = 0;
      Object.defineProperty(navigator, "canShare", {
        configurable: true,
        value: () => true,
      });
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: async (data: ShareData) => {
          calls++;
          if (calls === 1) throw new DOMException("Cancelado", "AbortError");
          if (data.files?.[0].type !== "image/png")
            throw new Error("Arquivo inválido");
          if (
            !data.text?.includes("💜 Meu ARMY PASS está pronto!") ||
            !data.text.includes("@meuuniversobts") ||
            !data.text.includes("@fernandev.tech")
          )
            throw new Error("Legenda ausente");
        },
      });
    });
    await page.locator(`input[name="era"][value="${shareEra}"]`).check();
    await page.getByRole("button", { name: "Personalizar meu pass" }).click();
    await fillForm(page);
    await page
      .getByRole("button", { name: "Revisar passaporte", exact: true })
      .last()
      .click();
    await page.getByRole("button", { name: "Preparar meu PNG" }).click();
    await page.getByRole("button", { name: "Compartilhar Army Pass" }).click();
    await expect(
      page.getByText(
        "Compartilhamento cancelado. Seu passaporte continua disponível.",
      ),
    ).toBeVisible();
    await page.getByRole("button", { name: "Compartilhar Army Pass" }).click();
    await expect(
      page.getByText(
        "Army Pass entregue ao compartilhamento do seu dispositivo.",
      ),
    ).toBeVisible();
  });

test("copiar legenda: sucesso, erro, cópia manual, links e navegador sem Web Share", async ({
  page,
}) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as Window & { passCaption?: string }).passCaption = text;
        },
      },
    });
  });
  await page.getByRole("button", { name: "Personalizar meu pass" }).click();
  await fillForm(page);
  await page
    .getByRole("button", { name: "Revisar passaporte", exact: true })
    .last()
    .click();
  await page.getByRole("button", { name: "Preparar meu PNG" }).click();
  const copy = page.getByRole("button", {
    name: "Copiar legenda",
    exact: true,
  });
  await expect(copy).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Compartilhar Army Pass" }),
  ).toHaveCount(0);
  await expect(
    page.getByText(/Este navegador não oferece compartilhamento de arquivos/),
  ).toBeVisible();
  await copy.click();
  await expect(page.getByText(/Legenda copiada!/)).toBeVisible();
  expect(
    await page.evaluate(
      () => (window as Window & { passCaption?: string }).passCaption,
    ),
  ).toBe(armyPassCaption(process.env.NEXT_PUBLIC_SITE_URL));
  for (const handle of ["meuuniversobts", "fernandev.tech"]) {
    const link = page.getByRole("link", { name: `@${handle}`, exact: true });
    await expect(link).toHaveAttribute(
      "href",
      `https://www.instagram.com/${handle}/`,
    );
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Permission denied");
        },
      },
    });
  });
  await copy.click();
  await expect(
    page.getByText(/Não foi possível copiar automaticamente/),
  ).toBeVisible();
  const manual = page.getByRole("textbox", {
    name: "Legenda para copiar manualmente",
  });
  await expect(manual).toHaveValue(
    armyPassCaption(process.env.NEXT_PUBLIC_SITE_URL),
  );
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
  });
  await copy.click();
  await expect(manual).toBeVisible();
  for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await noOverflow(page);
  }
});

test("validação, galeria ARIRANG, arquivo inválido e navegação por teclado", async ({
  page,
}) => {
  await page.locator('input[name="era"][value="wings"]').focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.locator('input[name="era"][value="map-of-the-soul"]'),
  ).toBeChecked();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.locator('input[name="era"][value="persona"]'),
  ).toBeChecked();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.locator('input[name="era"][value="arirang"]'),
  ).toBeChecked();
  await page.getByRole("button", { name: "Personalizar meu pass" }).focus();
  await page.keyboard.press("Enter");
  await page
    .getByRole("button", { name: "Revisar passaporte", exact: true })
    .last()
    .click();
  await expect(page.getByLabel(/^Nome ou apelido/)).toBeFocused();
  await expect(page.getByText("Informe seu nome ou apelido.")).toBeVisible();
  await fillForm(page);
  await expect(page.locator('input[name="gallery-photo"]')).toHaveCount(3);
  await page.locator("#personal-photo").setInputFiles({
    name: "fake.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from("not an image"),
  });
  await expect(
    page.locator("#army-pass-editor").getByRole("alert"),
  ).toContainText("Formato inválido");
  await page
    .getByRole("button", { name: "Revisar passaporte", exact: true })
    .last()
    .click();
  await expect(
    page.getByRole("button", { name: "Preparar meu PNG" }),
  ).toBeVisible();
  await noOverflow(page);
});
