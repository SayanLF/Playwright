import { test, expect } from "@playwright/test";
import { SignupGooglePage } from "../pages/signupgoogle";

test.describe("Google Signup Flow", () => {
  test("User can sign up and complete onboarding with Google successfully", async ({
    page,
  }) => {
    const signupGooglePage = new SignupGooglePage(page);

    // 1️⃣ Go to login page
    await signupGooglePage.goto();

    // 2️⃣ Click Google Sign-Up
    await signupGooglePage.clickGoogleSignIn();

    // 3️⃣ Handle Google authentication
    // ⚠️ Use test accounts stored in env variables
    const email = process.env.GOOGLE_USER!;
    const password = process.env.GOOGLE_PASS!;
    await signupGooglePage.handleGoogleAuth(email, password);

    // 4️⃣ Wait for redirect to your app after login
    await page.waitForURL("**/onboarding", { timeout: 120000 }); // waits up to 2 mins

    // 5️⃣ Complete onboarding flow
    await signupGooglePage.completeOnboardingFlow();

    // 6️⃣ Assert signup completed successfully
    await signupGooglePage.assertSignupComplete();
  });
});
