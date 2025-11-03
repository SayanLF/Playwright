import { test, expect, request, APIRequestContext } from "@playwright/test";
import fs from "fs";
import path from "path";

test.use({ trace: "off", screenshot: "off" });

test.describe("Authenticated API tests (Dynamic user validation)", () => {
  let apiContext: APIRequestContext;
  let authToken: string;

  test.beforeAll(async () => {
    // Read auth token from storageState.json
    const storageStatePath = path.resolve(__dirname, "../../storageState.json");
    const storageState = JSON.parse(fs.readFileSync(storageStatePath, "utf-8"));

    // Get the correct origin — frontend or backend
    const originData =
      storageState.origins.find((o: any) =>
        o.origin.includes("zanity-app.vercel.app")
      ) ||
      storageState.origins.find((o: any) =>
        o.origin.includes("cred-check-be.vercel.app")
      );

    if (!originData)
      throw new Error("No valid origin found in storageState.json");

    const tokenEntry = originData.localStorage.find(
      (item: any) => item.name === "authToken"
    );

    if (!tokenEntry) throw new Error("No authToken found in localStorage");

    authToken = tokenEntry.value;

    // Create API request context
    apiContext = await request.newContext({
      baseURL: process.env.API_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
  });

  // ✅ Test dynamically validates structure for any logged-in user
  test("GET /api/user returns valid structure", async () => {
    const response = await apiContext.get("/user");
    expect(response.status(), "Expected 200 OK").toBe(200);

    const body = await response.json();

    // General validation (structure only)
    expect(body).toHaveProperty("success", true);
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");

    const user = body.data;
    expect(typeof user).toBe("object");

    // Validate user fields dynamically
    const expectedKeys = [
      "_id",
      "fullName",
      "email",
      "isVerified",
      "isOnboarded",
      "onboarding",
    ];

    for (const key of expectedKeys) {
      expect(user).toHaveProperty(key);
    }

    // Validate types instead of hardcoded values
    expect(typeof user._id).toBe("string");
    expect(typeof user.fullName).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.isVerified).toBe("boolean");
    expect(typeof user.isOnboarded).toBe("boolean");

    // Validate onboarding structure
    expect(user.onboarding).toHaveProperty("step1");
    expect(user.onboarding.step1).toHaveProperty("role");
    expect(Array.isArray(user.onboarding.goals)).toBe(true);

    // ✅ Optional: dynamic match — verify that email matches the logged-in user (from .env)
    if (process.env.TEST_USER) {
      expect(user.email).toBe(process.env.TEST_USER);
    }
  });
  

  test.afterAll(async () => {
    await apiContext.dispose();
  });
});
