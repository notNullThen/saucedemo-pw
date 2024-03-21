import { expect, test } from "@playwright/test";
import InventoryPage from "../pages/inventory";
import InventoryItemPage from "../pages/inventoryItem";
import YourCartPage from "../pages/yourCart";
import customer from "../fixtures/customer.json";
import calculatePrices from "../support/calculatePrices";
import CheckoutPage from "../pages/checkout";

const errorMessages = {
  shoppingCartCounterNumberError: `Shopping cart counter didn't show the correct number after user added the item to cart`,
};

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
 *  See Item Name, Price & Description are valid
 *  See product has correct price and tax
 * Click "Finish" button
 *  See the checkout greeting appears and has proper text
 * Click "Back home" button
 *  See the page title is "Products"
 */
test("User should be able to buy one item", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const yourCartPage = new YourCartPage(page);
  const checkoutPage = new CheckoutPage(page);
  interface ItemDetails {
    name: string | null;
    description: string | null;
    price: string | null;
  }
  const inventoryItem: ItemDetails = { name: "", description: "", price: "" };
  const cartItem: ItemDetails = { name: "", description: "", price: "" };
  const checkoutItem: ItemDetails = { name: "", description: "", price: "" };

  await test.step("Add item to cart", async () => {
    // Go to /inventory.html
    await inventoryPage.goto();
    //  See Item Name, Description, Price & Image URL are valid
    inventoryItem.name = await inventoryPage.itemDetails.itemsNames
      .first()
      .textContent();
    inventoryItem.description =
      await inventoryPage.itemDetails.itemsDescriptions.first().textContent();
    inventoryItem.price = await inventoryPage.itemDetails.itemsPrices
      .first()
      .textContent();

    // Click item "Add to cart" button
    await inventoryPage.addToCartButtons.first().click();
    //  See the Shopping cart "1" counter appears
    await expect(inventoryPage.shoppingCart.counter).toHaveText("1");
  });

  await test.step("Go to shopping cart and validate product details", async () => {
    // Click the Shopping cart
    await inventoryPage.shoppingCart.click();
    //  See the Shopping cart has "1" counter
    await expect(inventoryPage.shoppingCart.counter).toHaveText("1");
    //  See Item Name, Image URL & Description are valid
    cartItem.name = await yourCartPage.itemDetails.itemsNames.textContent();
    cartItem.description =
      await yourCartPage.itemDetails.itemsDescriptions.textContent();
    cartItem.price = await yourCartPage.itemDetails.itemsPrices.textContent();
    expect(cartItem.name).toEqual(inventoryItem.name);
    expect(cartItem.description).toEqual(inventoryItem.description);
    expect(cartItem.price).toEqual(inventoryItem.price);
    await yourCartPage.checkout();
  });

  await test.step("Fill the required data with valid details", async () => {
    // If you want to use "faker-js", use the commented block instead of fixture usage
    /* await checkoutPage.yourInformation.fillData({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode(),
    }); */
    await checkoutPage.yourInformation.fillData(customer);
  });

  await test.step("Validate shopping cart counter behavoir", async () => {
    // Click "Continue" button
    //  See no error message appears
    await checkoutPage.yourInformation.continue();
    //  See the Shopping cart has "1" counter
    try {
      await expect(inventoryPage.shoppingCart.counter).toHaveText("1");
    } catch (error) {
      throw new Error(errorMessages.shoppingCartCounterNumberError);
    }
  });
  await test.step(`Validate product details, finish the order and go to Inventory page`, async () => {
    //  See Item Name, Price & Description are valid
    checkoutItem.name = await yourCartPage.itemDetails.itemsNames.textContent();
    checkoutItem.description =
      await yourCartPage.itemDetails.itemsDescriptions.textContent();
    checkoutItem.price =
      await yourCartPage.itemDetails.itemsPrices.textContent();
    expect(checkoutItem.name).toEqual(inventoryItem.name);
    expect(checkoutItem.description).toEqual(inventoryItem.description);
    expect(checkoutItem.price).toEqual(inventoryItem.price);

    //  See product has correct price and tax
    const { taxPriceFormatted, priceWithTaxFormatted } = calculatePrices(
      inventoryItem.price
    );
    expect(await checkoutPage.overview.itemTotalPrice).toContain(
      inventoryItem.price
    );
    expect(await checkoutPage.overview.itemTaxPrice).toContain(
      taxPriceFormatted
    );
    expect(await checkoutPage.overview.itemTotalPriceWithTax).toContain(
      priceWithTaxFormatted
    );

    // Click "Finish" button
    await checkoutPage.overview.finish();
    //  See the checkout greeting appears and has proper text
    await expect(checkoutPage.completed.checkoutGreeting).toContainText(
      "Thank you for your order!"
    );
    await expect(checkoutPage.completed.checkoutGreeting).toContainText(
      "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
    );
    // Click "Back home" button
    //  See the page title is "Products"
    await checkoutPage.completed.backHome();
  });
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
 * Repeat the previous steps for all products
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
    await test.step(`The item #${
      index + 1
    } details should correspond to its details page`, async () => {
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
      const itemDetailsImageURL =
        await inventoryItemPage.itemImage.getAttribute("src");
      expect(itemDetailsName).toEqual(itemName);
      expect(itemDetailsDescription).toEqual(itemDescription);
      expect(itemDetailsPrice).toEqual(itemPrice);
      expect(itemDetailsImageURL).toEqual(itemImageURL);
      // Click the "Back to products" button
      //  See the page title is "Products"
      await inventoryItemPage.backToProducts();
      // Repeat the previous steps for all products
    });
  }
});
