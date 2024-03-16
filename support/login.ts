import { type Page } from "@playwright/test";
import LoginPage from "../pages/login";

export async function login(
  page: Page,
  { userName, password }: { userName: string; password: string }
) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login({ userName, password });
}
