import { defineConfig } from '@playwright/test'

import config from './tests/config.js'

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: false,
  projects: [
    {
      name: 'chromium',
      use: {
        // Remove ...devices['Desktop Chrome'] here
        viewport: null,
        launchOptions: {
          args: ['--start-maximized']
        }
      }
    }
  ],
  reporter: [['html'], ['list']],
  retries: process.env.CI ? 2 : 0,
  testDir: './tests',
  // The default is 30 seconds (30,000 milliseconds) and applies to the _whole_ test, including before hooks. On slower
  // machines, or because services we depend on are running a little slow, sometimes a test might take a bit longer. To
  // avoid thinking there is an issue, we give the tests extra time to complete.
  timeout: 60 * 1000,
  use: {
    baseURL: config.baseUrl,
    trace: 'on-first-retry'
  },
  // Must be 1: each spec's beforeAll calls /system/data/tear-down, which wipes all test data in the
  // DB. Running specs in parallel would cause workers to tear down each other's data mid-test.
  workers: 1
})
