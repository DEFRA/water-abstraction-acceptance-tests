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
  use: {
    baseURL: config.baseUrl,
    trace: 'on-first-retry'
  },
  // Must be 1: each spec's beforeAll calls /system/data/tear-down, which wipes all test data in the
  // DB. Running specs in parallel would cause workers to tear down each other's data mid-test.
  workers: 1
})
