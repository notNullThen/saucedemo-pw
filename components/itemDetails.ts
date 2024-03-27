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

  async getName(index = 0) {
    return await this.itemsNames.nth(index).textContent();
  }
  async getDescription(index = 0) {
    return await this.itemsDescriptions.nth(index).textContent();
  }
  async getPrice(index = 0) {
    return await this.itemsPrices.nth(index).textContent();
  }
  async getImageURL(index = 0) {
    return await this.itemsImages.nth(index).getAttribute("src");
  }
  async getCartQuantity(index = 0) {
    return await this.cartQuantity.nth(index).textContent();
  }
}
