import { test as base } from '@playwright/test'
import { readFileSync } from 'fs'

import { users } from './data/users.js'

const environment = process.env.TEST_ENV ?? 'local'
const envConfig = JSON.parse(readFileSync(`./environments/${environment}.json`, 'utf8'))

export { expect } from '@playwright/test'

export const test = base.extend({
  load: async ({ request }, use) => {
    await use((data) => {
      return request.post('/system/data/load', { data })
    })
  },

  login: async ({ page }, use) => {
    await use(async (email) => {
      await page.goto('/signin')
      await page.fill('input#email', email)
      await page.fill('input#password', envConfig.values.defaultPassword)
      await page.click('.govuk-button.govuk-button--start')
    })
  },

  tearDown: async ({ request }, use) => {
    await use(() => {
      return request.post('/system/data/tear-down')
    })
  },

  setup: async ({ tearDown, load }, use) => {
    await use(async (scenario) => {
      await tearDown()
      await load(scenario)
    })
  },

  // eslint-disable-next-line no-empty-pattern
  users: async ({}, use) => {
    await use(users)
  }
})
