import { Locator, Page } from "@playwright/test";
import ShoppingCart from "../components/shoppingCart";

export default abstract class AbstractPage {
  protected page: Page;
  readonly shoppingCart: ShoppingCart;
  readonly pageTitle: Locator;
  constructor(page: Page) {
    this.page = page;
    this.shoppingCart = new ShoppingCart(page);
    this.pageTitle = page.locator(".title");
  }
}
