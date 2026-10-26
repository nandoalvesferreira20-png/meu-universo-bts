import { expect, test } from "@playwright/test";
import { emojiQuestions } from "../../src/features/emoji-challenge/questions";

test("emoji challenge: navegação, partida completa, teclado, resultado, compartilhamento e reinício", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as Window & { copied?: string }).copied = text;
        },
      },
    });
  });
  await page.goto("/jogos");
  await page.getByRole("link", { name: /Emoji Challenge/ }).click();
  await expect(page).toHaveTitle(
    "Adivinhe a Música pelos Emojis | Army Pass Brasil",
  );
  await expect(page.getByRole("button", { name: /^Jogar / })).toHaveCount(3);
  await page.screenshot({
    path: `test-artifacts/emoji-selection-${testInfo.project.name}.png`,
    style: ".skip-link { visibility: hidden; }",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Jogar Fácil", exact: true }).focus();
  await page.keyboard.press("Enter");
  const seen = new Set<string>();
  for (let i = 0; i < 10; i++) {
    await expect(
      page.getByRole("heading", { name: "Qual é a música?" }),
    ).toBeFocused();
    const region = page.getByRole("region", {
      name: "Partida do Emoji Challenge",
    });
    await expect(region).toContainText(`${i + 1} de 10`);
    const description = await region
      .getByRole("img")
      .getAttribute("aria-label");
    const current = emojiQuestions.find(
      (q) => q.emojiDescription === description,
    )!;
    expect(current.difficulty).toBe("easy");
    expect(seen.has(current.id)).toBe(false);
    seen.add(current.id);
    const options = region
      .getByRole("group", { name: "Alternativas" })
      .getByRole("button");
    await expect(options).toHaveCount(4);
    await expect(region.getByRole("status")).toBeEmpty();
    const next = region.getByRole("button", {
      name: i === 9 ? "Ver resultado" : "Próxima pergunta",
    });
    await expect(next).toBeDisabled();
    const answer = current.options.find(
      (o) => o.id === current.correctAnswerId,
    )!;
    const button = options.filter({ hasText: answer.title });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(region.getByRole("status")).toContainText("Acertou!");
    await expect(button).toHaveAttribute("aria-pressed", "true");
    for (const option of await options.all())
      await expect(option).toHaveAttribute("aria-disabled", "true");
    await button.press("Enter");
    await expect(region).toContainText(`${(i + 1) * 10} pts`);
    if (i === 0)
      await page.screenshot({
        path: `test-artifacts/emoji-question-${testInfo.project.name}.png`,
        style: ".skip-link { visibility: hidden; }",
        fullPage: true,
      });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await next.click();
  }
  const result = page.getByRole("region", { name: "Resultado do desafio" });
  await expect(result).toContainText("100/100");
  await expect(result).toContainText("10 de 10 músicas");
  await expect(
    result.getByRole("heading", { name: "ARMY Lendária" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Compartilhar resultado" }).click();
  await expect(result.getByRole("status")).toContainText("Texto copiado!");
  expect(
    await page.evaluate(() => (window as Window & { copied?: string }).copied),
  ).toContain("100/100");
  await page.screenshot({
    path: `test-artifacts/emoji-result-${testInfo.project.name}.png`,
    style: ".skip-link { visibility: hidden; }",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Jogar novamente" }).click();
  await expect(
    page.getByRole("region", { name: "Partida do Emoji Challenge" }),
  ).toContainText("Fácil · 0 pts");
  await page.getByRole("button", { name: "Trocar nível" }).click();
  await page
    .getByRole("button", { name: "Jogar Difícil", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Partida do Emoji Challenge" }),
  ).toContainText("Difícil · 0 pts");
  await page.getByRole("button", { name: "Trocar nível" }).click();
  await page.getByRole("button", { name: "Jogar Médio", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Partida do Emoji Challenge" }),
  ).toContainText("Médio · 0 pts");
  expect(errors).toEqual([]);
});

test("erro revela resposta, zero pontos, cópia manual e movimento reduzido", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined });
    Object.defineProperty(navigator, "clipboard", { value: undefined });
  });
  await page.goto("/jogos/emojis");
  await page
    .getByRole("button", { name: "Jogar Difícil", exact: true })
    .click();
  for (let i = 0; i < 10; i++) {
    const description = await page
      .getByRole("region", { name: "Partida do Emoji Challenge" })
      .getByRole("img")
      .getAttribute("aria-label");
    const q = emojiQuestions.find((q) => q.emojiDescription === description)!;
    const options = page
      .getByRole("group", { name: "Alternativas" })
      .getByRole("button");
    await options
      .filter({
        hasText: q.options.find((o) => o.id !== q.correctAnswerId)!.title,
      })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "Quase! A resposta era",
    );
    await options
      .filter({
        hasText: q.options.find((o) => o.id === q.correctAnswerId)!.title,
      })
      .press("Enter");
    await expect(
      page.getByRole("region", { name: "Partida do Emoji Challenge" }),
    ).toContainText("0 pts");
    await page
      .getByRole("button", {
        name: i === 9 ? "Ver resultado" : "Próxima pergunta",
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Baby ARMY", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Compartilhar resultado" }).click();
  await expect(
    page.getByRole("textbox", { name: "Texto do resultado para copiar" }),
  ).toHaveValue(/0\/100/);
  await page.getByRole("button", { name: "Escolher outro nível" }).click();
  await expect(
    page.getByRole("button", { name: "Jogar Fácil", exact: true }),
  ).toBeVisible();
  expect(
    await page
      .getByRole("button", { name: "Jogar Fácil", exact: true })
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
});

test("tela de 320px acomoda todas as pistas difíceis e mantém foco visível", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/jogos/emojis");
  const start = page.getByRole("button", {
    name: "Jogar Difícil",
    exact: true,
  });
  await start.focus();
  expect(await start.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe(
    "solid",
  );
  await start.press("Enter");
  for (let i = 0; i < 10; i++) {
    const region = page.getByRole("region", {
      name: "Partida do Emoji Challenge",
    });
    const description = await region
      .getByRole("img")
      .getAttribute("aria-label");
    const q = emojiQuestions.find((q) => q.emojiDescription === description)!;
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const options = region
      .getByRole("group", { name: "Alternativas" })
      .getByRole("button");
    for (const option of await options.all())
      expect((await option.boundingBox())!.height).toBeGreaterThanOrEqual(48);
    await options
      .filter({
        hasText: q.options.find((o) => o.id === q.correctAnswerId)!.title,
      })
      .click();
    await page
      .getByRole("button", {
        name: i === 9 ? "Ver resultado" : "Próxima pergunta",
      })
      .click();
  }
  await expect(
    page.getByRole("region", { name: "Resultado do desafio" }),
  ).toContainText("100/100");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
