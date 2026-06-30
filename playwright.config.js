// @ts-check
import { defineConfig, devices } from '@playwright/test'
import { readFileSync } from 'fs'

const environment = process.env.TEST_ENV ?? 'local'
const envConfig = JSON.parse(readFileSync(`./environments/${environment}.json`, 'utf8'))

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: false,
  globalSetup: './tests/support/global-setup.js',
  globalTeardown: './tests/support/global-teardown.js',
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
  workers: 3
})
