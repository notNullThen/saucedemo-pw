import { expect, test } from "@playwright/test";
import ProductsPage, { ItemInfo } from "../pages/productsPage";
import ItemPage from "../pages/inventoryItemPage";
import YourCartPage from "../pages/yourCartPage";
import customer from "../fixtures/customer.json";
import calculatePrices from "../support/calculatePrices";
import CheckoutPage from "../pages/checkoutPage";

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
  const productsPage = new ProductsPage(page);
  const yourCartPage = new YourCartPage(page);
  const checkoutPage = new CheckoutPage(page);

  const inventoryItem: ItemInfo = { name: "", description: "", price: "" };
  const cartItem: ItemInfo = { name: "", description: "", price: "" };
  const checkoutItem: ItemInfo = { name: "", description: "", price: "" };

  await test.step("Add item to cart", async () => {
    // Go to /inventory.html
    await productsPage.goto();
    //  See Item Name, Description, Price & Image URL are valid
    inventoryItem.name = await productsPage.itemDetails.itemsNames
      .first()
      .textContent();
    inventoryItem.description = await productsPage.itemDetails.itemsDescriptions
      .first()
      .textContent();
    inventoryItem.price = await productsPage.itemDetails.itemsPrices
      .first()
      .textContent();

    // Click item "Add to cart" button
    await productsPage.addItemToCart(0);
    //  See the Shopping cart "1" counter appears
    await expect(productsPage.shoppingCart.counter).toHaveText("1");
  });

  await test.step("Go to shopping cart and validate product details", async () => {
    // Click the Shopping cart
    await productsPage.shoppingCart.click();
    //  See the Shopping cart has "1" counter
    await expect(productsPage.shoppingCart.counter).toHaveText("1");
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
      await expect(productsPage.shoppingCart.counter).toHaveText("1");
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
test("User should be able to buy multiple items", async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const yourCartPage = new YourCartPage(page);
  const inventoryItems: ItemInfo[] = [];

  await productsPage.goto();
  const itemsCount = await productsPage.items.count();

  await test.step(`Add all items to basket`, async () => {
    for (let index = 0; index < itemsCount; index++) {
      await productsPage.addItemToCart(index);
      const name = await productsPage.itemDetails.getItemName(index);
      const description =
        await productsPage.itemDetails.getItemDescription(index);
      const price = await productsPage.itemDetails.getItemPrice(index);

      inventoryItems.push({ name, description, price });
    }
  });

  await test.step(`Go to shopping cart and validate details`, async () => {
    await productsPage.shoppingCart.click();

    for (let index = 0; index < itemsCount; index++) {
      const name = await yourCartPage.itemDetails.getItemName(index);
      const description =
        await yourCartPage.itemDetails.getItemDescription(index);
      const price = await yourCartPage.itemDetails.getItemPrice(index);

      try {
        expect(inventoryItems[index].name).toEqual(name);
        expect(inventoryItems[index].description).toEqual(description);
        expect(inventoryItems[index].price).toEqual(price);
      } catch (error) {
        throw new Error(
          `Item #${index + 1} Shopping cart page details differ from Products page details`
        );
      }
    }
  });
});

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
  const productsPage = new ProductsPage(page);
  const inventoryItemPage = new ItemPage(page);
  // Navigate to /inventory.html
  await productsPage.goto();
  const itemsCount = await productsPage.items.count();

  for (let index = 0; index < itemsCount; index++) {
    await test.step(`The item #${
      index + 1
    } details should correspond to its details page`, async () => {
      // Get item Name, Description, Price & Image URL
      const itemName = await productsPage.itemDetails.itemsNames
        .nth(index)
        .textContent();
      const itemDescription = await productsPage.itemDetails.itemsDescriptions
        .nth(index)
        .textContent();
      const itemPrice = await productsPage.itemDetails.itemsPrices
        .nth(index)
        .textContent();
      const itemImageURL = await productsPage.itemDetails.itemsImages
        .nth(index)
        .getAttribute("src");
      // Click item name
      await productsPage.itemDetails.itemsNames.nth(index).click();

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
