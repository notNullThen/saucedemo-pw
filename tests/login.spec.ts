import { expect, test } from "@playwright/test";
import ProductsPage from "../pages/productsPage";
import LoginPage from "../pages/loginPage";

/**
 * Navigate to https://www.saucedemo.com/
 * Fill the "Username" and "Password" fields with valid credentials
 * Click the "Login" button
 *  See the sort container appears
 */

test("Log in with standard user credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  await page.context().clearCookies();

  await test.step("Log in with valid user name and INVALID password", async () => {
    // Navigate to https://www.saucedemo.com/
    await loginPage.goto();
    // Fill the "Username" and "Password" fields with valid credentials
    const userNameInputPlaceholder = await loginPage.userNameInput.getAttribute("placeholder");
    const passwordInputPlaceholder = await loginPage.passwordInput.getAttribute("placeholder");
    await loginPage.goto();
    expect(userNameInputPlaceholder).toEqual("Username");
    await loginPage.userNameInput.fill(process.env.STANDARD_USER_NAME!);
    expect(passwordInputPlaceholder).toEqual("Password");
    await loginPage.passwordInput.fill(process.env.PASSWORD!);
  });
  await test.step('Click "Login" button and see the Inventory page', async () => {
    // Click the "Login" button
    await page.getByTestId("login-button").click();
    //  See the sort container appears
    try {
      await expect(productsPage.sortContainer).toBeVisible();
    } catch (error) {
      throw new Error("User wasn't redirected to Inventory page");
    }
  });
});

