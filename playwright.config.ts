import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// ✅ Load environment variables
// dotenv.config({ path: path.resolve(__dirname, "env/.env") });

export default defineConfig({
  testDir: "./tests/specs",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list","html"], // You can combine multiple reporters
    ["playwright-ctrf-json-reporter", {}],
    
  ],

  /* Default options shared by all projects */
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },

  /* Projects */
  projects: [
    // ⚙️ 1️⃣ Setup project: runs only login.spec.ts to create storageState.json
    {
      name: "setup",
      testMatch: /.*login\.spec\.ts/, // only this file
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    // ⚙️ 2️⃣ Authenticated projects (depend on setup)
    {
      name: "chromium",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: path.resolve(__dirname, "storageState.json"),
      },
    },
    {
      name: "firefox",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Firefox"],
        storageState: path.resolve(__dirname, "storageState.json"),
      },
    },
    {
      name: "webkit",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Safari"],
        storageState: path.resolve(__dirname, "storageState.json"),
      },
    },
    // {
    //   name: "Tablet Safari",
    //   dependencies: ["setup"],
    //   use: {
    //     ...devices["iPad Pro 11"],
    //     storageState: path.resolve(__dirname, "storageState.json"),
    //   },
    // },
    {
      name: "Tablet Chrome",
      dependencies: ["setup"],
      use: {
        ...devices["Galaxy Tab S4"],
        storageState: path.resolve(__dirname, "storageState.json"),
      },
    },
    {
      name: "Tablet Firefox",
      dependencies: ["setup"],
      use: {
        ...devices["Galaxy Tab S4"],
        storageState: path.resolve(__dirname, "storageState.json"),
      },
    },

    // ⚙️ Optional: Project for Google login only
    // {
    //   name: "setup-google",
    //   testMatch: /.*googlelogin\.spec\.ts/,
    //   use: {
    //     ...devices["Desktop Chrome"],
    //   },
    // },
  ],
});
