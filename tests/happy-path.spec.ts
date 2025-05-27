import { test, expect } from "@playwright/test";

test("happy path to results", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("textbox").fill("Test");
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page).toHaveURL(/\/intro$/);

  await page.getByRole("button", { name: /start game/i }).click();
  await expect(page).toHaveURL(/\/task$/);

  await expect(page.getByTestId("display-letter")).toHaveText(/^[A-Z]$/);

  await expect(page).toHaveURL(/\/results$/);

  await expect(page.getByText("Total Correct: 0")).toBeVisible();
  await expect(page.getByText("Total False Alarms: 0")).toBeVisible();
  await expect(page.getByText("Total Misses: 2")).toBeVisible();
});