/**
 * Navigate to https://www.saucedemo.com/
 * Set the valid "Username" and INVALID "Password" credentials
 * Click the "Login" button
 *  See the "Epic sadface: Username and password do not match any user in this service" error message appears
 *  See user didn't log in
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("Log in with valid user name and INVALID password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  await test.step('Set the valid "Username" and INVALID "Password" credentials', async () => {
    // Navigate to https://www.saucedemo.com/
    await loginPage.goto();
    // Set the valid "Username" and INVALID "Password" credentials
    const userNameInputPlaceholder = await loginPage.userNameInput.getAttribute("placeholder");
    const passwordInputPlaceholder = await loginPage.passwordInput.getAttribute("placeholder");
    expect(userNameInputPlaceholder).toEqual("Username");
    await loginPage.userNameInput.fill(process.env.STANDARD_USER_NAME!);
    expect(passwordInputPlaceholder).toEqual("Password");
    await loginPage.passwordInput.fill("wrongPassword");
  });
  await test.step(`Click "Login" button and see user didn't log in`, async () => {
    // Click the "Login" button
    await page.getByTestId("login-button").click();
    //  See the "Epic sadface: Username and password do not match any user in this service" error message appears
    await expect(loginPage.errorMessageContainer).toHaveText(loginPage.messages.invalidCredentials);
    //  See the user was not redirected to other page
    expect(page.url()).toBe(process.env.BASE_URL);
  });
  await test.step("Close the error message", async () => {
    // Click the error message Clode (X) button
    //  See the error message disappears
    await closeErrorMessage(loginPage);
  });
});

/**
 * Navigate to https://www.saucedemo.com/
 * Set the INVALID "Username" and valid "Password" credentials
 * Click the "Login" button
 *  See the "Epic sadface: Username and password do not match any user in this service" error message appears
 *  See user didn't log in
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("Log in with INVALID user name and valid password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  await test.step('Set the valid "Username" and INVALID "Password" credentials', async () => {
    // Navigate to https://www.saucedemo.com/
    await loginPage.goto();
    // Set the valid "Username" and INVALID "Password" credentials
    const userNameInputPlaceholder = await loginPage.userNameInput.getAttribute("placeholder");
    const passwordInputPlaceholder = await loginPage.passwordInput.getAttribute("placeholder");
    expect(userNameInputPlaceholder).toEqual("Username");
    await loginPage.userNameInput.fill("wrongUserName");
    expect(passwordInputPlaceholder).toEqual("Password");
    await loginPage.passwordInput.fill(process.env.PASSWORD!);
  });

  await test.step(`Click "Login" button and see user didn't log in`, async () => {
    // Click the "Login" button
    await page.getByTestId("login-button").click();
    //  See the "Epic sadface: Username and password do not match any user in this service" error message appears
    await expect(loginPage.errorMessageContainer).toHaveText(loginPage.messages.invalidCredentials);
  });

  await test.step("Close the error message", async () => {
    // Click the error message Clode (X) button
    //  See the error message disappears
    await closeErrorMessage(loginPage);
  });
});

/**
 * Navigate to https://www.saucedemo.com/
 * Set the locked user valid credentials
 * Click the "Login" button
 *  See the "Epic sadface: Sorry, this user has been locked out." error message appears
 *  See user didn't log in
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("Log in with locked out valid user credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  await test.step("Set the locked user valid credentials", async () => {
    // Navigate to https://www.saucedemo.com/
    await loginPage.goto();
    // Set the locked user valid credentials
    const userNameInputPlaceholder = await loginPage.userNameInput.getAttribute("placeholder");
    const passwordInputPlaceholder = await loginPage.passwordInput.getAttribute("placeholder");
    expect(userNameInputPlaceholder).toEqual("Username");
    await loginPage.userNameInput.fill(process.env.LOCKED_OUT_USER_NAME!);
    expect(passwordInputPlaceholder).toEqual("Password");
    await loginPage.passwordInput.fill(process.env.PASSWORD!);
  });

  await test.step(`Click "Login" button and see user didn't log in`, async () => {
    // Click the "Login" button
    await page.getByTestId("login-button").click();
    //  See the "Epic sadface: Sorry, this user has been locked out." error message appears
    await expect(loginPage.errorMessageContainer).toHaveText(loginPage.messages.lockedOutUserCredentials);
  });

  await test.step("Close the error message", async () => {
    // Click the error message Clode (X) button
    //  See the error message disappears
    await closeErrorMessage(loginPage);
  });
});

/**
 * Navigate to https://www.saucedemo.com/
 * Set the valid "Username" and INVALID "Password" credentials
 * Click the "Login" button
 *  See the "Epic sadface: Username and password do not match any user in this service" error message appears
 *  See user didn't log in
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("Log in with locked out valid user name and INVALID password credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  await test.step('Set the valid "Username" and INVALID "Password" credentials', async () => {
    // Navigate to https://www.saucedemo.com/
    await loginPage.goto();
    // Set the valid "Username" and INVALID "Password" credentials
    const userNameInputPlaceholder = await loginPage.userNameInput.getAttribute("placeholder");
    const passwordInputPlaceholder = await loginPage.passwordInput.getAttribute("placeholder");
    await loginPage.goto();
    expect(userNameInputPlaceholder).toEqual("Username");
    await loginPage.userNameInput.fill(process.env.LOCKED_OUT_USER_NAME!);
    expect(passwordInputPlaceholder).toEqual("Password");
    await loginPage.passwordInput.fill("wrongPassword");
  });

  await test.step(`Click "Login" button and see user didn't log in`, async () => {
    // Click the "Login" button
    await page.getByTestId("login-button").click();
    //  See the "Epic sadface: Username and password do not match any user in this service" error message appears
    await expect(loginPage.errorMessageContainer).toHaveText(loginPage.messages.invalidCredentials);
  });

  await test.step("Close the error message", async () => {
    // Click the error message Clode (X) button
    //  See the error message disappears
    await closeErrorMessage(loginPage);
  });
});

/**
 * Navigate to https://www.saucedemo.com/
 * Set the SQL injection data to "Username" and "Password" input fields
 * Click the "Login" button
 *  See the page URL didn't change
 *  See the "Epic sadface: Username and password do not match any user in this service" error message appears
 *  See user didn't log in
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("SQL Injection vulnerability test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const sqlInjection = "' OR '1'='1";
  await page.context().clearCookies();

  await test.step('Set the SQL injection data to "Username" and "Password" input fields', async () => {
    // Navigate to https://www.saucedemo.com/
    await loginPage.goto();
    // Set the SQL injection data to "Username" and "Password" input fields
    const userNameInputPlaceholder = await loginPage.userNameInput.getAttribute("placeholder");
    const passwordInputPlaceholder = await loginPage.passwordInput.getAttribute("placeholder");
    await loginPage.goto();
    expect(userNameInputPlaceholder).toEqual("Username");
    await loginPage.userNameInput.fill(sqlInjection);
    expect(passwordInputPlaceholder).toEqual("Password");
    await loginPage.passwordInput.fill(sqlInjection);
  });

  await test.step("Validate that SQL injection didn't work", async () => {
    // Click the "Login" button
    await page.getByTestId("login-button").click();
    //  See the page URL didn't change
    await expect(page).toHaveURL(process.env.BASE_URL!);
    //  See the "Epic sadface: Username and password do not match any user in this service" error message appears
    await expect(loginPage.errorMessageContainer).toHaveText(loginPage.messages.invalidCredentials);
    //  See the user was not redirected to other page
    expect(page.url()).toBe(process.env.BASE_URL);
  });

  await test.step("Close the error message", async () => {
    // Click the error message Clode (X) button
    //  See the error message disappears
    await closeErrorMessage(loginPage);
  });
});

/**
 * Navigate to https://www.saucedemo.com/
 * Set the XSS payload data to "Username" input field and wrong password to "Password" input field
 * Click the "Login" button
 *  See the page didn't execute the XSS payload
 *  See the "Epic sadface: Username and password do not match any user in this service" error message appears
 *  See user didn't log in
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("XSS vulnerability test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const xssPayload = "<script>alert('XSS')</script>";
  await page.context().clearCookies();

  await test.step('Use the XSS payload data as "Username" and wrong password', async () => {
    // Navigate to https://www.saucedemo.com/
    await loginPage.goto();
    // Set the XSS payload data to "Username" input field and wrong password to "Password" input field
    const userNameInputPlaceholder = await loginPage.userNameInput.getAttribute("placeholder");
    const passwordInputPlaceholder = await loginPage.passwordInput.getAttribute("placeholder");
    await loginPage.goto();
    expect(userNameInputPlaceholder).toEqual("Username");
    await loginPage.userNameInput.fill(xssPayload);
    expect(passwordInputPlaceholder).toEqual("Password");
    await loginPage.passwordInput.fill("wrongPassword");
  });

  await test.step("Validate that XSS Payload data isn't executed", async () => {
    // Click the "Login" button
    await page.getByTestId("login-button").click();
    //  See the page didn't execute the XSS payload
    try {
      await expect(page.locator("alert")).toHaveCount(0);
    } catch (error) {
      throw new Error(`The '${xssPayload}' XSS payload is executed. Alert window appeared.`);
    }
    //  See the "Epic sadface: Username and password do not match any user in this service" error message appears
    try {
      await expect(loginPage.errorMessageContainer).toHaveText(loginPage.messages.invalidCredentials);
    } catch (error) {
      throw new Error(
        `The "${loginPage.messages.invalidCredentials}" error message\n
        didn't appear after XSS payload execution attempt.`,
      );
    }
    //  See the user was not redirected to other page
    expect(page.url()).toBe(process.env.BASE_URL);
  });

  await test.step("Close the error message", async () => {
    // Click the error message Clode (X) button
    //  See the error message disappears
    await closeErrorMessage(loginPage);
  });
});

/**
 * Navigate to https://www.saucedemo.com/
 * Set valid "Username" and "Password" credentials
 * Click the "Login" button
 *  See the sort container appears
 *  See the session cookies has Secure and HttpOnly attributes
 */
