import { Locator, expect, type Page } from "@playwright/test";
import AbstractPage from "./abstractPage";

export default class ItemPage extends AbstractPage {
  protected page: Page;
  readonly itemName: Locator;
  readonly itemDescription: Locator;
  readonly itemPrice: Locator;
  readonly itemImage: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.itemName = page.locator(".inventory_details_name");
    this.itemDescription = page.locator(".inventory_details_desc");
    this.itemPrice = page.locator(".inventory_details_price");
    this.itemImage = page.locator("img.inventory_details_img");
  }

  async goto(id?: string) {
    await this.page.goto(`${process.env.ITEM_PAGE_URL}?id=${id}`);
  }
  async backToProducts() {
    await this.page.getByTestId("back-to-products").click();
    await expect(this.pageTitle).toHaveText("Products");
  }
}
