// tests/specs/logingoogle.spec.ts
import { test } from "@playwright/test";
import { LoginGooglePage } from "../pages/logingoogle";

test.describe("Google Login Flow", () => {
  test("User can log in with Google successfully", async ({ page }) => {
    test.setTimeout(120000); // ⏳ Give Google time to load and redirect
    const loginGoogle = new LoginGooglePage(page);
    await loginGoogle.goto();
    await loginGoogle.clickGoogleSignIn();
    await loginGoogle.handleGoogleAuth(
      process.env.GOOGLE_USER!,
      process.env.GOOGLE_PASS!
    );
    test.setTimeout(120000); // ⏳ Give Google time to load and redirect
    await loginGoogle.assertLoginSuccessful();
  });
});
