import { request } from '@playwright/test'
import { readFileSync } from 'fs'

import coreLicenceScenario from './scenarios/core-licence.js'

const environment = process.env.TEST_ENV ?? 'local'
const envConfig = JSON.parse(readFileSync(`./environments/${environment}.json`, 'utf8'))

export default async function globalSetup() {
  const context = await request.newContext({ baseURL: envConfig.config.baseUrl })
  // Teardown existing data before trying to add the same data again
  await context.post('/system/data/tear-down')
  await context.post('/system/data/load', { data: coreLicenceScenario() })
  await context.dispose()
}
