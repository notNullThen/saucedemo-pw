import { type Page } from "@playwright/test";

export default class CartPage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("cart.html");
  }
}
