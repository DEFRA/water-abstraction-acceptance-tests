import { test as base } from '@playwright/test'
import { readFileSync } from 'fs'

const users = JSON.parse(readFileSync('./cypress/fixtures/users.json', 'utf8'))
const environment = process.env.TEST_ENV ?? 'local'
const envConfig = JSON.parse(readFileSync(`./environments/${environment}.json`, 'utf8'))

export { expect } from '@playwright/test'

export const test = base.extend({
  users: async ({}, use) => {
    await use(users)
  },

  load: async ({ page }, use) => {
    await use((data) => page.request.post('/system/data/load', { data }))
  },

  login: async ({ page }, use) => {
    await use((email) =>
      page.request.post('/signin', {
        data: { email, password: envConfig.values.defaultPassword }
      })
    )
  }
})