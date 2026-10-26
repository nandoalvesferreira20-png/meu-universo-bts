import { expect, test } from "@playwright/test";

import { getHistoryPhoto } from "../../src/data/history-photos";

test("história: capítulos, teclado, fontes e layout", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/historia");
  await expect(page).toHaveTitle(
    "História do BTS | De 2013 a ARIRANG — Army Pass Brasil",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "BTS: A história de sete sonhos",
  );
  await expect(
    page
      .locator('a[href="/army-pass"]')
      .filter({ hasText: "Crie seu Army Pass" }),
  ).toBeVisible();
  const mobile = testInfo.project.name === "mobile";
  for (let year = 2013; year <= 2026; year++) {
    const article = page.locator(`#ano-${year}`);
    if (mobile) {
      const toggle = article.getByRole("button", {
        name: new RegExp(`^${year}`),
      });
      if ((await toggle.getAttribute("aria-expanded")) !== "true")
        await toggle.click();
    } else {
      const link = page
        .getByRole("navigation", { name: "Anos da história do BTS" })
        .getByRole("link", { name: new RegExp(`^${year}`) });
      await link.focus();
      await page.keyboard.press("Enter");
      await expect(link).toHaveAttribute("aria-current", "step");
    }
    const photo = getHistoryPhoto(year);
    if (photo) {
      const figure = article.locator(`figure[data-photo-year="${year}"]`);
      await expect(figure).toBeVisible();
      const image = figure.getByRole("img", { name: photo.alt, exact: true });
      await expect(image).toBeVisible();
      const frame = await image.locator("..").boundingBox();
      expect(frame).not.toBeNull();
      expect(frame!.width).toBeLessThanOrEqual(mobile ? 240 : 320);
      expect(frame!.height).toBeLessThanOrEqual(mobile ? 181 : 211);
      expect(Math.abs(frame!.width / frame!.height - 4 / 3)).toBeLessThan(0.01);
      expect(
        await image.evaluate((element) => getComputedStyle(element).objectFit),
      ).toBe("contain");
      await expect
        .poll(() =>
          image.evaluate(
            (element) =>
              element instanceof HTMLImageElement &&
              element.complete &&
              element.naturalWidth > 0,
          ),
        )
        .toBe(true);
      await expect(
        figure.getByRole("link", { name: photo.license.name, exact: false }),
      ).toHaveAttribute("href", photo.license.url);
      await expect(figure).toContainText(photo.credit);
      await expect(page.locator("figure[data-photo-year]")).toHaveCount(1);
      if ([2013, 2024].includes(year)) {
        await article.screenshot({
          path: `test-artifacts/history-photo-${year}-${testInfo.project.name}.png`,
          style: ".skip-link { visibility: hidden; }",
        });
      }
    } else {
      await expect(article.locator("figure[data-photo-year]")).toHaveCount(0);
    }
    await article.getByRole("button", { name: "Ler este capítulo" }).click();
    await expect(
      page.getByRole("heading", {
        name: "Acontecimentos",
        includeHidden: true,
      }),
    ).toHaveCount(1);
    await expect(
      article.getByRole("heading", { name: "Acontecimentos" }),
    ).toBeVisible();
    expect(await article.locator('a[target="_blank"]').count()).toBeGreaterThan(
      0,
    );
    await article.getByRole("button", { name: "Recolher capítulo" }).click();
    await expect(
      article.getByRole("heading", { name: "Acontecimentos" }),
    ).toHaveCount(0);
  }
  await expect(page.locator("#ano-2026")).toContainText("ARIRANG");
  await page.getByText("Consultar as fontes da jornada").click();
  for (const href of await page
    .locator('a[target="_blank"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")))) {
    expect(href).toMatch(/^https:\/\//);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: `test-artifacts/history-${testInfo.project.name}.png`,
    fullPage: true,
    style: ".skip-link { visibility: hidden; }",
  });
});

test("história respeita movimento reduzido e CTA interno", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/historia");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.getByRole("link", { name: "Explore nossa história" }).click();
  await expect(page).toHaveURL(/#linha-do-tempo$/);
  await page
    .getByRole("link", { name: "Crie seu Army Pass", exact: true })
    .click();
  await expect(page).toHaveURL(/\/army-pass$/);
});

