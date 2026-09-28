import { test as base } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import path from 'path'

import buildWorldKey from '../../cli/src/world/key.world.js'
import config from '../config.js'
import usersData from './data/users.data.js'

export { expect } from '@playwright/test'

const WORLD_FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../cli/src/world/world.json')

// Module-level cache so world.json is only read from disk once per worker
let cachedWorld = null

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

  login: async ({ page, defaultPassword }, use) => {
    await use(async (email) => {
      await page.goto('/signin')
      await page.fill('input#email', email)
      await page.fill('input#password', defaultPassword)
      await page.click('.govuk-button.govuk-button--start')
      await page.waitForURL((url) => {
        return !url.pathname.startsWith('/signin')
      })
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
      await page.waitForURL((url) => {
        return !url.pathname.startsWith('/signin')
      })
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
  },

  // Looks up this spec's own copy of the scenario global setup seeded, e.g. world('licence') for licence.scenario.js
  // eslint-disable-next-line no-empty-pattern
  world: async ({}, use, testInfo) => {
    if (!cachedWorld) {
      const rawData = await fs.readFile(WORLD_FILE, 'utf-8')

      cachedWorld = JSON.parse(rawData)
    }

    await use((name) => {
      const key = buildWorldKey(testInfo.file, name)
      const scenario = cachedWorld[key]

      if (!scenario) {
        throw new Error(`No scenario '${key}' found in world.json`)
      }

      return scenario
    })
  }
})
