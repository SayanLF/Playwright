import { test, expect } from "@playwright/test";
import { LogoutPage } from "../pages/logoutpage";

test.describe("Logout Flow", () => {
  test("User can log out successfully", async ({ page }) => {
    const logoutPage = new LogoutPage(page);

    // Step 1: Navigate to dashboard (already authenticated via storageState)
    await page.goto("/"); // adjust if your dashboard route is "/"

    // Ensure user is logged in
    await expect(page.locator("text=Zanity")).toBeVisible({ timeout: 10000 });

    // Step 2: Perform logout
    await logoutPage.logout();

    // Step 3: Verify redirected to login page
    await logoutPage.assertLoginVisible();
  });
});
