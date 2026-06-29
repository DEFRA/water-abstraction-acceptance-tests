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
    await use((data) => {

      data.playwright = true

      return page.request.post('/system/data/load', { data })
    })
  },

  tearDown: async ({ page }, use) => {
    await use((licenceRef, companyName, userEmail) => {
      return page.request.post('/system/data/tear-down', { data: { licenceRef, companyName, userEmail } })
    })
  },

  login: async ({ page }, use) => {
    await use((email) => {
      return page.request.post('/signin', {
        data: { email, password: envConfig.values.defaultPassword }
      })
    })
  }
})
