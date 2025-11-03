import { Page, expect } from "@playwright/test";

export class LogoutPage {
  constructor(private page: Page) {}

  /**
   * Perform logout for an already authenticated user.
   * Works with storageState.
   */
  async logout() {
    // Wait for the logout button to appear
    const logoutButton = this.page.locator('button:has-text("Logout")');
    await expect(logoutButton).toBeVisible({ timeout: 10000 });

    // Click the logout button
    await logoutButton.click();

    // Optionally wait for redirect to login page
    await this.page.waitForURL("**/login", { timeout: 10000 });
  }

  /**
   * Verify that login page is displayed after logout
   */
  async assertLoginVisible() {
    // Wait for either the heading or the button
    const heading = this.page.getByRole("heading", {
      name: "Login to continue",
    });
    await expect(heading).toBeVisible({ timeout: 10000 });
  }
}
