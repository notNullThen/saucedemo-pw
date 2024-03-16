import { test } from "@playwright/test";
import { login } from "../support/login";

test("test", async ({ page }) => {
  await page.goto("/");
  await login(page);
  await page.pause();
});
