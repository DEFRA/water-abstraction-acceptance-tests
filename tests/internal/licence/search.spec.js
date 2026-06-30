import { test, expect } from '../../support/fixtures.js'
import scenarioData from '../../scenarios/core-licence.js'

const scenario = scenarioData()

test.describe('Search for a licence (internal)', () => {
  test.beforeEach(async ({ login, users }) => {
    await login(users.super)
  })

  test('can find a licence using various search values', async ({ page }) => {
    const { licenceRef } = scenario.licences[0]

    await page.goto('/')

    await page.locator('#query').fill(licenceRef)
    await page.locator('#search-button').click()
    await expect(page.locator('.searchresult-row')).toContainText(licenceRef)

    await page.locator('#query').fill(licenceRef.toLowerCase())
    await page.locator('#search-button').click()
    await expect(page.locator('.searchresult-row')).toContainText(licenceRef)

    await page.locator('#query').fill(licenceRef.slice(0, -1))
    await page.locator('#search-button').click()
    await expect(page.locator('.searchresult-row')).toContainText(licenceRef)
  })
})
