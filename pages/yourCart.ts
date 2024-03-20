import { expect, type Page } from "@playwright/test";
import ItemDetails from "../components/itemDetails";
import AbstractPage from "./abstractPage";

export default class YourCartPage extends AbstractPage {
  protected page: Page;
  readonly itemDetails: ItemDetails;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.itemDetails = new ItemDetails(page);
  }

  async goto() {
    await this.page.goto(process.env.YOUR_CART_PAGE_URL!);
    await expect(this.pageTitle).toHaveText("Your Cart");
  }
  async checkout() {
    await this.page.getByTestId("checkout").click();
    await expect(this.pageTitle).toHaveText("Checkout: Your Information");
  }
}
