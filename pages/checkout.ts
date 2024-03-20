import { Locator, Page, expect } from "@playwright/test";
import AbstractPage from "./abstractPage";
import ItemDetails from "../components/itemDetails";

class YourInformation extends AbstractPage {
  protected page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.firstNameInput = page.getByTestId("firstName");
    this.lastNameInput = page.getByTestId("lastName");
    this.postalCodeInput = page.getByTestId("postalCode");
    this.errorMessage = page.getByTestId("error");
  }

  async fillData({
    firstName,
    lastName,
    postalCode,
  }: {
    firstName: string;
    lastName: string;
    postalCode: string;
  }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);

    await expect(this.firstNameInput).toHaveValue(firstName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    await expect(this.postalCodeInput).toHaveValue(postalCode);
  }
  async continue() {
    await this.page.getByTestId("continue").click();
    await expect(this.errorMessage).not.toBeAttached();
    await expect(this.pageTitle).toHaveText("Checkout: Overview");
  }
}
class Overview extends AbstractPage {
  protected page: Page;
  readonly itemDetails: ItemDetails;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.itemDetails = new ItemDetails(page);
  }

  get itemTotalPrice() {
    return this.page.locator(".summary_subtotal_label").textContent();
  }
  get itemTaxPrice() {
    return this.page.locator(".summary_tax_label").textContent();
  }
  get itemTotalPriceWithTax() {
    return this.page.locator(".summary_total_label").textContent();
  }

  async finish() {
    await this.page.getByTestId("finish").click();
    await expect(this.pageTitle).toHaveText("Checkout: Complete!");
  }
}
class Completed extends AbstractPage {
  protected page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  get checkoutGreeting() {
    return this.page.locator("#checkout_complete_container");
  }

  async backHome() {
    await this.page.getByTestId("back-to-products").click();
    await expect(this.pageTitle).toHaveText("Products");
  }
}

export default class CheckoutPage extends AbstractPage {
  readonly yourInformation: YourInformation;
  readonly overview: Overview;
  readonly completed: Completed;
  constructor(page: Page) {
    super(page);
    this.yourInformation = new YourInformation(page);
    this.overview = new Overview(page);
    this.completed = new Completed(page);
  }

  async goto() {
    this.page.goto(process.env.CHECKOUT_PAGE_URL!);
    await expect(this.pageTitle).toHaveText("Checkout: Your Information");
  }
}
