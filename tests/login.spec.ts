import { expect, test } from "@playwright/test";
import InventoryPage from "../pages/inventory";
import LoginPage from "../pages/login";
import InventoryItemPage from "../pages/inventoryItem";
import CartPage from "../pages/cart";

test("Log in with standard user credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  await page.context().clearCookies();

  // Navigate to https://www.saucedemo.com/
  await loginPage.goto();
  // Fill the "Username" and "Password" fields with valid credentials
  await loginPage.login({
    userName: process.env.STANDARD_USER_NAME!,
    password: process.env.PASSWORD!,
  });
  //  See the sort container appears
  await expect(inventoryPage.sortContainer).toBeVisible();
});

test("Log in with valid user name and INVALID password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  // Navigate to https://www.saucedemo.com/
  // Set the valid "Username" and INVALID "Password" credentials
  await loginPage.goto();
  await loginPage.login({
    userName: process.env.STANDARD_USER_NAME!,
    password: "wrongPassword",
  });
  //  See the "Epic sadface: Username and password do not match any user in this service" error message appears
  await expect(loginPage.errorMessageContainer).toHaveText(
    loginPage.messages.invalidCredentials
  );
  // Click the error message Clode (X) button
  //  See the error message disappears
  await loginPage.closeErrorMessage();
});

test("Log in with INVALID user name and valid password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  // Navigate to https://www.saucedemo.com/
  // Set the valid "Username" and INVALID "Password" credentials
  await loginPage.goto();
  await loginPage.login({
    userName: "wrongUserName",
    password: process.env.PASSWORD!,
  });
  //  See the "Epic sadface: Username and password do not match any user in this service" error message appears
  await expect(loginPage.errorMessageContainer).toHaveText(
    loginPage.messages.invalidCredentials
  );
  // Click the error message Clode (X) button
  //  See the error message disappears
  await loginPage.closeErrorMessage();
});

test("Log in with locked out valid user credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  // Navigate to https://www.saucedemo.com/
  // Set the valid "Username" and INVALID "Password" credentials
  await loginPage.goto();
  await loginPage.login({
    userName: process.env.LOCKED_OUT_USER_NAME!,
    password: process.env.PASSWORD!,
  });
  //  See the "Epic sadface: Username and password do not match any user in this service" error message appears
  await expect(loginPage.errorMessageContainer).toHaveText(
    loginPage.messages.lockedOutUserCredentials
  );
  // Click the error message Clode (X) button
  //  See the error message disappears
  await loginPage.closeErrorMessage();
});

test("Log in with locked out valid user name and INVALID password credentials", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  // Navigate to https://www.saucedemo.com/
  // Set the valid "Username" and INVALID "Password" credentials
  await loginPage.goto();
  await loginPage.login({
    userName: process.env.LOCKED_OUT_USER_NAME!,
    password: process.env.PASSWORD!,
  });
  //  See the "Epic sadface: Username and password do not match any user in this service" error message appears
  await expect(loginPage.errorMessageContainer).toHaveText(
    loginPage.messages.lockedOutUserCredentials
  );
  // Click the error message Clode (X) button
  //  See the error message disappears
  await loginPage.closeErrorMessage();
});

test("Navigate Inventory, Inventory Items and Cart page without logging in", async ({
  page,
}) => {
  const inventoryPage = new InventoryPage(page);
  const inventoryItemPage = new InventoryItemPage(page);
  const loginPage = new LoginPage(page);
  const cartPage = new CartPage(page);
  await page.context().clearCookies();

  // Navigate to https://www.saucedemo.com/inventory.html without logging in
  await inventoryPage.goto();
  //  See the "Epic sadface: You can only access '/inventory.html' when you are logged in" error message appears
  await expect(loginPage.errorMessageContainer).toHaveText(
    loginPage.messages.loggedOutInventoryPageNavigate
  );
  // Navigate to https://www.saucedemo.com/inventory-item.html without logging in
  await inventoryItemPage.goto();
  //  See the "Epic sadface: You can only access '/inventory-item.html' when you are logged in" error message appears
  await expect(loginPage.errorMessageContainer).toHaveText(
    loginPage.messages.loggedOutInventoryItemPageNavigate
  );
  // Navigate to https://www.saucedemo.com/cart.html without logging in
  await cartPage.goto();
  //  See the "Epic sadface: You can only access '/cart.html' when you are logged in" error message appears
  await expect(loginPage.errorMessageContainer).toHaveText(
    loginPage.messages.loggedOutCartPageNavigate
  );
  // Click the error message Clode (X) button
  //  See the error message disappears
  await loginPage.closeErrorMessage();
});
