import { test, expect, request, APIRequestContext } from "@playwright/test";
import fs from "fs";
import path from "path";

test.use({ trace: "off", screenshot: "off" });

test.describe("Authenticated API tests (Dynamic user validation)", () => {
  let apiContext: APIRequestContext;
  let authToken: string;

  test.beforeAll(async () => {
    // ✅ 1️⃣ Read auth token from Playwright’s storageState.json
    const storageStatePath = path.resolve(__dirname, "../../../storageState.json");

    if (!fs.existsSync(storageStatePath)) {
      throw new Error("❌ storageState.json not found! Run login test first.");
    }

    const storageState = JSON.parse(fs.readFileSync(storageStatePath, "utf-8"));

    // ✅ 2️⃣ Extract correct origin
    const originData =
      storageState.origins.find((o: any) =>
        o.origin.includes("zanity-app.vercel.app")
      ) ||
      storageState.origins.find((o: any) =>
        o.origin.includes("cred-check-be.vercel.app")
      );

    if (!originData)
      throw new Error("❌ No valid origin found in storageState.json");

    // ✅ 3️⃣ Extract token from localStorage
    const tokenEntry = originData.localStorage.find(
      (item: any) => item.name === "authToken"
    );

    if (!tokenEntry) throw new Error("❌ No authToken found in localStorage");

    authToken = tokenEntry.value;

    // ✅ 4️⃣ Create an API client using token
    apiContext = await request.newContext({
      baseURL: process.env.API_URL || "https://cred-check-be.vercel.app/api",
      extraHTTPHeaders: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
  });

  // ✅ 5️⃣ Main test
  test("GET /user returns valid structure", async () => {
    const response = await apiContext.get("/user");
    expect(response.status(), "Expected 200 OK").toBe(200);

    const body = await response.json();
    console.log("✅ API Response:", JSON.stringify(body, null, 2));

    // ✅ General structure validation
    expect(body).toHaveProperty("success", true);
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");

    const user = body.data;
    expect(typeof user).toBe("object");

    // ✅ Validate required keys
    const expectedKeys = [
      "_id",
      "fullName",
      "email",
      "isVerified",
      "isOnboarded",
      "onboarding",
    ];
    for (const key of expectedKeys) expect(user).toHaveProperty(key);

    // ✅ Type checks
    expect(typeof user._id).toBe("string");
    expect(typeof user.fullName).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.isVerified).toBe("boolean");
    expect(typeof user.isOnboarded).toBe("boolean");

    // ✅ Onboarding structure
    expect(user.onboarding).toBeDefined();
    expect(user.onboarding).toHaveProperty("role");
    expect(Array.isArray(user.onboarding.goals)).toBe(true);

    // ✅ Optional: cross-check email with environment
    if (process.env.TEST_USER) {
      expect(user.email).toBe(process.env.TEST_USER);
    }
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });
});
