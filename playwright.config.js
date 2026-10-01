import { defineConfig } from '@playwright/test'

import config from './tests/config.js'

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: false,
  // Seeds every spec's own copy of its scenario once before any spec runs, whichever files are selected. The CI smoke
  // test has no database, so it is skipped there
  globalSetup: process.env.CI ? undefined : './tests/world.setup.js',
  reporter: [['html'], ['list']],
  retries: process.env.CI ? 2 : 0,
  testDir: './tests',
  // The default is 30 seconds (30,000 milliseconds) and applies to the _whole_ test, including before hooks. On slower
  // machines, or because services we depend on are running a little slow, sometimes a test might take a bit longer. To
  // avoid thinking there is an issue, we give the tests extra time to complete.
  timeout: 60 * 1000,
  use: {
    baseURL: config.baseUrl,
    viewport: null,
    launchOptions: {
      args: ['--start-maximized']
    },
    trace: 'on-first-retry'
  }
})
