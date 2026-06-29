import { request } from '@playwright/test'
import { readFileSync } from 'fs'

const environment = process.env.TEST_ENV ?? 'local'
const envConfig = JSON.parse(readFileSync(`./environments/${environment}.json`, 'utf8'))

export default async function globalSetup() {
  const context = await request.newContext({ baseURL: envConfig.config.baseUrl })
  await context.post('/system/data/tear-down')
  await context.dispose()
}