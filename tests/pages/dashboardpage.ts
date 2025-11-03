import { Page, expect } from "@playwright/test";

export class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/"); // ✅ Explicitly go to dashboard route (adjust if your app uses '/')
    await expect(this.page).toHaveURL("/"); // Ensure you're on the dashboard page
  }

  /**
   * Verify multiple dashboard links are visible
   * @param links Array of link names to verify
   */
  async verifyDashboardLinks(
    links: string[] = [
      "Review Console",
      "Smart Search",
      "Knowledge Base",
      "Audit Log",
      "Dev UI",
      "Settings",
    ]
  ) {
    for (const linkName of links) {
      const linkLocator = this.page.getByRole("link", { name: linkName });
      await expect(linkLocator).toBeVisible({ timeout: 10000 });
      const href = await linkLocator.getAttribute("href");
      expect(href).toBeTruthy(); // ensure link has a destination
    }
  }

  async verifyUserWelcome(text: string = "Zanity") {
    // ✅ Wait for welcome text or dashboard identifier to appear
    const welcomeText = this.page.locator(`text=${text}`);
    await expect(welcomeText).toBeVisible({ timeout: 10000 });
  }
}
