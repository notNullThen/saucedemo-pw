import { expect, test } from "@playwright/test";
import HomePage from "../pages/home";
import { login } from "../support/login";
import { env } from "process";

test("log in with standard user credentials", async ({ page }) => {
  const homePage = new HomePage(page);

  // Navigate to https://www.saucedemo.com/
  // Fill the "Username" and "Password" fields with valid credentials
  await login(page, {
    userName: env.STANDARD_USER_NAME as string,
    password: env.PASSWORD as string,
  });

  //  See the sort container appears
  await expect(homePage.sortContainer).toBeVisible();
});
