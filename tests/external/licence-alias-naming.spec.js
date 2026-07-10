import scenarioData from '../support/scenarios/registered-licence.scenario.js'
import { test, expect } from '../support/fixtures.js'

test.describe('Licence alias naming (external)', () => {
  let licenceDocumentHeader
  let user

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licenceDocumentHeaders: [scenarioLicenceDocumentHeader],
      users: [scenarioUser]
    } = scenario

    licenceDocumentHeader = scenarioLicenceDocumentHeader
    user = scenarioUser

    await setup(scenario)
  })

  test.beforeEach(async ({ loginExternal }) => {
    await loginExternal(user.username)
  })

  test('creates the alias name for the licence the user is holding', async ({ page, externalUrl }) => {
    const alias = 'the new daily cupcake licence'

    await page.goto(`${externalUrl}/licences/${licenceDocumentHeader.id}`)

    await page.locator('.govuk-summary-list__value > a', { hasText: 'Rename this licence' }).click()
    await page.locator('#name').clear()

    // Check it validates for empty alias
    await page.locator('#name').fill('   ')
    await page.locator('form > .govuk-button', { hasText: 'Save' }).click()
    await expect(page.locator('.govuk-error-summary')).toContainText('There is a problem')

    // Enter the new name
    await page.locator('#name').fill(alias)
    await page.locator('form > .govuk-button', { hasText: 'Save' }).click()
    await expect(page.locator('#summary')).toContainText(alias)
  })
})
