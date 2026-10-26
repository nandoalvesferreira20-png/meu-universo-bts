import { test, expect } from "@playwright/test";
import { tourStops } from "../../src/data/arirang-tour";
test("timeline: 25 paradas cronológicas, 62 datas, sete meses e capítulo brasileiro", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/arirang-tour");
  const timeline = page.getByRole("region", { name: "De Goyang ao mundo." });
  await expect(timeline).toBeVisible();
  await expect(timeline.locator("[data-tour-stop]")).toHaveCount(25);
  await expect(timeline.getByRole("heading", { level: 3 })).toHaveCount(7);
  await expect(timeline.locator("time")).toHaveCount(62);
  for (const stop of tourStops) {
    const item = timeline.locator(`[data-tour-stop="${stop.id}"]`);
    await expect(item.getByRole("heading", { level: 4 })).toContainText(
      stop.city,
    );
    await expect(item).toContainText(stop.country);
    await expect(item).toContainText(stop.venue);
    expect(
      await item
        .locator("time")
        .evaluateAll((els) => els.map((el) => el.getAttribute("datetime"))),
    ).toEqual(stop.dates);
  }
  const brazil = timeline.locator('[data-tour-stop="sao-paulo"]');
  await expect(brazil).toHaveAttribute("data-status", "upcoming");
  await expect(brazil).toContainText("PRÓXIMA PARADA");
  await expect(brazil).toContainText("Em breve, ARMYs 💜");
  await expect(timeline.locator('[data-status="past"]')).toHaveCount(24);
  await expect(timeline.locator("[data-world-timeline] img")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "BTS THE COMEBACK LIVE | ARIRANG",
  );
  await expect(
    page.getByRole("region", { name: "Fotografias do comeback em Seul" }),
  ).toHaveCount(1);
  await expect(
    timeline.getByRole("link", { name: "agenda oficial da BIGHIT MUSIC ↗" }),
  ).toHaveAttribute("href", "https://bighitsmusic.com/bts/tour");
  for (const width of [info.project.use.viewport!.width, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    for (const stop of ["goyang", "buenos-aires", "sao-paulo"]) {
      const box = await timeline
        .locator(`[data-tour-stop="${stop}"]`)
        .boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    }
  }
  await page.setViewportSize(info.project.use.viewport!);
  await timeline.screenshot({
    path: `test-artifacts/tour-timeline/${info.project.name}.png`,
  });
  await brazil.screenshot({
    path: `test-artifacts/tour-timeline/brazil-${info.project.name}.png`,
  });
  expect(errors).toEqual([]);
});
