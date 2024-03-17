import { Locator, expect, type Page } from "@playwright/test";
import ItemDetails from "../components/itemDetails";
import AbstractPage from "./abstractPage";

export default class InventoryPage extends AbstractPage {
  protected page: Page;
  readonly sortContainer: Locator;
  readonly itemDetails: ItemDetails;
  readonly addToCartButtons: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.sortContainer = page.getByTestId("product_sort_container");
    this.itemDetails = new ItemDetails(page);
    this.addToCartButtons = page.getByTestId("add-to-cart-sauce-labs-backpack");
    this.items = page.locator(".inventory_item");
  }

  async goto() {
    await this.page.goto("inventory.html");
  }
  async backToProducts() {
    await this.page.getByTestId("back-to-products").click();
    await expect(await this.pageTitle).toHaveText("Products");
  }
}
