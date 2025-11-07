import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginpage";

test.describe("Login Flow", () => {
  test("User can log in successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.TEST_USER!, process.env.TEST_PASS!);
    await loginPage.assertDashboardVisible();

    // ✅ Save authenticated session
    await page.context().storageState({ path: "storageState.json" });

    // Optional assertion
    expect(await page.isVisible("text=New Review")).toBeTruthy();
  });
});
