import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("https://zanity-app.vercel.app/auth/login");
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
