import { test, expect } from "@playwright/test";

test("happy path to correct results", async ({ page }) => {
  await page.clock.install({ time: new Date("2024-01-01T00:00:00Z") });

  await page.goto("http://localhost:5173/");

  await page.getByRole("textbox").fill("Test");
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page).toHaveURL(/\/intro$/);

  await page.clock.pauseAt(new Date("2024-01-01T08:00:00"));

  await page.getByRole("button", { name: /start game/i }).click();

  await expect(page).toHaveURL(/\/task$/);

  const displayMs = 50;
  const letterMs = 100;

  const letter = page.getByTestId("display-letter");

  // Position 0: A - check Letter Hide
  await expect(letter).toHaveText("A");
  await page.clock.runFor(displayMs);
  await expect(letter).toHaveText("");
  await page.clock.runFor(letterMs - displayMs);

  // Position 1: B
  await expect(letter).toHaveText("B");
  await page.clock.runFor(letterMs);

  // Position 2: A - Correct
  await expect(letter).toHaveText("A");
  await page.keyboard.press("m");
  await expect(page.getByText("Correctly identified match")).toBeVisible();
  await page.clock.runFor(letterMs);

  // Position 3: C - False Alarm
  await expect(letter).toHaveText("C");
  await page.keyboard.press("m");
  await expect(page.getByText("False alarm")).toBeVisible();
  await page.clock.runFor(letterMs);

  // Position 4: A - Miss
  await expect(letter).toHaveText("A");
  await page.clock.runFor(letterMs);
  await expect(page.getByText("Missed match")).toBeVisible();

  await expect(page).toHaveURL(/\/results$/);

  await expect(page.getByText("Total Correct: 1")).toBeVisible();
  await expect(page.getByText("Total False Alarms: 1")).toBeVisible();
  await expect(page.getByText("Total Misses: 1")).toBeVisible();
});
