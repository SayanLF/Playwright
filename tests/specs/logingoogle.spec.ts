// tests/specs/logingoogle.spec.ts
import { test } from "@playwright/test";
import { LoginGooglePage } from "../pages/logingoogle";

test.describe("Google Login Flow", () => {
  test("User can log in with Google successfully", async ({ page }) => {
    const loginGoogle = new LoginGooglePage(page);

    await loginGoogle.goto();
    await loginGoogle.clickGoogleSignIn();
    await loginGoogle.handleGoogleAuth(
      process.env.GOOGLE_USER!,
      process.env.GOOGLE_PASS!
    );
    await loginGoogle.assertLoginSuccessful();
  });
});
