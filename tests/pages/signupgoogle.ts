// pages/signupgoogle.ts
import { Page, expect } from "@playwright/test";

export class SignupGooglePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    // ✅ Use environment variable instead of hardcoding URL
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
    const popup = await this.page.context().waitForEvent("page");

    await popup.getByRole("textbox", { name: "Email or phone" }).fill(email);
    await popup.getByRole("button", { name: "Next" }).click();

    await popup
      .getByRole("textbox", { name: "Enter your password" })
      .fill(password);
    await popup.getByRole("button", { name: "Next" }).click();

    await popup.waitForLoadState("networkidle");
  }

  async completeOnboardingFlow() {
    const page = this.page;

    await page.goto("https://zanity-app.vercel.app/onboarding");

    await page.getByRole("button", { name: "Legal & Compliance" }).click();
    await page.getByRole("button", { name: "Something else" }).click();
    await page
      .getByRole("textbox", { name: "Specify your role" })
      .fill("something");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("switch").click();
    await page.getByRole("button", { name: "Continue" }).click();

    await page
      .getByRole("button", { name: "Legal & Finance services" })
      .click();
    await page
      .getByRole("button", { name: "Consumer brands & retail" })
      .click();
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: "Brand-sensitive Brand-" }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: "-50" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
  }

  async assertSignupComplete() {
    await this.page.waitForSelector("text=Zanity", { timeout: 10000 });
  }
}
