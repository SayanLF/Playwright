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

  //   async clickGoogleSignIn() {
  //     await this.page
  //       .getByRole("button", { name: "google Log in with Google" })
  //       .click();

  //     await this.page.waitForSelector(
  //       'input[type="email"], input[name="identifier"]',
  //       {
  //         timeout: 15000,
  //       }
  //     );
  //   }
  async clickGoogleSignIn() {
    // Wait for the Google login button and click
    const googleBtn = this.page.getByRole("button", {
      name: /google log in with google/i,
    });
    await expect(googleBtn).toBeVisible({ timeout: 10000 });

    // ✅ Click and wait until redirected to Google domain
    await googleBtn.click();

    // Use `waitForURL` instead of deprecated `waitForNavigation`
    await this.page.waitForURL(/accounts\.google\.com/, { timeout: 30000 });

    // Add a short extra wait for the form to load
    await this.page.waitForSelector(
      'input[type="email"], input[name="identifier"]',
      {
        timeout: 15000,
      }
    );
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
  }

  async assertLoginSuccessful() {
    await this.page.getByRole("heading", { name: "Zanity" });
  }
}
