import { expect, test } from "@playwright/test";
import { quizCategories } from "../../src/features/bts-quiz/categories";
import { quizQuestions } from "../../src/features/bts-quiz/questions";

for (const category of quizCategories) {
  test(`quiz ${category.slug}: seleção, dez respostas, resultado, compartilhamento e reinício`, async ({
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
            (window as Window & { quizCopy?: string }).quizCopy = text;
          },
        },
      });
    });
    await page.goto("/jogos/quiz");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Quanto você conhece",
    );
    const selection = page.getByRole("region", { name: "Escolha seu quiz" });
    await expect(selection.getByRole("link")).toHaveCount(8);
    if (category.id === "bts") {
      const image = selection
        .getByRole("link", { name: "Começar quiz BTS — OT7", exact: true })
        .getByRole("img");
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
      await page.screenshot({
        path: `test-artifacts/quiz-selection-${testInfo.project.name}.png`,
        fullPage: true,
        style: ".skip-link { visibility: hidden; }",
      });
    }
    const start = selection.getByRole("link", {
      name: `Começar quiz ${category.title}`,
      exact: true,
    });
    await start.focus();
    expect(
      await start.evaluate((el) => getComputedStyle(el).outlineStyle),
    ).toBe("solid");
    await start.press("Enter");
    await expect(page).toHaveURL(new RegExp(`/jogos/quiz/${category.slug}$`));
    await expect(page).toHaveTitle(
      `Quiz de ${category.title} | Army Pass Brasil`,
    );
    const seen = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const region = page.getByRole("region", {
        name: `Partida do quiz ${category.title}`,
        exact: true,
      });
      await expect(region).toContainText(`${i + 1} de 10`);
      const heading = region.getByRole("heading", { level: 1 });
      await expect(heading).toBeFocused();
      const prompt = await heading.textContent();
      const current = quizQuestions.find((q) => q.question === prompt)!;
      expect(current.categoryId).toBe(category.id);
      expect(seen.has(current.id)).toBe(false);
      seen.add(current.id);
      const options = region
        .getByRole("group", { name: "Alternativas" })
        .getByRole("button");
      await expect(options).toHaveCount(4);
      await expect(region.getByRole("status")).toBeEmpty();
      await expect(
        region.getByRole("link", { name: /Consultar a fonte/ }),
      ).toHaveCount(0);
      const next = region.getByRole("button", {
        name: i === 9 ? "Ver resultado" : "Próxima pergunta",
      });
      await expect(next).toBeDisabled();
      // Exercise both paths: OT7 gets 100, each member gets nine correct and one wrong.
      const wrong = category.id !== "bts" && i === 0;
      const answer = current.options.find((o) =>
        wrong
          ? o.id !== current.correctAnswerId
          : o.id === current.correctAnswerId,
      )!;
      const button = options.filter({
        has: page.getByText(answer.title, { exact: true }),
      });
      await button.focus();
      await button.press("Enter");
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(region.getByRole("status")).toContainText(
        wrong ? "Quase!" : "Acertou!",
      );
      await expect(region.getByRole("status")).toContainText(
        current.explanation,
      );
      await expect(
        region.getByRole("link", { name: /Consultar a fonte/ }),
      ).toHaveAttribute("href", current.sourceUrl);
      for (const option of await options.all())
        await expect(option).toHaveAttribute("aria-disabled", "true");
      await button.press("Enter");
      const score = (i + 1 - (category.id === "bts" ? 0 : 1)) * 10;
      await expect(region).toContainText(`${score} pts`);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (category.id === "bts" && i === 0)
        await page.screenshot({
          path: `test-artifacts/quiz-question-${testInfo.project.name}.png`,
          fullPage: true,
          style: ".skip-link { visibility: hidden; }",
        });
      await next.click();
    }
    expect(seen.size).toBe(10);
    const result = page.getByRole("region", { name: "Resultado do quiz" });
    await expect(result).toContainText(
      category.id === "bts" ? "100/100" : "90/100",
    );
    await expect(result).toContainText(`sobre ${category.title}!`);
    await expect(result.getByRole("heading", { level: 1 })).toBeFocused();
    await result
      .getByRole("button", { name: "Compartilhar", exact: true })
      .click();
    await expect(result.getByRole("status")).toContainText(
      "Resultado copiado!",
    );
    const copied = await page.evaluate(
      () => (window as Window & { quizCopy?: string }).quizCopy,
    );
    expect(copied).toContain(`Quiz de ${category.title}`);
    expect(copied).not.toContain("Resposta correta");
    if (category.id === "bts")
      await page.screenshot({
        path: `test-artifacts/quiz-result-${testInfo.project.name}.png`,
        fullPage: true,
        style: ".skip-link { visibility: hidden; }",
      });
    await result.getByRole("button", { name: "Jogar novamente" }).click();
    const replay = page.getByRole("region", {
      name: `Partida do quiz ${category.title}`,
      exact: true,
    });
    await expect(replay).toContainText("1 de 10");
    await expect(replay).toContainText("0 pts");
    await page
      .getByRole("link", { name: "Escolher outro quiz", exact: true })
      .click();
    await expect(page).toHaveURL(/\/jogos\/quiz$/);
    expect(errors).toEqual([]);
  });
}

test("quiz: 320px, zero acertos, cópia manual, resultado e movimento reduzido", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined });
    Object.defineProperty(navigator, "clipboard", { value: undefined });
  });
  await page.goto("/jogos/quiz/jimin");
  for (let i = 0; i < 10; i++) {
    const region = page.getByRole("region", {
      name: "Partida do quiz Jimin",
      exact: true,
    });
    await expect(region).toContainText(`${i + 1} de 10`);
    const text = await region.getByRole("heading", { level: 1 }).textContent();
    const current = quizQuestions.find((q) => q.question === text)!;
    const options = region
      .getByRole("group", { name: "Alternativas" })
      .getByRole("button");
    for (const option of await options.all())
      expect((await option.boundingBox())!.height).toBeGreaterThanOrEqual(48);
    await options
      .filter({
        has: page.getByText(
          current.options.find((o) => o.id !== current.correctAnswerId)!.title,
          { exact: true },
        ),
      })
      .click();
    await options
      .filter({
        has: page.getByText(
          current.options.find((o) => o.id === current.correctAnswerId)!.title,
          { exact: true },
        ),
      })
      .press("Enter");
    await expect(region).toContainText("0 pts");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("button", {
        name: i === 9 ? "Ver resultado" : "Próxima pergunta",
      })
      .click();
  }
  const result = page.getByRole("region", { name: "Resultado do quiz" });
  await expect(result).toContainText("0/100");
  await result
    .getByRole("button", { name: "Compartilhar", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Resultado para copiar" }),
  ).toHaveValue(/0\/100.*Jimin/);
  await result
    .getByRole("link", { name: "Escolher outro quiz", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Escolha seu quiz" }).getByRole("link"),
  ).toHaveCount(8);
  expect(
    await page
      .getByRole("link", { name: "Começar quiz RM", exact: true })
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
});

test("quiz: integração na central e categoria desconhecida", async ({
  page,
}) => {
  await page.goto("/jogos");
  await expect(
    page.getByRole("link", { name: /Emoji Challenge/ }),
  ).toContainText("Adivinhe a música pelos emojis.");
  await page.getByRole("link", { name: /Quiz BTS e Integrantes/ }).click();
  await expect(page).toHaveURL(/\/jogos\/quiz$/);
  await page.goto("/jogos/quiz/unknown-member");
  await expect(
    page.getByRole("region", { name: "Partida do quiz", exact: false }),
  ).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
