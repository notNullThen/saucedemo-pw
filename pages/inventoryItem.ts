import { Locator, type Page } from "@playwright/test";

export default class InventoryItemPage {
  protected page: Page;
  readonly itemName: Locator;
  readonly itemDescription: Locator;
  readonly itemPrice: Locator;
  readonly itemImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemName = page.locator(".inventory_details_name");
    this.itemDescription = page.locator(".inventory_details_desc");
    this.itemPrice = page.locator(".inventory_details_price");
    this.itemImage = page.locator("img.inventory_details_img");
  }

  async goto(id?: string) {
    await this.page.goto(`inventory-item.html?id=${id}`);
  }
}
