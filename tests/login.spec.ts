import { expect, test } from "@playwright/test";
import InventoryPage from "../pages/inventory";
import LoginPage from "../pages/login";
import InventoryItemPage from "../pages/inventoryItem";
import CartPage from "../pages/cart";

/**
 * Navigate to https://www.saucedemo.com/
 * Fill the "Username" and "Password" fields with valid credentials
 * Click the "Login" button
 *  See the sort container appears
 */
test("Log in with standard user credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  await page.context().clearCookies();

  // Navigate to https://www.saucedemo.com/
  await loginPage.goto();

  // Fill the "Username" and "Password" fields with valid credentials
  // Click the "Login" button
  await loginPage.login({
    userName: process.env.STANDARD_USER_NAME!,
    password: process.env.PASSWORD!,
  });

  //  See the sort container appears
  await expect(inventoryPage.sortContainer).toBeVisible();
});

/**
 * Navigate to https://www.saucedemo.com/
 * Set the valid "Username" and INVALID "Password" credentials
 * Click the "Login" button
 *  See the "Epic sadface: Username and password do not match any user in this service" error message appears
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("Log in with valid user name and INVALID password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  // Navigate to https://www.saucedemo.com/
  await loginPage.goto();

  // Set the valid "Username" and INVALID "Password" credentials
  // Click the "Login" button
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

/**
 * Navigate to https://www.saucedemo.com/
 * Set the INVALID "Username" and valid "Password" credentials
 * Click the "Login" button
 *  See the "Epic sadface: Username and password do not match any user in this service" error message appears
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("Log in with INVALID user name and valid password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  // Navigate to https://www.saucedemo.com/
  await loginPage.goto();
  // Set the valid "Username" and INVALID "Password" credentials
  await loginPage.login({
    userName: "wrongUserName",
    password: process.env.PASSWORD!,
  });

  // Click the "Login" button
  //  See the "Epic sadface: Username and password do not match any user in this service" error message appears
  await expect(loginPage.errorMessageContainer).toHaveText(
    loginPage.messages.invalidCredentials
  );

  // Click the error message Clode (X) button
  //  See the error message disappears
  await loginPage.closeErrorMessage();
});

/**
 * Navigate to https://www.saucedemo.com/
 * Set the locked user valid credentials
 * Click the "Login" button
 *  See the "Epic sadface: Sorry, this user has been locked out." error message appears
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("Log in with locked out valid user credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  // Navigate to https://www.saucedemo.com/
  await loginPage.goto();

  // Set the locked user valid credentials
  // Click the "Login" button
  await loginPage.login({
    userName: process.env.LOCKED_OUT_USER_NAME!,
    password: process.env.PASSWORD!,
  });
  //  See the "Epic sadface: Sorry, this user has been locked out." error message appears
  await expect(loginPage.errorMessageContainer).toHaveText(
    loginPage.messages.lockedOutUserCredentials
  );

  // Click the error message Clode (X) button
  //  See the error message disappears
  await loginPage.closeErrorMessage();
});

/**
 * Navigate to https://www.saucedemo.com/
 * Set the valid "Username" and INVALID "Password" credentials
 * Click the "Login" button
 *  See the "Epic sadface: Username and password do not match any user in this service" error message appears
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("Log in with locked out valid user name and INVALID password credentials", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  // Navigate to https://www.saucedemo.com/
  await loginPage.goto();

  // Set the valid "Username" and INVALID "Password" credentials
  // Click the "Login" button
  await loginPage.login({
    userName: process.env.LOCKED_OUT_USER_NAME!,
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

/**
 * Navigate to https://www.saucedemo.com/
 * Set the SQL injection data to "Username" and "Password" input fields
 * Click the "Login" button
 *  See the page URL didn't change
 *  See the "Epic sadface: Username and password do not match any user in this service" error message appears
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("SQL Injection vulnerability test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const sqlInjection = "' OR '1'='1";

  // Navigate to https://www.saucedemo.com/
  await loginPage.goto();

  // Set the SQL injection data to "Username" and "Password" input fields
  // Click the "Login" button
  await loginPage.login({ userName: sqlInjection, password: sqlInjection });
  //  See the page URL didn't change
  await expect(page).not.toHaveURL("https://www.saucedemo.com/inventory.html");
  //  See the "Epic sadface: Username and password do not match any user in this service" error message appears
  await expect(loginPage.errorMessageContainer).toHaveText(
    loginPage.messages.invalidCredentials
  );

  // Click the error message Clode (X) button
  //  See the error message disappears
  await loginPage.closeErrorMessage();
});

/**
 * Navigate to https://www.saucedemo.com/
 * Set the XSS payload data to "Username" input field and wrong password to "Password" input field
 * Click the "Login" button
 *  See the page didn't execute the XSS payload
 *  See the "Epic sadface: Username and password do not match any user in this service" error message appears
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("XSS vulnerability test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const xssPayload = "<script>alert('XSS')</script>";

  // Navigate to https://www.saucedemo.com/
  await loginPage.goto();

  // Set the XSS payload data to "Username" input field and wrong password to "Password" input field
  // Click the "Login" button
  await loginPage.login({ userName: xssPayload, password: "wrongPassword" });
  //  See the page didn't execute the XSS payload
  await expect(page.locator("alert")).toHaveCount(0);
  //  See the "Epic sadface: Username and password do not match any user in this service" error message appears
  await expect(loginPage.errorMessageContainer).toHaveText(
    loginPage.messages.invalidCredentials
  );

  // Click the error message Clode (X) button
  //  See the error message disappears
  await loginPage.closeErrorMessage();
});

/**
 * Navigate to https://www.saucedemo.com/
 * Set valid "Username" and "Password" credentials
 * Click the "Login" button
 *  See the sort container appears
 *  See the session cookie has Secure and HttpOnly attributes
 */
test.skip("Session cookie attributes test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // Navigate to https://www.saucedemo.com/
  await loginPage.goto();

  // Set valid "Username" and "Password" credentials
  // Click the "Login" button
  await loginPage.login({
    userName: process.env.STANDARD_USER_NAME!,
    password: process.env.PASSWORD!,
  });
  //  See the sort container appears
  await expect(inventoryPage.sortContainer).toBeVisible();

  //  See the session cookie has Secure and HttpOnly attributes
  const cookies = await page.context().cookies();
  await expect(
    cookies.some(
      (cookie) =>
        cookie.name === "session-username" && cookie.secure && cookie.httpOnly
    )
  ).toBeTruthy();
});

/**
 * Navigate to https://www.saucedemo.com/inventory.html without logging in
 *  See the "Epic sadface: You can only access '/inventory.html' when you are logged in" error message appears
 * Navigate to https://www.saucedemo.com/inventory-item.html without logging in
 *  See the "Epic sadface: You can only access '/inventory-item.html' when you are logged in" error message appears
 * Navigate to https://www.saucedemo.com/cart.html without logging in
 *  See the "Epic sadface: You can only access '/cart.html' when you are logged in" error message appears
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
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