test.skip("Session cookie attributes test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  await page.context().clearCookies();

  await test.step("Log in with valid user credentials", async () => {
    // Navigate to https://www.saucedemo.com/
    await loginPage.goto();
    // Set valid "Username" and "Password" credentials
    const userNameInputPlaceholder = await loginPage.userNameInput.getAttribute("placeholder");
    const passwordInputPlaceholder = await loginPage.passwordInput.getAttribute("placeholder");
    await loginPage.goto();
    expect(userNameInputPlaceholder).toEqual("Username");
    await loginPage.userNameInput.fill(process.env.STANDARD_USER_NAME!);
    expect(passwordInputPlaceholder).toEqual("Password");
    await loginPage.passwordInput.fill(process.env.PASSWORD!);
    // Click the "Login" button
    await page.getByTestId("login-button").click();
    //  See the sort container appears
    await expect(productsPage.sortContainer).toBeVisible();
  });

  await test.step("See the session cookies has Secure and HttpOnly attributes", async () => {
    //  See the session cookies has Secure and HttpOnly attributes
    try {
      const cookies = await page.context().cookies();
      expect(
        cookies.some((cookie) => cookie.name === "session-username" && cookie.secure && cookie.httpOnly),
      ).toBeTruthy();
    } catch (error) {
      throw new Error('The session cookies have no "Secure" or/and "HttpOnly" attributes');
    }
  });
});

