import { type Page, expect } from "@playwright/test";

export async function login(page: Page) {
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
  await expect(page.locator(".header_secondary_container")).toBeVisible();
}
