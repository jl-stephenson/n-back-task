import { test, expect } from "@playwright/test";
import { clickStartGame, fillNameAndContinue, gotoIndex } from "./helpers";

test("happy path to task", async ({ page }) => {
  await gotoIndex(page);
  await fillNameAndContinue(page);
  await clickStartGame(page);

  await expect(page.getByTestId("display-letter")).toHaveText(/^[A-Z]$/);
});
