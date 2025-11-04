// pages/logingoogle.ts
import { Page, expect } from "@playwright/test";

export class LoginGooglePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    // ✅ Load from environment variable instead of hardcoding
    const baseUrl =
      process.env.BASE_URL || "https://zanity-app.vercel.app/auth/login";
    await this.page.goto(baseUrl);
  }

  async clickGoogleSignIn() {
    await this.page
      .getByRole("button", { name: "google Log in with Google" })
      .click();
  }

  async handleGoogleAuth(email: string, password: string) {
    await this.page
      .getByRole("textbox", { name: "Email or phone" })
      .fill(email);
    await this.page.getByRole("button", { name: "Next" }).click();
    await this.page
      .getByRole("textbox", { name: "Enter your password" })
      .fill(password);
    await this.page.getByRole("button", { name: "Next" }).click();
    await this.page.waitForURL("/", { timeout: 10000 });

  }

  async assertLoginSuccessful() {
    await this.page.waitForSelector("text=Zanity", { timeout: 60000 });
  }
}
