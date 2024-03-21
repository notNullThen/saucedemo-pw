import { test as setup, expect } from "@playwright/test";
import LoginPage from "../pages/loginPage";
import ProductsPage from "../pages/productsPage";

const authFile = "playwright/.auth/user.json";

setup("Authentication setup", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login({
    userName: process.env.STANDARD_USER_NAME!,
    password: process.env.PASSWORD!,
  });
  await expect(new ProductsPage(page).sortContainer).toBeVisible();
  await page.context().storageState({ path: authFile });
});
