import { expect, test } from "@playwright/test";

test("Mural mostra formulário e não permite publicar sem Turnstile configurado", async ({
  page,
}) => {
  await page.goto("/mural");
  await expect(
    page.getByRole("heading", { name: "Deixe seu carinho" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Mural da comunidade" }),
  ).toBeVisible();
  await expect(
    page.getByText("A verificação de segurança ainda não foi configurada."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Publicar mensagem 💜" }),
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("área administrativa solicita autenticação e permanece responsiva", async ({
  page,
}) => {
  await page.goto("/admin/mural");
  await expect(
    page.getByRole("heading", { name: "Acesso da equipe" }),
  ).toBeVisible();
  await expect(page.getByLabel("E-mail da equipe")).toBeVisible();
  await expect(page.getByLabel("Senha")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Entrar na moderação" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
