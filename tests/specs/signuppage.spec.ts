// tests/specs/signuppage.spec.ts
import { test, expect, request } from "@playwright/test";
import { SignupPage } from "../pages/signuppage";

test.describe("Signup Flow", () => {
  test("User can sign up successfully (with dynamic OTP)", async ({ page }) => {
    const signupPage = new SignupPage(page);
    const apiContext = await request.newContext();

    // 🧭 Step 1 — Go to signup page
    await signupPage.goto();

    // Generate unique email for each run
    const uniqueEmail = `user_${Date.now()}@example.com`;

    // 📝 Step 2 — Fill the signup form
    await signupPage.fillSignupForm("John", "Doe", uniqueEmail, "Password123!");

    await signupPage.acceptTerms();
    await signupPage.submit();

    // ⏳ Step 3 — Wait a few seconds for OTP to be generated and stored
    await page.waitForTimeout(3000);

    // 🔐 Step 4 — Fetch OTP dynamically from backend API
    // adjust endpoint to match your backend (example: /api/auth/otp or /api/user/otp)
    const otpResponse = await apiContext.get(
      `${process.env.API_URL}/otp/admin/{email}=${uniqueEmail}`
    );

    expect(otpResponse.status(), "OTP API must return 200").toBe(200);

    const otpData = await otpResponse.json();

    // Expected structure example:
    // {
    //   "success": true,
    //   "message": "OTP sent successfully",
    //   "data": { "email": "user@example.com", "otp": "6481" }
    // }

    const otp = otpData?.data?.otp;
    expect(otp, "OTP should be returned by the API").toBeTruthy();

    console.log(`✅ OTP fetched for ${uniqueEmail}: ${otp}`);

    // 🧾 Step 5 — Enter OTP and complete verification
    await signupPage.handleOtpVerification(otp);

    // ✅ Step 6 — Confirm signup success message
    await signupPage.assertSignupSuccess();

    await apiContext.dispose();
  });
});
