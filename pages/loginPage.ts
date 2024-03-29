import { Locator, expect, type Page } from "@playwright/test";

export default class LoginPage {
  protected page: Page;
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessageContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userNameInput = page.getByTestId("username");
    this.passwordInput = page.getByTestId("password");
    this.errorMessageContainer = page.getByTestId("error");
    this.loginButton = page.getByTestId("login-button");
  }

  messages = {
    invalidCredentials: "Epic sadface: Username and password do not match any user in this service",
    lockedOutUserCredentials: "Epic sadface: Sorry, this user has been locked out.",
    loggedOutProductsPageNavigate: `Epic sadface: You can only access '/${process.env.PRODUCTS_PAGE_URL}'
    when you are logged in.`,
    loggedOutItemPageNavigate: `Epic sadface: You can only access '/${process.env.ITEM_PAGE_URL}'
    when you are logged in.`,
    loggedOutCartPageNavigate: `Epic sadface: You can only access '/${process.env.YOUR_CART_PAGE_URL}'
    when you are logged in.`,
    loggedOutCheckoutPageNavigate: `Epic sadface: You can only access '/${process.env.CHECKOUT_PAGE_URL}'
    when you are logged in.`,
    userNameIsRequired: `Epic sadface: Username is required`,
    passwordIsRequired: `Epic sadface: Password is required`,
  };

  async goto() {
    await this.page.goto("/");
  }
  async login({ userName, password }: { userName: string; password: string }) {
    const userNameInputPlaceholder = await this.userNameInput.getAttribute("placeholder");
    const passwordInputPlaceholder = await this.passwordInput.getAttribute("placeholder");
    await this.goto();
    expect(userNameInputPlaceholder).toEqual("Username");
    await this.userNameInput.fill(userName);
    expect(passwordInputPlaceholder).toEqual("Password");
    await this.passwordInput.fill(password);

    await this.loginButton.click();
  }
  async closeErrorMessage() {
    await this.errorMessageContainer.locator(".error-button").click();
    await expect(this.errorMessageContainer).not.toBeAttached();
  }
}
