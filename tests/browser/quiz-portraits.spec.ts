import { expect, test } from "@playwright/test";
import {
  getMemberPortraitSrc,
  memberPortraits,
} from "../../src/features/bts-quiz/member-portraits";

test("retratos: sete arquivos carregam, enquadramento 4:5, dimensões uniformes e destinos corretos", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/jogos/quiz");
  const selection = page.getByRole("region", { name: "Escolha seu quiz" });
  await expect(selection.getByRole("img")).toHaveCount(8);
  const boxes: { width: number; height: number }[] = [];
  for (const photo of memberPortraits) {
    const card = selection.getByRole("link", {
      name: `Começar quiz ${photo.name}`,
      exact: true,
    });
    const image = card.getByRole("img", { name: photo.alt, exact: true });
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect
      .poll(() =>
        image.evaluate(
          (el) =>
            el instanceof HTMLImageElement &&
            el.complete &&
            el.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(image).toHaveAttribute(
      "src",
      new RegExp(encodeURIComponent(photo.src)),
    );
    const requestedSource = await image.evaluate((el) =>
      new URL(el.getAttribute("src")!, location.origin).searchParams.get("url"),
    );
    expect(requestedSource).toBe(getMemberPortraitSrc(photo));
    expect(await image.evaluate((el) => getComputedStyle(el).objectFit)).toBe(
      "cover",
    );
    expect(
      await image.evaluate((el) => getComputedStyle(el).objectPosition),
    ).toBe(photo.objectPosition);
    const bounds = (await image.boundingBox())!;
    expect(Math.abs(bounds.width / bounds.height - 4 / 5)).toBeLessThan(0.01);
    expect(bounds.width).toBeLessThanOrEqual(80);
    boxes.push((await card.boundingBox())!);
    await expect(card).toHaveAttribute("href", `/jogos/quiz/${photo.id}`);
    await card.click();
    await expect(
      page.getByRole("region", {
        name: `Partida do quiz ${photo.name}`,
        exact: true,
      }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "Escolher outro quiz", exact: true })
      .click();
  }
  expect(
    Math.max(...boxes.map((b) => b.height)) -
      Math.min(...boxes.map((b) => b.height)),
  ).toBeLessThan(1);
  expect(
    Math.max(...boxes.map((b) => b.width)) -
      Math.min(...boxes.map((b) => b.width)),
  ).toBeLessThan(1);
  const ot7 = selection.getByRole("link", {
    name: "Começar quiz BTS — OT7",
    exact: true,
  });
  const group = ot7.getByRole("img");
  await expect(group).toHaveAttribute("width", "1600");
  await expect(group).toHaveAttribute("height", "1141");
  await expect(group).toHaveAttribute(
    "alt",
    "Os sete integrantes do BTS reunidos na era ARIRANG",
  );
  await expect(group).toHaveAttribute("src", /arirang-01\.jpg/);
  await expect(ot7).toContainText(
    "Treze anos de história, músicas, conquistas e momentos inesquecíveis. Você conhece essa trajetória?",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-artifacts/quiz-portraits-${testInfo.project.name}.png`,
    fullPage: true,
    style: ".skip-link { visibility: hidden; }",
  });
  expect(errors).toEqual([]);
});

test("retratos: falha de imagem preserva identificação e clique do integrante", async ({
  page,
}) => {
  await page.route("**/_next/image?**", async (route) => {
    if (
      new URL(route.request().url()).searchParams.get("url")?.split("?")[0] ===
      "/images/jogos/integrantes/rm.jpg"
    )
      return route.fulfill({ status: 503, body: "Unavailable" });
    return route.continue();
  });
  await page.goto("/jogos/quiz");
  const rm = page.getByRole("link", { name: "Começar quiz RM", exact: true });
  await rm.scrollIntoViewIfNeeded();
  await expect(rm).toBeVisible();
  await expect(rm.getByRole("img")).toHaveCount(0);
  await expect(
    rm.getByRole("heading", { name: "RM", exact: true }),
  ).toBeVisible();
  await rm.click();
  await expect(
    page.getByRole("region", { name: "Partida do quiz RM", exact: true }),
  ).toBeVisible();
});
