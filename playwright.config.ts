import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// ✅ Load environment variables
// dotenv.config({ path: path.resolve(__dirname, "env/.env") });

export default defineConfig({
  // … your existing config …
  reporter: [
    ["list"],
    [
      "./node_modules/playwright-slack-report/dist/src/SlackReporter.js",
      {
        channels: ["pw-tests", "ci"], // Slack channels
        sendResults: "always", // "always" | "on-failure" | "off"
        slackWebHookUrl: process.env.SLACK_WEBHOOK_URL,
        // Alternatively use bot OAuth token:
        // slackOAuthToken: process.env.SLACK_BOT_USER_OAUTH_TOKEN,
        meta: [
          { key: "buildNumber", value: process.env.GITHUB_RUN_NUMBER },
          { key: "branch", value: process.env.GITHUB_REF },
          {
            key: "buildUrl",
            value:
              process.env.GITHUB_SERVER_URL +
              "/" +
              process.env.GITHUB_REPOSITORY +
              "/actions/runs/" +
              process.env.GITHUB_RUN_ID,
          },
        ],
        maxNumberOfFailuresToShow: 5,
        disableUnfurl: true,
        showInThread: false,
      },
    ],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

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
    // {
    //   name: "firefox",
    //   dependencies: ["setup"],
    //   use: {
    //     ...devices["Desktop Firefox"],
    //     storageState: path.resolve(__dirname, "storageState.json"),
    //   },
    // },
    // {
    //   name: "webkit",
    //   dependencies: ["setup"],
    //   use: {
    //     ...devices["Desktop Safari"],
    //     storageState: path.resolve(__dirname, "storageState.json"),
    //   },
    // },
    // {
    //   name: "Tablet Safari",
    //   dependencies: ["setup"],
    //   use: {
    //     ...devices["iPad Pro 11"],
    //     storageState: path.resolve(__dirname, "storageState.json"),
    //   },
    // },
    // {
    //   name: "Tablet Chrome",
    //   dependencies: ["setup"],
    //   use: {
    //     ...devices["Galaxy Tab S4"],
    //     storageState: path.resolve(__dirname, "storageState.json"),
    //   },
    // },
    // {
    //   name: "Tablet Firefox",
    //   dependencies: ["setup"],
    //   use: {
    //     ...devices["Galaxy Tab S4"],
    //     storageState: path.resolve(__dirname, "storageState.json"),
    //   },
    // },

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
