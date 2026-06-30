import { request } from '@playwright/test'
import { readFileSync, writeFileSync } from 'fs'

import coreLicenceScenario from './scenarios/core-licence.js'

const environment = process.env.TEST_ENV ?? 'local'
const envConfig = JSON.parse(readFileSync(`./environments/${environment}.json`, 'utf8'))

export default async function globalSetup() {
  const scenario = coreLicenceScenario()
  writeFileSync('.scenario-data.json', JSON.stringify(scenario))

  const context = await request.newContext({ baseURL: envConfig.config.baseUrl })
  await context.post('/system/data/tear-down')
  await context.post('/system/data/load', { data: scenario })
  await context.dispose()
}
