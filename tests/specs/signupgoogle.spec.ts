// tests/specs/signupgoogle.spec.ts
import { test, expect } from "@playwright/test";
import { SignupGooglePage } from "../pages/signupgoogle";

test.describe("Google Signup Flow", () => {
  test("User can sign up using Google OAuth", async ({ page, context }) => {
    const signup = new SignupGooglePage(page);

    await signup.goto();

    // Step 1: Click Google Sign-In
    const [popupPromise] = await Promise.all([
      context.waitForEvent("page"),
      signup.clickGoogleSignIn(),
    ]);

    // Step 2: Handle Google Login popup
    const popup = await popupPromise;
    await popup.waitForLoadState();

    await popup
      .getByRole("textbox", { name: "Email or phone" })
      .fill(process.env.GOOGLE_USER!);
    await popup.getByRole("button", { name: "Next" }).click();

    await popup
      .getByRole("textbox", { name: "Enter your password" })
      .fill(process.env.GOOGLE_PASS!);
    await popup.getByRole("button", { name: "Next" }).click();

    await popup.waitForLoadState("networkidle");

    // Step 3: Complete onboarding
    await signup.completeOnboardingFlow();

    // Step 4: Verify signup success
    await signup.assertSignupComplete();
  });
});
