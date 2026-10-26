import { test, expect } from "@playwright/test";
test("especial Seul: hero, quatro fotos, controles, teclado e responsividade", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/arirang-tour");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "BTS THE COMEBACK LIVE | ARIRANG",
  );
  await expect(
    page.getByText("Praça Gwanghwamun · Seul, Coreia do Sul"),
  ).toBeVisible();
  const gallery = page.getByRole("region", {
    name: "Fotografias do comeback em Seul",
  });
  for (let i = 1; i <= 4; i++) {
    await gallery
      .getByRole("button", { name: `Ver fotografia ${i}`, exact: true })
      .click();
    const img = gallery.locator('[aria-roledescription="slide"] img');
    await expect(img).toBeVisible();
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
    await expect(
      gallery.getByRole("button", { name: `Ver fotografia ${i}`, exact: true }),
    ).toHaveAttribute("aria-current", "true");
    await expect(
      gallery
        .getByRole("button", { name: `Ver fotografia ${i}`, exact: true })
        .locator("img"),
    ).toHaveAttribute("src", /seoul-netflix/);
    await expect(img).toHaveCSS("object-fit", "contain");
    await expect(
      gallery.locator('[aria-roledescription="slide"]'),
    ).toHaveAttribute("aria-label", `${i} de 4`);
  }
  await gallery
    .getByRole("button", { name: "Próxima fotografia", exact: true })
    .click();
  await expect(
    gallery.locator('[aria-roledescription="slide"]'),
  ).toHaveAttribute("aria-label", "1 de 4");
  await gallery
    .getByRole("button", { name: "Fotografia anterior", exact: true })
    .click();
  await expect(
    gallery.locator('[aria-roledescription="slide"]'),
  ).toHaveAttribute("aria-label", "4 de 4");
  await gallery
    .getByLabel("Use as setas do teclado para navegar pelas fotografias")
    .focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    gallery.locator('[aria-roledescription="slide"]'),
  ).toHaveAttribute("aria-label", "1 de 4");
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
  await expect(
    page.getByRole("img", { name: "ARIRANG", exact: true }),
  ).toBeVisible();
  const frame = gallery.getByLabel(
    "Use as setas do teclado para navegar pelas fotografias",
  );
  const bounds = await frame.boundingBox();
  expect(bounds!.width).toBeLessThanOrEqual(900);
  expect(bounds!.height).toBeLessThanOrEqual(500);
  await page.setViewportSize({ width: 320, height: 740 });
  const strip = gallery.getByRole("group", {
    name: "Escolher fotografia",
    exact: true,
  });
  await expect(
    gallery.getByRole("button", { name: "Deslocar miniaturas para a direita" }),
  ).toBeVisible();
  await gallery
    .getByRole("button", { name: "Deslocar miniaturas para a direita" })
    .click();
  await expect
    .poll(() => strip.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await expect(
    gallery.locator('[aria-roledescription="slide"]'),
  ).toHaveAttribute("aria-label", "1 de 4");
  await gallery
    .getByRole("button", { name: "Fotografia anterior", exact: true })
    .click();
  const active = gallery.getByRole("button", {
    name: "Ver fotografia 4",
    exact: true,
  });
  await expect(active).toHaveAttribute("aria-current", "true");
  await expect
    .poll(() =>
      active.evaluate((el) => {
        const item = el.getBoundingClientRect();
        const parent = el.parentElement!.getBoundingClientRect();
        return item.left >= parent.left - 1 && item.right <= parent.right + 1;
      }),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await page.setViewportSize(info.project.use.viewport!);
  await gallery
    .getByRole("button", { name: "Ver fotografia 1", exact: true })
    .click();
  await page.screenshot({
    path: `test-artifacts/seoul-event/${info.project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
