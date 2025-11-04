import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    // ✅ Use environment variable instead of hardcoding URL
    const baseUrl =
      process.env.BASE_URL || "https://zanity-app.vercel.app/auth/login";
    await this.page.goto(baseUrl);
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async assertDashboardVisible() {
    await this.page.waitForSelector("text=Zanity", { timeout: 10000 });
  }
}
