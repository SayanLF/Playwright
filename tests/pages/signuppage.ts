// tests/pages/signuppage.ts
import { Page } from "@playwright/test";

export class SignupPage {
  constructor(private page: Page) {}

  async goto() {
    // 🔗 Replace with your real signup URL
    await this.page.goto("https://zanity-app.vercel.app/auth/signup");
  }

  async fillSignupForm(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    await this.page.fill('input[name="firstName"]', firstName);
    await this.page.fill('input[name="lastName"]', lastName);
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
  }

  async acceptTerms() {
    // ✅ Check the Terms & Conditions checkbox
    await this.page.waitForSelector("#termsAccepted", { state: "visible" });
    await this.page.check("#termsAccepted");
  }

  async submit() {
    await this.page.click('button[type="submit"]');
  }

  async handleOtpVerification(otpCode: string) {
    // Wait for OTP input fields to appear
    await this.page.waitForSelector('input[name="otp"]', { timeout: 10000 });
    await this.page.fill('input[name="otp"]', otpCode);
    await this.page.click('button:has-text("Verify OTP")');
  }

  async assertSignupSuccess() {
    // Wait for the success confirmation after submission
    await this.page.waitForSelector("text=Account Created", { timeout: 10000 });
  }
}
