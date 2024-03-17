import { expect, test } from "@playwright/test";
import InventoryPage from "../pages/inventory";
import InventoryItemPage from "../pages/inventoryItem";
import YourCartPage from "../pages/yourCart";
import { faker } from "@faker-js/faker";
import calculatePrices from "../support/calculatePrices";

/**
 * Go to /inventory.html
 *  See Item Name, Description, Price & Image URL are valid
 * Click item "Add to cart" button
 *  See the Shopping cart "1" counter appears
 * Click the Shopping cart
 *  See the Shopping cart has "1" counter
 *  See Item Name, Image URL & Description are valid
 * Fill the required data with valid details
 * Click "Continue" button
 *  See no error message appears
 *  See the Shopping cart has "1" counter
 * See Item Name, Price & Description are valid
 * Validate product price and tax
 * Click "Finish" button
 *  See the checkout greeting appears and has proper text
 * Click "Back home" button
 *  See the page title is "Products"
 */
test("User should be able to buy one item", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const yourCartPage = new YourCartPage(page);

  // Go to /inventory.html
  await inventoryPage.goto();
  //  See Item Name, Description, Price & Image URL are valid
  const itemName = await inventoryPage.itemDetails.itemsNames
    .first()
    .textContent();
  const itemDescription = await inventoryPage.itemDetails.itemsDescriptions
    .first()
    .textContent();
  const itemPrice = await inventoryPage.itemDetails.itemsPrices
    .first()
    .textContent();

  // Click item "Add to cart" button
  await inventoryPage.addToCartButtons.first().click();
  //  See the Shopping cart "1" counter appears
  await expect(inventoryPage.shoppingCart.counter).toHaveText("1");

  // Click the Shopping cart
  await inventoryPage.shoppingCart.click();
  //  See the Shopping cart has "1" counter
  await expect(inventoryPage.shoppingCart.counter).toHaveText("1");
  //  See Item Name, Image URL & Description are valid
  const itemCartName = await yourCartPage.itemDetails.itemsNames.textContent();
  const itemCartDescription =
    await yourCartPage.itemDetails.itemsDescriptions.textContent();
  const itemCartPrice =
    await yourCartPage.itemDetails.itemsPrices.textContent();
  await expect(itemCartName).toEqual(itemName);
  await expect(itemCartDescription).toEqual(itemDescription);
  await expect(itemCartPrice).toEqual(itemPrice);
  await yourCartPage.checkout();

  // Fill the required data with valid details
  await yourCartPage.yourInformation.fillData({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
  });

  // Click "Continue" button
  //  See no error message appears
  await yourCartPage.yourInformation.continue();
  //  See the Shopping cart has "1" counter
  await expect(inventoryPage.shoppingCart.counter).toHaveText("1");
  // See Item Name, Price & Description are valid
  const itemCheckoutName =
    await yourCartPage.itemDetails.itemsNames.textContent();
  const itemCheckoutDescription =
    await yourCartPage.itemDetails.itemsDescriptions.textContent();
  const itemCheckoutPrice =
    await yourCartPage.itemDetails.itemsPrices.textContent();
  await expect(itemCheckoutName).toEqual(itemName);
  await expect(itemCheckoutDescription).toEqual(itemDescription);
  await expect(itemCheckoutPrice).toEqual(itemPrice);

  // Validate product price and tax
  const { taxPriceFormatted, priceWithTaxFormatted } =
    calculatePrices(itemPrice);
  await expect(await yourCartPage.overview.itemTotalPrice).toContain(itemPrice);
  await expect(await yourCartPage.overview.itemTaxPrice).toContain(
    taxPriceFormatted
  );
  await expect(await yourCartPage.overview.itemTotalPriceWithTax).toContain(
    priceWithTaxFormatted
  );

  // Click "Finish" button
  await yourCartPage.overview.finish();
  //  See the checkout greeting appears and has proper text
  await expect(await yourCartPage.completed.checkoutGreeting).toContainText(
    "Thank you for your order!"
  );
  await expect(await yourCartPage.completed.checkoutGreeting).toContainText(
    "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
  );

  // Click "Back home" button
  //  See the page title is "Products"
  await yourCartPage.completed.backHome();
});

// TODO:
/*
test("User should be able to buy multiple items", async ({ page }) => {
  // Validate Cart prices summing
});
*/

/**
 * Navigate to /inventory.html
 * Get item Name, Description, Price & Image URL
 * Click item name
 *  See Item Name, Image URL & Description are valid
 * Click the "Back to products" button
 *  See the page title is "Products"
 * Repeat for all products
 */
test("All items details should correspond to its details page", async ({
  page,
}) => {
  const inventoryPage = new InventoryPage(page);
  const inventoryItemPage = new InventoryItemPage(page);

  // Navigate to /inventory.html
  await inventoryPage.goto();
  const itemsCount = await page.locator(".inventory_item").count();

  for (let index = 0; index < itemsCount; index++) {
    // Get item Name, Description, Price & Image URL
    const itemName = await inventoryPage.itemDetails.itemsNames
      .nth(index)
      .textContent();
    const itemDescription = await inventoryPage.itemDetails.itemsDescriptions
      .nth(index)
      .textContent();
    const itemPrice = await inventoryPage.itemDetails.itemsPrices
      .nth(index)
      .textContent();
    const itemImageURL = await inventoryPage.itemDetails.itemsImages
      .nth(index)
      .getAttribute("src");
    // Click item name
    await inventoryPage.itemDetails.itemsNames.nth(index).click();

    //  See Item Name, Image URL & Description are valid
    const itemDetailsName = await inventoryItemPage.itemName.textContent();
    const itemDetailsDescription =
      await inventoryItemPage.itemDescription.textContent();
    const itemDetailsPrice = await inventoryItemPage.itemPrice.textContent();
    const itemDetailsImageURL = await inventoryItemPage.itemImage.getAttribute(
      "src"
    );
    await expect(itemDetailsName).toEqual(itemName);
    await expect(itemDetailsDescription).toEqual(itemDescription);
    await expect(itemDetailsPrice).toEqual(itemPrice);
    await expect(itemDetailsImageURL).toEqual(itemImageURL);
    // Click the "Back to products" button
    //  See the page title is "Products"
    await inventoryPage.backToProducts();
    // Repeat for all products
  }
});
