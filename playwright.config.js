import { defineConfig } from '@playwright/test'

import config from './tests/config.js'

const browser = {
  // Remove ...devices['Desktop Chrome'] here
  viewport: null,
  launchOptions: {
    args: ['--start-maximized']
  }
}

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: false,
  projects: [
    // Seeds every spec's own copy of its scenario before internal and external run. The CI smoke test has no database,
    // so its project doesn't depend on this
    {
      name: 'world',
      testMatch: 'world.setup.js'
    },
    {
      name: 'internal',
      dependencies: ['world'],
      testMatch: 'internal/**/*.spec.js',
      use: browser
    },
    // The legacy external UI loses a user's company scope when several external sessions run at once, so external
    // specs run one at a time
    {
      name: 'external',
      dependencies: ['world'],
      testMatch: 'external/**/*.spec.js',
      use: browser,
      workers: 1
    },
    {
      name: 'ci',
      testMatch: 'ci.spec.js',
      use: browser
    }
  ],
  reporter: [['html'], ['list']],
  retries: process.env.CI ? 2 : 0,
  testDir: './tests',
  // Billing is left out of the world for now
  testIgnore: '**/internal/billing/**',
  // The default is 30 seconds (30,000 milliseconds) and applies to the _whole_ test, including before hooks. On slower
  // machines, or because services we depend on are running a little slow, sometimes a test might take a bit longer. To
  // avoid thinking there is an issue, we give the tests extra time to complete.
  timeout: 60 * 1000,
  use: {
    baseURL: config.baseUrl,
    trace: 'on-first-retry'
  }
})
