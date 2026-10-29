import { expect, test } from "@playwright/test";

for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
  test(`portal navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".experience-card")).toHaveCount(5);
    await expect(page.locator('a[href*="mural"]')).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Pular para o conteúdo" }),
    ).toBeFocused();
    const menu = page.getByRole("button", { name: "Abrir menu" });
    if (await menu.isVisible()) {
      await menu.click();
      const mobile = page.getByRole("navigation", { name: "Menu mobile" });
      await expect(mobile.getByRole("link")).toHaveCount(5);
      await expect(mobile.locator('a[href*="mural"]')).toHaveCount(0);
      await page.keyboard.press("Escape");
      await expect(menu).toBeFocused();
      await expect(mobile).toHaveCount(0);
    } else {
      await expect(page.locator(".desktop-navigation a")).toHaveCount(4);
    }
    await expect(page.locator(".site-footer nav a")).toHaveCount(5);
    for (const card of await page.locator(".experience-card").all()) {
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    }
    const boxes = await page.locator(".experience-card").evaluateAll((cards) =>
      cards.map((card) => {
        const { x, y, width } = card.getBoundingClientRect();
        const ctaBottom = card
          .querySelector(".card-link")!
          .getBoundingClientRect().bottom;
        return { x, y, width, ctaBottom };
      }),
    );
    const row = boxes.filter((box) => box.y === boxes.at(-1)!.y);
    const center = (row[0].x + row.at(-1)!.x + row.at(-1)!.width) / 2;
    expect(Math.abs(center - width / 2)).toBeLessThanOrEqual(1);
    for (const card of boxes) {
      for (const peer of boxes.filter((box) => Math.abs(box.y - card.y) < 1)) {
        expect(Math.abs(peer.ctaBottom - card.ctaBottom)).toBeLessThan(1);
      }
    }
  });
}

test("nested game route identifies the active navigation item", async ({
  page,
}) => {
  await page.goto("/jogos/quiz/rm");
  await expect(
    page.locator('.desktop-navigation a[aria-current="page"]'),
  ).toHaveAttribute("href", "/jogos");
  await expect(
    page.locator('.site-footer nav a[aria-current="page"]'),
  ).toHaveAttribute("href", "/jogos");
  const menu = page.getByRole("button", { name: "Abrir menu" });
  if (await menu.isVisible()) {
    await menu.click();
    await expect(
      page.locator('#mobile-menu a[aria-current="page"]'),
    ).toHaveAttribute("href", "/jogos");
  }
});

test("retired routes return 404 and institutional credits remain", async ({
  page,
  request,
}) => {
  for (const path of [
    "/mural",
    "/admin/mural",
    "/api/mural/messages",
    "/api/mural/reports",
    "/api/mural/admin/session",
    "/api/mural/admin/messages",
    "/api/mural/admin/messages/example",
    "/api/mural/admin/reports",
  ]) {
    expect((await request.get(path)).status()).toBe(404);
  }
  await page.goto("/sobre");
  await expect(
    page.getByRole("link", { name: /Conheça o Meu Universo BTS/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Siga a Loung Tech/ }),
  ).toBeVisible();
  await expect(page.getByText(/não possui vínculo/)).toBeVisible();
});
