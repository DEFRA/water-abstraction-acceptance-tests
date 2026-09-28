import { test as base } from '@playwright/test'

import config from '../config.js'
import loadService from './load/load.service.js'
import tearDownService from './tear-down/tear-down.service.js'
import usersData from './data/users.data.js'

export { expect } from '@playwright/test'

export const test = base.extend({
  // eslint-disable-next-line no-empty-pattern
  defaultPassword: async ({}, use) => {
    await use(config.defaultPassword)
  },

  // eslint-disable-next-line no-empty-pattern
  externalUrl: async ({}, use) => {
    await use(config.externalUrl)
  },

  lastNotification: async ({ request }, use) => {
    await use(async (email) => {
      const response = await request.get(`/notifications/last?email=${email}`)

      return response.json()
    })
  },

  // eslint-disable-next-line no-empty-pattern
  load: async ({}, use) => {
    await use((data) => {
      return loadService(data)
    })
  },

  login: async ({ page, defaultPassword }, use) => {
    await use(async (email) => {
      await page.goto('/signin')
      await page.fill('input#email', email)
      await page.fill('input#password', defaultPassword)
      await page.click('.govuk-button.govuk-button--start')
    })
  },

  // Signs in within its own browser context and returns the session cookies, so a spec can sign in once in beforeAll
  // and add them to each test's context rather than signing in again before every test
  loginCookies: async ({ browser, defaultPassword }, use) => {
    await use(async (email) => {
      const context = await browser.newContext()
      const page = await context.newPage()

      await page.goto('/signin')
      await page.fill('input#email', email)
      await page.fill('input#password', defaultPassword)
      await page.click('.govuk-button.govuk-button--start')
      await page.waitForURL((url) => {
        return !url.pathname.startsWith('/signin')
      })

      const cookies = await context.cookies()

      await context.close()

      return cookies
    })
  },

  // Signs out the session held by cookies from loginCookies, so a spec that signed in once in beforeAll can sign out
  // once in afterAll
  logoutCookies: async ({ browser }, use) => {
    await use(async (cookies) => {
      const context = await browser.newContext()
      const page = await context.newPage()

      await context.addCookies(cookies)
      await page.goto('/system/bill-runs')
      await page.locator('a', { hasText: 'Sign out' }).click()
      await page.getByText("You're signed out").waitFor()

      await context.close()
    })
  },

  loginExternal: async ({ page, defaultPassword, externalUrl }, use) => {
    await use(async (email) => {
      await page.goto(`${externalUrl}/signin`)
      await page.fill('input#email', email)
      await page.fill('input#password', defaultPassword)
      await page.click('.govuk-button.govuk-button--start')
    })
  },

  setup: async ({ tearDown, load }, use) => {
    await use(async (scenario) => {
      await tearDown()
      await load(scenario)
    })
  },

  // eslint-disable-next-line no-empty-pattern
  tearDown: async ({}, use) => {
    await use(async () => {
      await tearDownService()
    })
  },

  triggerJob: async ({ request }, use) => {
    await use((job) => {
      return request.post(`/system/jobs/${job}`, { timeout: 60000 })
    })
  },

  // eslint-disable-next-line no-empty-pattern
  users: async ({}, use) => {
    await use(usersData)
  }
})
