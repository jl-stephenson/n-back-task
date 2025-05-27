import { test, expect } from "@playwright/test";

test("happy path to results", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("textbox").fill("Test");
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page).toHaveURL(/\/intro$/);

  await page.clock.install({ time: 0 });

  await page.getByRole("button", { name: /start game/i }).click();
  await expect(page).toHaveURL(/\/task$/);

  const displayMs = Number(process.env.VITE_DISPLAY_MS) || 50;
  const letterMs = Number(process.env.VITE_LETTER_MS) || 100;

  const letter = page.getByTestId("display-letter");
  await expect(letter).toHaveText("A");
  await page.clock.runFor(displayMs);
  await expect(letter).toHaveText("");
  await page.clock.runFor(displayMs);
  await expect(letter).toHaveText("S");
  await page.clock.runFor(letterMs);
  await expect(page.getByTestId("display-letter")).toHaveText("A");
  await page.keyboard.press("m");
  await expect(page.getByText("Correctly identified match")).toBeVisible();

  await expect(page).toHaveURL(/\/results$/);

  await expect(page.getByText("Total Correct: 1")).toBeVisible();
  await expect(page.getByText("Total False Alarms: 0")).toBeVisible();
  await expect(page.getByText("Total Misses: 2")).toBeVisible();
});
