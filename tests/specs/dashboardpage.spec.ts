import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/dashboardpage";

test.describe("Dashboard", () => {
  test("Dashboard shows welcome message", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto(); // Will open / while already logged in
    await dashboard.verifyUserWelcome();
    expect(await page.isVisible("text=New Review")).toBeTruthy();
    await dashboard.verifyDashboardLinks([
      "Review Console",
      "Smart Search",
      "Knowledge Base",
      "Audit Log",
      "Dev UI",
      "Settings",
    ]);
  });
});
