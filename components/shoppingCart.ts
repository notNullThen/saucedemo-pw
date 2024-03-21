import { Locator, Page, expect } from "@playwright/test";

export default class ShoppingCart {
  protected page: Page;
  readonly body: Locator;
  readonly counter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.body = page.locator("#shopping_cart_container");
    this.counter = page.locator(".shopping_cart_badge");
  }

  async click() {
    await this.body.click();
    await expect(this.page.locator(".title")).toHaveText("Your Cart");
  }
}
