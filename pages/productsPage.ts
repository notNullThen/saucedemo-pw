import { Locator, expect, type Page } from "@playwright/test";
import ItemDetails from "../components/itemDetails";
import AbstractPage from "./abstractPage";

export interface ItemInfo {
  name: string | null;
  description: string | null;
  price: string | null;
}

export default class ProductsPage extends AbstractPage {
  protected page: Page;
  readonly sortContainer: Locator;
  readonly itemDetails: ItemDetails;
  readonly items: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.sortContainer = page.getByTestId("product-sort-container");
    this.itemDetails = new ItemDetails(page);
    this.items = page.locator(".inventory_item");
  }

  getAddToCartButton(index: number) {
    return this.items.nth(index).locator(".btn_primary.btn_inventory");
  }
  getRemoveButton(index: number) {
    return this.items.nth(index).locator(".btn_secondary.btn_inventory");
  }

  async goto() {
    await this.page.goto(process.env.PRODUCTS_PAGE_URL!);
    await expect(this.pageTitle).toHaveText("Products");
  }
  async addItemToCart(index: number) {
    const cartCounterBeforeAdd = Number(await this.shoppingCart.body.textContent());
    try {
      await this.getAddToCartButton(index).click();
    } catch (error) {
      throw new Error(`The item #${index + 1} might be already added to cart`);
    }
    const cartCounterAfterAdd = await this.shoppingCart.getCounterNumber();
    expect(cartCounterAfterAdd).toEqual(cartCounterBeforeAdd + 1);
    await expect(this.getRemoveButton(index)).toBeAttached();
  }
  async removeItemFromCart(index: number) {
    const cartCounterBeforeRemove = await this.shoppingCart.getCounterNumber();
    try {
      await this.getRemoveButton(index).click();
    } catch (error) {
      throw new Error(`The item #${index + 1} might be not added to cart`);
    }
    const cartCounterAfterRemove = Number(await this.shoppingCart.body.textContent());
    expect(cartCounterAfterRemove).toEqual(cartCounterBeforeRemove - 1);
  }
}
