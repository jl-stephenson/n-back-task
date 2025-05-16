import { Page, expect } from "@playwright/test";

export async function gotoIndex(page: Page) {
  await page.goto("http://localhost:5173/");
}

export async function fillNameAndContinue(page: Page, name = "Test") {
  await page.getByRole("textbox").fill(name);
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page).toHaveURL(/\/intro$/);
}

export async function clickStartGame(page: Page) {
  await page.getByRole("button", { name: /start game/i }).click();
  await expect(page).toHaveURL(/\/task$/);
}
