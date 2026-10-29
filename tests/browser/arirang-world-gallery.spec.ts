import { test, expect } from "@playwright/test";
import { worldTourPhotos } from "../../src/data/arirang-world-gallery";
import { datedTourStops } from "../../src/data/arirang-tour";
test("galeria mundial: 12 fotos locais, navegação, miniaturas, ordem e seções preservadas", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/arirang-tour");
  const gallery = page.getByRole("region", {
    name: "Fotografias da ARIRANG WORLD TOUR",
    exact: true,
  });
  await gallery.scrollIntoViewIfNeeded();
  await expect(
    gallery.getByRole("heading", {
      name: "Momentos que ficaram para a história.",
    }),
  ).toBeVisible();
  const slide = gallery.locator('[aria-roledescription="slide"]');
  for (const [i, photo] of worldTourPhotos.entries()) {
    const thumbnail = gallery.getByRole("button", {
      name: `Ver fotografia ${i + 1}`,
      exact: true,
    });
    await thumbnail.click();
    await expect(thumbnail).toHaveAttribute("aria-current", "true");
    const img = slide.getByRole("img");
    await expect(img).toHaveAttribute("alt", photo.alt);
    await expect
      .poll(() =>
        img.evaluate(
          (el) =>
            el instanceof HTMLImageElement &&
            el.complete &&
            el.naturalWidth > 0,
        ),
      )
      .toBe(true);
    expect(
      await img.evaluate((el) =>
        new URL((el as HTMLImageElement).src).searchParams.get("url"),
      ),
    ).toBe(photo.src);
    await expect(img).toHaveCSS("object-fit", "contain");
  }
  await gallery
    .getByRole("button", { name: "Próxima fotografia", exact: true })
    .click();
  await expect(slide).toHaveAttribute("aria-label", "1 de 12");
  await gallery
    .getByRole("button", { name: "Fotografia anterior", exact: true })
    .click();
  await expect(slide).toHaveAttribute("aria-label", "12 de 12");
  await gallery
    .getByLabel("Use as setas do teclado para navegar pelas fotografias")
    .focus();
  await page.keyboard.press("ArrowRight");
  await expect(slide).toHaveAttribute("aria-label", "1 de 12");
  const strip = gallery.getByRole("group", {
    name: "Escolher fotografia",
    exact: true,
  });
  await gallery
    .getByRole("button", {
      name: "Deslocar miniaturas para a direita",
      exact: true,
    })
    .click();
  await expect
    .poll(() => strip.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await expect(slide).toHaveAttribute("aria-label", "1 de 12");
  await gallery
    .getByRole("button", { name: "Fotografia anterior", exact: true })
    .click();
  const active = gallery.getByRole("button", {
    name: "Ver fotografia 12",
    exact: true,
  });
  await expect
    .poll(() =>
      active.evaluate((el) => {
        const a = el.getBoundingClientRect(),
          b = el.parentElement!.getBoundingClientRect();
        return a.left >= b.left - 1 && a.right <= b.right + 1;
      }),
    )
    .toBe(true);
  const frame = gallery.getByLabel(
    "Use as setas do teclado para navegar pelas fotografias",
  );
  await frame.evaluate((el) => {
    for (const [type, key, x] of [
      ["touchstart", "touches", 200],
      ["touchend", "changedTouches", 100],
    ] as const) {
      const event = new Event(type, { bubbles: true });
      Object.defineProperty(event, key, {
        value: [{ clientX: x, clientY: 100 }],
      });
      el.dispatchEvent(event);
    }
  });
  await expect(slide).toHaveAttribute("aria-label", "1 de 12");
  const brazil = page.locator('[data-tour-stop="sao-paulo"]');
  await expect(brazil).toHaveAttribute(
    "data-status",
    datedTourStops(new Date()).find((stop) => stop.id === "sao-paulo")!.status,
  );
  expect(
    await gallery.evaluate((el) =>
      Boolean(
        el.compareDocumentPosition(
          document.querySelector('[data-tour-stop="sao-paulo"]')!,
        ) & Node.DOCUMENT_POSITION_PRECEDING,
      ),
    ),
  ).toBe(true);
  expect(
    await gallery.evaluate((el) =>
      Boolean(
        el.compareDocumentPosition(
          document.querySelector('[data-tour-stop="buenos-aires"]')!,
        ) & Node.DOCUMENT_POSITION_PRECEDING,
      ),
    ),
  ).toBe(true);
  const netflix = page.getByRole("region", {
    name: "Fotografias do comeback em Seul",
    exact: true,
  });
  await expect(
    netflix.locator('[aria-roledescription="slide"]'),
  ).toHaveAttribute("aria-label", "1 de 4");
  for (const width of [390, 320, 390, 375, 430, 320, 1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const controls = netflix.getByRole("button", {
      name: "Deslocar miniaturas para a direita",
      exact: true,
    });
    await expect(controls).toHaveCount(width === 320 ? 1 : 0);
  }
  await expect(gallery.getByRole("link")).toHaveCount(0);
  for (const width of [info.project.use.viewport!.width, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  }
  await page.setViewportSize(info.project.use.viewport!);
  await gallery.screenshot({
    path: `test-artifacts/world-tour/${info.project.name}.png`,
  });
  const box = await frame.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(900);
  expect(box!.height).toBeLessThanOrEqual(500);
  expect(errors).toEqual([]);
});
