import { defineConfig, devices } from '@playwright/test'
import { readFileSync } from 'fs'

const environment = process.env.TEST_ENV ?? 'local'
const envConfig = JSON.parse(readFileSync(`./environments/${environment}.json`, 'utf8'))

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: false,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  reporter: [['html'], ['list']],
  retries: process.env.CI ? 2 : 0,
  testDir: './tests',
  use: {
    baseURL: envConfig.config.baseUrl,
    trace: 'on-first-retry'
  },
  // Must be 1: each spec's beforeAll calls /system/data/tear-down, which wipes all test data in the
  // DB. Running specs in parallel would cause workers to tear down each other's data mid-test.
  workers: 1
})
