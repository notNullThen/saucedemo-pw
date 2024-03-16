import { Locator, type Page } from "@playwright/test";

export default class HomePage {
  protected page: Page;
  readonly sortContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortContainer = page.getByTestId("product_sort_container");
  }

  async goto() {
    await this.page.goto("inventory.html");
  }
}
