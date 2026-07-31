import { test as base } from '@playwright/test'
import { readFileSync } from 'fs'

import usersData from './data/users.data.js'

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

  // eslint-disable-next-line no-empty-pattern
  externalUrl: async ({}, use) => {
    await use(envConfig.values.externalUrl)
  },

  lastNotification: async ({ request }, use) => {
    await use(async (email) => {
      const response = await request.get(`/notifications/last?email=${email}`)

      return response.json()
    })
  },

  load: async ({ request }, use) => {
    await use((data) => {
      return request.post('/system/data/load', { data: _asArrays(data) })
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

  tearDown: async ({ request }, use) => {
    await use(() => {
      return request.post('/system/data/tear-down')
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

/**
 * Data/scenario files may use a singular key naming an entity directly (e.g. `licence`, `company`, `address`)
 * rather than the plural table name the load endpoint expects (`licences`, `companies`, `addresses`), and may
 * return either a single object or an array for it. Normalizing both here means scenario/data files can compose
 * with plain entity names throughout, never having to know or care that the wire format is a pluralized array
 * per key.
 *
 * @private
 */
function _asArrays(data) {
  const result = {}

  for (const key of Object.keys(data)) {
    const value = data[key]

    result[_pluralize(key)] = Array.isArray(value) ? value : [value]
  }

  return result
}

/**
 * A key already ending in a single `s` (`companies`, `licences`, `licenceVersionPurposePoints`) is treated as
 * already plural and left alone, since most entity names in this codebase pluralize with a plain `s` and we
 * can't tell "singular, happens to end in s" apart from "already plural" by spelling alone. `address` and
 * `companyAddress` are the known exceptions — they end in a doubled `ss`, which is never how a word already
 * pluralized this way would end, so that case is handled explicitly (`address` -> `addresses`). Words ending in
 * a consonant + `y` (`company`) pluralize as `-ies`.
 *
 * @private
 */
function _pluralize(word) {
  if (word.endsWith('ss')) {
    return `${word}es`
  }

  if (/[^aeiou]y$/i.test(word)) {
    return `${word.slice(0, -1)}ies`
  }

  if (word.endsWith('s')) {
    return word
  }

  return `${word}s`
}
