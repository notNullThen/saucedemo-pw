import { Locator, Page } from "@playwright/test";

export default class ItemDetails {
  protected page: Page;
  readonly itemsNames: Locator;
  readonly itemsDescriptions: Locator;
  readonly itemsPrices: Locator;
  readonly itemsImages: Locator;
  readonly cartQuantity: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemsNames = page.locator(".inventory_item_name");
    this.itemsDescriptions = page.locator(".inventory_item_desc");
    this.itemsPrices = page.locator(".inventory_item_price");
    this.itemsImages = page.locator("img.inventory_item_img");
    this.cartQuantity = page.locator(".cart_quantity");
  }

  getItemName(index: number) {
    return this.itemsNames.nth(index).textContent();
  }
  async getItemDescription(index: number) {
    return await this.itemsDescriptions.nth(index).textContent();
  }
  getItemPrice(index: number) {
    return this.itemsPrices.nth(index).textContent();
  }
  getItemImage(index: number) {
    return this.itemsImages.nth(index).textContent();
  }
  getCartQuantity(index: number) {
    return this.cartQuantity.nth(index).textContent();
  }
}