test("capítulo especial: sete integrantes, datas, expansão e ligação com a timeline", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/historia");
  const special = page.getByRole("region", {
    name: "A pausa que não foi um adeus",
  });
  await expect(special).toHaveCount(1);
  const summary = special.getByText(
    "Explorar a pausa, o serviço e o reencontro",
    { exact: true },
  );
  await expect(
    special.getByRole("heading", { name: "A decisão" }),
  ).not.toBeVisible();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(
    special.getByRole("heading", { name: "A decisão" }),
  ).toBeVisible();
  await expect(special).toContainText(
    "um anúncio distinto da decisão artística de junho",
  );
  const cards = special
    .getByRole("list", { name: "Trajetórias de serviço em ordem de início" })
    .locator(":scope > li");
  await expect(cards).toHaveCount(7);
  const expected = [
    ["Jin", "2022-12-13", "2024-06-12"],
    ["j-hope", "2023-04-18", "2024-10-17"],
    ["SUGA", "2023-09-22", "2025-06-21"],
    ["RM", "2023-12-11", "2025-06-10"],
    ["V", "2023-12-11", "2025-06-10"],
    ["Jimin", "2023-12-12", "2025-06-11"],
    ["Jung Kook", "2023-12-12", "2025-06-11"],
  ];
  for (let i = 0; i < expected.length; i++) {
    const cardBounds = await cards.nth(i).boundingBox();
    expect(cardBounds!.height).toBeLessThan(230);
    await expect(
      cards.nth(i).getByRole("heading", { name: expected[i][0], exact: true }),
    ).toBeVisible();
    expect(
      await cards
        .nth(i)
        .locator("time")
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getAttribute("datetime")),
        ),
    ).toEqual(expected[i].slice(1));
  }
  await expect(cards.nth(2)).toContainText("Serviço social alternativo");
  await expect(cards.nth(2)).toContainText("Conclusão oficial");
  await expect(special).toContainText(
    "não significou realizar imediatamente um show de comeback",
  );
  await expect(special).toContainText(
    "ARIRANG, lançado em 20 de março de 2026",
  );
  await expect(page.locator('#linha-do-tempo article[id^="ano-"]')).toHaveCount(
    14,
  );
  for (const year of [2022, 2023, 2024, 2025]) {
    if (testInfo.project.name === "mobile")
      await page
        .locator(`#ano-${year}`)
        .getByRole("button", { name: new RegExp(`^${year}`) })
        .click();
    else
      await page
        .getByRole("navigation", { name: "Anos da história do BTS" })
        .getByRole("link", { name: new RegExp(`^${year}`) })
        .click();
    await page
      .locator(`#ano-${year}`)
      .getByRole("button", { name: "Ler este capítulo" })
      .click();
    await expect(
      page
        .locator(`#ano-${year}`)
        .getByRole("link", { name: /Aprofunde este período/ }),
    ).toHaveAttribute("href", "#capitulo-especial");
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await summary.click();
  await expect(
    special.getByRole("heading", { name: "A decisão" }),
  ).not.toBeVisible();
  await page
    .locator("#ano-2025")
    .getByRole("link", { name: /Aprofunde este período/ })
    .click();
  await expect(
    special.getByRole("heading", { name: "A decisão" }),
  ).toBeVisible();
  await special.screenshot({
    path: `test-artifacts/reunion-${testInfo.project.name}.png`,
    style: ".skip-link { visibility: hidden; }",
  });
  await summary.click();
  await expect(
    special.getByRole("heading", { name: "A decisão" }),
  ).not.toBeVisible();
  expect(errors).toEqual([]);
});

test("fotografia indisponível preserva o capítulo e o bloco tipográfico", async ({
  page,
}) => {
  await page.route("**/_next/image?**", (route) =>
    route.fulfill({ status: 503, body: "Unavailable" }),
  );
  await page.goto("/historia");
  await expect(page.locator('figure[data-photo-year="2013"]')).toHaveCount(0);
  const article = page.locator("#ano-2013");
  await expect(
    article.getByRole("heading", { name: "O começo de tudo", exact: true }),
  ).toBeVisible();
  await article.getByRole("button", { name: "Ler este capítulo" }).click();
  await expect(
    article.getByRole("heading", { name: "Acontecimentos" }),
  ).toBeVisible();
  await expect(page.locator(".site-header")).toBeVisible();
});
