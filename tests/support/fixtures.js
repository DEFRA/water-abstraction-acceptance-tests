import { test as base } from '@playwright/test'
import { readFileSync } from 'fs'

import users from './data/users.js'

const environment = process.env.TEST_ENV ?? 'local'
const envConfig = JSON.parse(readFileSync(`./environments/${environment}.json`, 'utf8'))

export { expect } from '@playwright/test'

export const test = base.extend({
  calculatedDates: async ({ request }, use) => {
    await use(async () => {
      const response = await request.get('/system/data/dates')

      return response.json()
    })
  },

  // eslint-disable-next-line no-empty-pattern
  defaultPassword: async ({}, use) => {
    await use(envConfig.values.defaultPassword)
  },

  lastNotification: async ({ request }, use) => {
    await use(async (email) => {
      const response = await request.get(`/notifications/last?email=${email}`)

      return response.json()
    })
  },

  load: async ({ request }, use) => {
    await use((data) => {
      return request.post('/system/data/load', { data })
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

  setup: async ({ tearDown, load }, use) => {
    await use(async (scenario) => {
      await tearDown()
      await load(scenario)
    })
  },

  tearDown: async ({ request }, use) => {
    await use(() => {
      return request.post('/system/data/tear-down')
    })
  },

  // eslint-disable-next-line no-empty-pattern
  users: async ({}, use) => {
    await use(users)
  }
})
