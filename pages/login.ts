import { Locator, expect, type Page } from "@playwright/test";

export default class LoginPage {
  protected page: Page;
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userNameInput = page.getByTestId("username");
    this.passwordInput = page.getByTestId("password");
  }

  async goto() {
    await this.page.goto("/");
  }
  async login({ userName, password }: { userName: string; password: string }) {
    const userNameInputPlaceholder = await this.userNameInput.getAttribute(
      "placeholder"
    );
    const passwordInputPlaceholder = await this.passwordInput.getAttribute(
      "placeholder"
    );
    await this.goto();
    await expect(userNameInputPlaceholder).toEqual("Username");
    await this.userNameInput.fill(userName);
    await expect(passwordInputPlaceholder).toEqual("Password");
    await this.passwordInput.fill(password);

    await this.page.getByTestId("login-button").click();
  }
}
