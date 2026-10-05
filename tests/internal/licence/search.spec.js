import { expect, test } from '../../support/fixtures.js'

test.describe('Search for a licence (internal)', () => {
  let licence
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('licence')

    licence = scenario.licence
    user = scenario.user
  })

  test.beforeEach(async ({ login }) => {
    await login(user)
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
