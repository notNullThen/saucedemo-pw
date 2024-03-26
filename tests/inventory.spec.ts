import { expect, test } from "@playwright/test";
import ProductsPage, { ItemInfo } from "../pages/productsPage";
import ItemPage from "../pages/inventoryItemPage";
import YourCartPage from "../pages/yourCartPage";
import customer from "../fixtures/customer.json";
import calculatePrices from "../support/calculatePrices";
import CheckoutPage from "../pages/checkoutPage";
import getPriceValue from "../support/getPriceValue";
import formatPrice from "../support/formatPrice";
import assert from "assert";

/**
 * @issue
 * Go to /inventory.html
 * Click item "Add to cart" button
 *  See the Shopping cart "1" counter appears
 * Click the Shopping cart
 *  See the title is "Your Cart"
 *  See the Shopping cart has "1" counter
 *  See Item Name, Price & Description are valid
 * Click "Checkout" button
 *  See the title is "Checkout: Your Information"
 * Fill the required data with valid details
 * Click "Continue" button
 *  See no error message appears
 *  See the title is "Checkout: Overview"
 *  See the Shopping cart has "1" counter
 *  See Item Name, Price & Description are valid
 *  See product has correct price and tax
 * Click "Finish" button
 *  See the title is "Checkout: Complete!"
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

  // Go to /inventory.html
  await productsPage.goto();

  await test.step("Add item to cart", async () => {
    inventoryItem.name = await productsPage.itemDetails.itemsNames.first().textContent();
    assert(inventoryItem.name, `There's no name received`);
    inventoryItem.description = await productsPage.itemDetails.itemsDescriptions.first().textContent();
    assert(inventoryItem.description, `There's no description received`);
    inventoryItem.price = await productsPage.itemDetails.itemsPrices.first().textContent();
    assert(inventoryItem.price, `There's no price received`);

    // Click item "Add to cart" button
    //  See the Shopping cart "1" counter appears
    await productsPage.addItemToCart(0);
  });

  await test.step("Go to shopping cart and validate product details", async () => {
    // Click the Shopping cart
    //  See the title is "Your Cart"
    await productsPage.shoppingCart.click();
    //  See the Shopping cart has "1" counter
    await expect(productsPage.shoppingCart.counter).toHaveText("1");
    cartItem.name = await yourCartPage.itemDetails.itemsNames.textContent();
    cartItem.description = await yourCartPage.itemDetails.itemsDescriptions.textContent();
    cartItem.price = await yourCartPage.itemDetails.itemsPrices.textContent();
    //  See Item Name, Price & Description are valid
    expect(cartItem.name).toEqual(inventoryItem.name);
    expect(cartItem.description).toEqual(inventoryItem.description);
    expect(cartItem.price).toEqual(inventoryItem.price);
  });

  await test.step("Go to Checkout page and fill the required fields", async () => {
    // Click "Checkout" button
    //  See the title is "Checkout: Your Information"
    await yourCartPage.checkout();
    // Fill the required data with valid details
    await checkoutPage.yourInformation.fillData(customer);
  });

  await test.step(`Click "Continue" button and validate shopping cart counter`, async () => {
    // Click "Continue" button
    //  See no error message appears
    //  See the title is "Checkout: Overview"
    await checkoutPage.yourInformation.continue();
    //  See the Shopping cart has "1" counter
    await expect(productsPage.shoppingCart.counter).toHaveText("1");
  });
  await test.step(`Validate product & pricing details`, async () => {
    //  See Item Name, Price & Description are valid
    checkoutItem.name = await yourCartPage.itemDetails.itemsNames.textContent();
    checkoutItem.description = await yourCartPage.itemDetails.itemsDescriptions.textContent();
    checkoutItem.price = await yourCartPage.itemDetails.itemsPrices.textContent();
    expect(checkoutItem.name).toEqual(inventoryItem.name);
    expect(checkoutItem.description).toEqual(inventoryItem.description);
    expect(checkoutItem.price).toEqual(inventoryItem.price);

    //  See product has correct price and tax
    const { taxPrice, priceWithTax } = calculatePrices(inventoryItem.price);
    expect(await checkoutPage.overview.totalPrice).toContain(inventoryItem.price);
    expect(await checkoutPage.overview.taxPrice).toContain(formatPrice(taxPrice));
    expect(await checkoutPage.overview.totalPriceWithTax).toContain(formatPrice(priceWithTax));
  });

  await test.step(`Finish the order and go to Inventory page`, async () => {
    // Click "Finish" button
    //  See the title is "Checkout: Complete!"
    await checkoutPage.overview.finish();
    //  See the checkout greeting appears and has proper text
    await expect(checkoutPage.completed.checkoutGreeting).toContainText("Thank you for your order!");
    await expect(checkoutPage.completed.checkoutGreeting).toContainText(
      "Your order has been dispatched, and will arrive just as fast as the pony can get there!",
    );
    // Click "Back home" button
    //  See the page title is "Products"
    await checkoutPage.completed.backHome();
  });
});

/**
 * @issue
 * Go to /inventory.html
 * Click "Add to cart" button for each item
 *  See the Shopping cart counter increases
 * Click the Shopping cart
 *  See the title is "Your Cart"
 *  See the Shopping cart counter didn't change
 *  See Item Name, Price & Description are valid
 * Click "Checkout" button
 *  See the title is "Checkout: Your Information"
 * Fill the required data with valid details
 * Click "Continue" button
 *  See no error message appears
 *  See the title is "Checkout: Overview"
 *  See the Shopping cart counter didn't change
 *  See Item Name, Price & Description are valid
 * Sum the total price value
 *  See product has correct price and tax
 * Click "Finish" button
 *  See the title is "Checkout: Complete!"
 *  See the checkout greeting appears and has proper text
 * Click "Back home" button
 *  See the page title is "Products"
 */