/**
 * Navigate to https://www.saucedemo.com/inventory.html without logging in
 *  See the "Epic sadface: You can only access '/inventory.html' when you are logged in" error message appears
 * Navigate to https://www.saucedemo.com/inventory-item.html without logging in
 *  See the "Epic sadface: You can only access '/inventory-item.html' when you are logged in" error message appears
 * Navigate to https://www.saucedemo.com/cart.html without logging in
 *  See the "Epic sadface: You can only access '/cart.html' when you are logged in" error message appears
 * Navigate to https://www.saucedemo.com/checkout-step-one.html without logging in
 *  See the "Epic sadface: You can only access '/checkout-step-one.html' when you are logged in" error message appears
 *  See user didn't log in
 * Click the error message Clode (X) button
 *  See the error message disappears
 */
test("Navigate Inventory, Inventory Items, Cart and Checkout pages without logging in", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.context().clearCookies();

  await test.step(`Navigate to https://www.saucedemo.com/inventory.html without logging in`, async () => {
    await page.goto(process.env.PRODUCTS_PAGE_URL!);
    //  See the "Epic sadface: You can only access '/inventory.html' when you are logged in" error message appears
    await expect(loginPage.errorMessageContainer).toHaveText(loginPage.messages.loggedOutProductsPageNavigate);
  });
  await test.step(`Navigate to https://www.saucedemo.com/inventory-item.html without logging in`, async () => {
    await page.goto(process.env.ITEM_PAGE_URL!);
    //  See the "Epic sadface: You can only access '/inventory-item.html' when you are logged in" error message appears
    await expect(loginPage.errorMessageContainer).toHaveText(loginPage.messages.loggedOutItemPageNavigate);
  });
  await test.step(`Navigate to https://www.saucedemo.com/cart.html without logging in`, async () => {
    // Navigate to https://www.saucedemo.com/cart.html without logging in
    await page.goto(process.env.YOUR_CART_PAGE_URL!);
    //  See the "Epic sadface: You can only access '/cart.html' when you are logged in" error message appears
    await expect(loginPage.errorMessageContainer).toHaveText(loginPage.messages.loggedOutCartPageNavigate);
  });
  await test.step(`Navigate to https://www.saucedemo.com/checkout-step-one.html without logging in`, async () => {
    // Navigate to https://www.saucedemo.com/checkout-step-one.html without logging in
    await page.goto(process.env.CHECKOUT_PAGE_URL!);
    /* eslint-disable-next-line max-len */
    //  See the "Epic sadface: You can only access '/checkout-step-one.html' when you are logged in" error message appears
    await expect(loginPage.errorMessageContainer).toHaveText(loginPage.messages.loggedOutCheckoutPageNavigate);
  });
  await test.step(`Close the error message`, async () => {
    // Click the error message Clode (X) button
    //  See the error message disappears
    await loginPage.closeErrorMessage();
  });
});

async function closeErrorMessage(loginPage) {
  try {
    // Click the error message Clode (X) button
    await loginPage.errorMessageContainer.locator(".error-button").click();
    //  See the error message disappears
    await expect(loginPage.errorMessageContainer).not.toBeAttached();
  } catch (error) {
    throw new Error("Error message didn't close");
  }
}
