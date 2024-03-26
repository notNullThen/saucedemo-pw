# Saucedemo Playwright project

This is the Playwright automation of simple e-commerce [Saucedemo](https://www.saucedemo.com/) website.

**The structure of the project was built with the expectation that the tested product would be developed and become more complex.**
<br>
Based on this, *Page Object Model* was used to promote code reusability and test maintainability.
<br>
! The project has InProgress state.

## Prerequisites

You need to have NodeJS installed on your operating system.

[Installation instructions](https://github.com/nodesource/distributions?tab=readme-ov-file#installation-instructions)


## Getting Started

1. Navigate to desired directory in which you want that project to be located with
```bash
cd ~/desired-directory-name
```
2. Clone the project to that directory with
```bash
git clone https://github.com/notNullThen/saucedemo-pw.git
```
3. Navigate to projects directory
```bash
cd ./saucedemo-pw
```
4. Install all dependencies by running
```bash
npm install
```
5. Run all tests with
```bash
npx playwright test
```

# Covered test cases

### Login security suite


#### Log in with standard user credentials

1. Navigate to https://www.saucedemo.com/
2. Fill the "Username" and "Password" fields with valid credentials
3. Click the "Login" button
    - See the sort container appears


#### Log in with valid user name and INVALID password

1. Navigate to https://www.saucedemo.com/
2. Set the valid "Username" and INVALID "Password" credentials
3. Click the "Login" button
    - See the "Epic sadface: Username and password do not match any user in this service" error message appears
    - See the page URL didn't change
    - See user didn't log in
4. Click the error message Clode (X) button
    - See the error message disappears


#### Log in with INVALID user name and valid password

1. Navigate to https://www.saucedemo.com/
2. Set the INVALID "Username" and valid "Password" credentials
3. Click the "Login" button
    - See the "Epic sadface: Username and password do not match any user in this service" error message appears
    - See the page URL didn't change
    - See user didn't log in
4. Click the error message Clode (X) button
    - See the error message disappears


#### Log in with locked out valid user credentials

1. Navigate to https://www.saucedemo.com/
2. Set the locked user valid credentials
3. Click the "Login" button
    - See the "Epic sadface: Sorry, this user has been locked out." error message appears
    - See the page URL didn't change
    - See user didn't log in
4. Click the error message Clode (X) button
    - See the error message disappears


#### Log in with locked out valid user name and INVALID password credentials

1. Navigate to https://www.saucedemo.com/
2. Set the valid "Username" and INVALID "Password" credentials
3. Click the "Login" button
    - See the "Epic sadface: Username and password do not match any user in this service" error message appears
    - See the page URL didn't change
    - See user didn't log in
4. Click the error message Clode (X) button
    - See the error message disappears


#### Log in with empty credentials

1. Navigate to https://www.saucedemo.com/
    - See the "Username" and "Password" input fields are empty
2. Click the "Login" button
    - See the "Epic sadface: Username is required" error message appears
    - See the page URL didn't change
3. Click the error message Clode (X) button
    - See the error message disappears


#### Log in with valid user name & empty password credentials

1. Navigate to https://www.saucedemo.com/
    - See the "Password" input field is empty
2. Fill the "Username" input field with valid user name
3. Click the "Login" button
    - See the "Epic sadface: Password is required" error message appears
    - See the page URL didn't change
4. Click the error message Clode (X) button
    - See the error message disappears


#### Log in with empty user name & valid password credentials

1. Navigate to https://www.saucedemo.com/
    - See the "Username" input field is empty
2. Fill the "Password" input field with valid password
3. Click the "Login" button
    - See the "Epic sadface: Username is required" error message appears
    - See the page URL didn't change
4. Click the error message Clode (X) button
    - See the error message disappears


#### SQL Injection vulnerability test

1. Navigate to https://www.saucedemo.com/
2. Set the SQL injection data to "Username" and "Password" input 
3. Click the "Login" button
    - See the "Epic sadface: Username and password do not match any 
    - See the page URL didn't change
    - See user didn't log in
4. Click the error message Clode (X) button
    - See the error message disappears


#### XSS vulnerability test

1. Navigate to https://www.saucedemo.com/
2. Set the XSS payload data to "Username" input field and wrong 
3. Click the "Login" button
    - See the page didn't execute the XSS payload
    - See the "Epic sadface: Username and password do not match any 
    - See user didn't log in
4. Click the error message Clode (X) button
    - See the error message disappears


#### Session cookies attributes test - finds vulnerability

( *'.skip' option is applied to this test* )
1. Navigate to https://www.saucedemo.com/
2. Set valid "Username" and "Password" credentials
3. Click the "Login" button
    - See the sort container appears
    - See the session cookies have Secure and HttpOnly attributes


#### Navigate Products, Item and Cart page without logging in

1. Navigate to https://www.saucedemo.com/inventory.html without logging in
    - See the "Epic sadface: You can only access '/inventory.html' when you are logged in" error message appears
2. Navigate to https://www.saucedemo.com/inventory-item.html without logging in
    - See the "Epic sadface: You can only access '/inventory-item.html' when you are logged in" error message appears
3. Navigate to https://www.saucedemo.com/cart.html without logging in
    - See the "Epic sadface: You can only access '/cart.html' when you are logged in" error message appears
4. Navigate to https://www.saucedemo.com/checkout-step-one.html without logging in
    - See the "Epic sadface: You can only access '/checkout-step-one.html' when you are logged in" error message appears
    - See user didn't log in
4. Click the error message Clode (X) button
    - See the error message disappears


## Products

### User should be able to buy one item

1. Go to /inventory.html
    - See Item Name, Price & Description are valid
2. Click item "Add to cart" button
    - See the Shopping cart "1" counter appears
3. Click the Shopping cart
    - See the title is "Your Cart"
    - See the Shopping cart has "1" counter
    - See Item Name, Price & Description are valid
4. Click "Checkout" button
    - See the title is "Checkout: Your Information"
5. Fill the required data with valid details
6. Click "Continue" button
    - See no error message appears
    - See the title is "Checkout: Overview"
    - See the Shopping cart has "1" counter
    - See Item Name, Price & Description are valid
    - See product has correct price and tax
7. Click "Finish" button
    - See the title is "Checkout: Complete!"
    - See the checkout greeting appears and has proper text
8. Click "Back home" button
    - See the page title is "Products"


### User should be able to buy multiple items

1. Go to /inventory.html
2. Click "Add to cart" button for each item
    - See the Shopping cart counter increases
3. Click the Shopping cart
    - See the title is "Your Cart"
    - See the Shopping cart counter didn't change
    - See Item Name, Price & Description are valid
4. Click "Checkout" button
    - See the title is "Checkout: Your Information"
5. Fill the required data with valid details
6. Click "Continue" button
    - See no error message appears
    - See the title is "Checkout: Overview"
    - See the Shopping cart counter didn't change
    - See Item Name, Price & Description are valid
7. Sum the total price value
    - See product has correct price and tax
8. Click "Finish" button
    - See the title is "Checkout: Complete!"
    - See the checkout greeting appears and has proper text
9. Click "Back home" button
    - See the page title is "Products"


### All items details should correspond to its details page

1. Navigate to /inventory.html
2. Get item Name, Description, Price & Image URL
3. Click item name
    - See Item Name, Image URL & Description are valid
4. Click the "Back to products" button
    - See the page title is "Products"
5. Repeat the previous steps for all products


## Test cases priority explanation

The following test cases are considered high priority for the e-commerce website due to their critical role in ensuring a secure, functional, and user-friendly shopping experience.


### ***Critical Business Logic***

- **User should be able to buy one / multiple items**: Covers the end-to-end process of selecting product(s) and completing a purchase, which is directly tied to the website's revenue.


### ***Security and Access Control***

- **Log in with standard user credentials**: Validates that users can log in with correct credentials, which is essential for user data security.

- **Log in with valid username and INVALID password**: Ensures the system correctly handles invalid login attempts to prevent unauthorized access.

- **SQL Injection Vulnerability Test**: This test is crucial for protecting the website from SQL injection attacks, which can compromise the entire database.

- **XSS Vulnerability Test**: Cross-site scripting (XSS) attacks can result in damage. This test ensures that the website is not vulnerable to such threats.

- **Session Cookies Attributes Test**: Cookies must be secure to prevent hijacking and other exploits. This test checks for vulnerabilities in cookies handling. The test finds the Cookies Vulnerability. It is **skipped** and needs to be unskipped manually at ```tests/login.spec.ts``` file after validating the issue.


### ***User Experience***

- **Log in with INVALID username and valid password**: Tests the error handling and user feedback for incorrect login information.

- **Log in with locked out user credentials**: Checks the system's response to attempts made with locked-out user credentials.


### ***Functionality Verification***

- **Navigate Products, Item, and Cart page without logging in**: Confirms that non-authenticated users cannot access restricted areas, preserving the integrity of the website.


### ***Data Accuracy***

- **All items details should correspond to its details page**: Verifies that the product information is consistent and accurate across different pages.


### ***Error Handling***

- **Log in with locked out valid username and INVALID password credentials**: Tests the visibility and dismissal of error messages, contributing to a smooth user interface.
<br>
<br>

***Each of these test cases plays a significant role in maintaining the overall quality and reliability of the e-commerce platform.***