test("User should be able to buy multiple items", async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const yourCartPage = new YourCartPage(page);
  const checkoutPage = new CheckoutPage(page);

  const inventoryItems: ItemInfo[] = [];

  // Go to /inventory.html
  await productsPage.goto();
  const itemsCount = await productsPage.items.count();

  await test.step(`Add all items to cart`, async () => {
    for (let index = 0; index < itemsCount; index++) {
      // Click "Add to cart" button for each item
      //  See the Shopping cart counter increases
      await productsPage.addItemToCart(index);
      const name = await productsPage.itemDetails.getItemName(index);
      assert(name, `There's no name received`);
      const description = await productsPage.itemDetails.getItemDescription(index);
      assert(description, `There's no description received`);
      const price = await productsPage.itemDetails.getItemPrice(index);
      assert(price, `There's no price received`);

      inventoryItems.push({ name, description, price });
    }
  });

  await test.step(`Go to shopping cart and validate details`, async () => {
    // Click the Shopping cart
    //  See the title is "Your Cart"
    await productsPage.shoppingCart.click();
    //  See the Shopping cart counter didn't change
    expect(await yourCartPage.shoppingCart.getCounterNumber()).toEqual(itemsCount);
    for (let index = 0; index < itemsCount; index++) {
      const name = await yourCartPage.itemDetails.getItemName(index);
      const description = await yourCartPage.itemDetails.getItemDescription(index);
      const price = await yourCartPage.itemDetails.getItemPrice(index);
      //  See Item Name, Price & Description are valid
      try {
        expect(inventoryItems[index].name).toEqual(name);
        expect(inventoryItems[index].description).toEqual(description);
        expect(inventoryItems[index].price).toEqual(price);
      } catch (error) {
        throw new Error(`Item #${index + 1} Shopping cart page details differ from Products page details`);
      }
    }

    await test.step(`Go to Checkout page and fill the required fields`, async () => {
      // Click "Checkout" button
      //  See the title is "Checkout: Your Information"
      await yourCartPage.checkout();
      // Fill the required data with valid details
      await checkoutPage.yourInformation.fillData(customer);
    });

    await test.step(`Click "Continue" button and validate shopping cart counter`, async () => {
      // Click "Continue" button
      //  See no error message appears
      //  See the title is "Checkout: Overview"
      await checkoutPage.yourInformation.continue();
      //  See the Shopping cart counter didn't change
      expect(await checkoutPage.shoppingCart.getCounterNumber()).toEqual(itemsCount);
    });

    await test.step(`Validate product & pricing details`, async () => {
      let totalPrice = 0;
      for (let index = 0; index < itemsCount; index++) {
        const name = await checkoutPage.overview.itemDetails.getItemName(index);
        const description = await checkoutPage.overview.itemDetails.getItemDescription(index);
        const price = await checkoutPage.overview.itemDetails.getItemPrice(index);
        //  See Item Name, Price & Description are valid
        try {
          expect(inventoryItems[index].name).toEqual(name);
          expect(inventoryItems[index].description).toEqual(description);
          expect(inventoryItems[index].price).toEqual(price);
        } catch (error) {
          throw new Error(`Item #${index + 1} Checkout page details differ from Products page details`);
        }
        // Sum the total price value
        totalPrice += getPriceValue(price);
      }

      const { priceWithTax, taxPrice } = calculatePrices(totalPrice);
      //  See product has correct price and tax
      expect(await checkoutPage.overview.totalPrice).toContain(formatPrice(totalPrice));
      expect(await checkoutPage.overview.taxPrice).toContain(formatPrice(taxPrice));
      expect(await checkoutPage.overview.totalPriceWithTax).toContain(formatPrice(priceWithTax));
    });

    await test.step(`Finish the order and go to Inventory page`, async () => {
      // Click "Finish" button
      //  See the title is "Checkout: Complete!"
      await checkoutPage.overview.finish();
      //  See the checkout greeting appears and has proper text
      await expect(checkoutPage.completed.checkoutGreeting).toContainText("Thank you for your order!");
      await expect(checkoutPage.completed.checkoutGreeting).toContainText(
        "Your order has been dispatched, and will arrive just as fast as the pony can get there!",
      );
      // Click "Back home" button
      //  See the page title is "Products"
      await checkoutPage.completed.backHome();
    });
  });
});

