import scenarioData from '../../support/scenarios/licence.js'
import { test, expect } from '../../support/fixtures.js'

const scenario = scenarioData()

const {
  licences: [licence]
} = scenario

test.describe('Search for a licence (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.super)
  })

  test('can find a licence by exact licence reference', async ({ page }) => {
    await page.goto('/')
    await page.locator('#query').fill(licence.licenceRef)
    await page.locator('#search-button').click()
    await expect(page.locator('.searchresult-row')).toContainText(licence.licenceRef)
  })

  test('can find a licence by lowercase licence reference', async ({ page }) => {
    await page.goto('/')
    await page.locator('#query').fill(licence.licenceRef.toLowerCase())
    await page.locator('#search-button').click()
    await expect(page.locator('.searchresult-row')).toContainText(licence.licenceRef)
  })

  test('can find a licence by partial licence reference', async ({ page }) => {
    await page.goto('/')
    await page.locator('#query').fill(licence.licenceRef.slice(0, -1))
    await page.locator('#search-button').click()
    await expect(page.locator('.searchresult-row')).toContainText(licence.licenceRef)
  })
})