/**
 * @issue
 * Navigate to /inventory.html
 * Get item Name, Description, Price & Image URL
 * Click item name
 *  See Item Name, Image URL & Description are valid
 * Click the "Back to products" button
 *  See the page title is "Products"
 * Repeat the previous steps for all products
 */
test("All items details should correspond to its details page", async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const inventoryItemPage = new ItemPage(page);
  // Navigate to /inventory.html
  await productsPage.goto();
  const itemsCount = await productsPage.items.count();

  for (let index = 0; index < itemsCount; index++) {
    await test.step(`The item #${index + 1} details should correspond to its details page`, async () => {
      // Get item Name, Description, Price & Image URL
      const itemName = await productsPage.itemDetails.itemsNames.nth(index).textContent();
      assert(itemName, `There's no item name received`);
      const itemDescription = await productsPage.itemDetails.itemsDescriptions.nth(index).textContent();
      assert(itemDescription, `There's no item description received`);
      const itemPrice = await productsPage.itemDetails.itemsPrices.nth(index).textContent();
      assert(itemPrice, `There's no item price received`);
      const itemImageURL = await productsPage.itemDetails.itemsImages.nth(index).getAttribute("src");
      assert(itemImageURL, `There's no item image URL received`);
      // Click item name
      await productsPage.itemDetails.itemsNames.nth(index).click();

      //  See Item Name, Image URL & Description are valid
      const itemDetailsName = await inventoryItemPage.itemName.textContent();
      const itemDetailsDescription = await inventoryItemPage.itemDescription.textContent();
      const itemDetailsPrice = await inventoryItemPage.itemPrice.textContent();
      const itemDetailsImageURL = await inventoryItemPage.itemImage.getAttribute("src");
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
