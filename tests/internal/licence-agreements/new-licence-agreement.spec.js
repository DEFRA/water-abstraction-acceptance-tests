import scenarioData from '../../support/scenarios/licence.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('New licence agreement journey (internal)', () => {
  let licence

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licences: [scenarioLicence]
    } = scenario

    licence = scenarioLicence

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('setup a new agreement for a license and then view it', async ({ page }) => {
    await page.goto(`/system/licences/${licence.id}/summary`)

    // Check there are no notification banners present initially
    await expect(page.locator('.govuk-notification-banner__content')).toHaveCount(0)

    // Navigate to the Licence set up page
    await page.locator('nav a', { hasText: 'Licence set up' }).click()
    await expect(page.locator('h1')).toContainText('Licence set up')

    // Confirm we are on the tab page and then click Set up a new agreement
    await expect(page.getByText('Charge information', { exact: true })).toBeVisible()
    await page.getByText('Set up a new agreement').click()

    // Select agreement
    // select Two-part tariff then continue
    // NOTE: the "Two-part tariff" radio has no accessible name in the rendered markup (its <label> shares an id
    // with two other elements, breaking the label association), so it can't be targeted by role/name. Target it by
    // its value instead, which is the S127 financial agreement code used to seed this scenario.
    await page.locator('input[value="S127"]').check()
    await page.locator('form > .govuk-button').click()

    // Do you know the date the agreement was signed?
    // select No and continue
    await page.locator('#isDateSignedKnown-2').check()
    await page.locator('form > .govuk-button').click()

    // Check agreement start date
    // select Yes to set a different agreement start date. A section appears allowing the user to enter the custom
    // date then continue
    await page.locator('input#isCustomStartDate').check()
    await page.locator('#startDate-day').fill('01')
    await page.locator('#startDate-month').fill('04')
    await page.locator('#startDate-year').fill('2018')
    await page.locator('form > .govuk-button').click()

    // Check agreement details
    // confirm the details match what was entered and continue
    await expect(page.locator('.govuk-heading-l', { hasText: 'Check agreement details' })).toBeVisible()
    await expect(page.locator('.govuk-summary-list__value', { hasText: 'Two-part tariff' })).toBeVisible()
    await page.locator('form > .govuk-button').click()

    // Charge information
    // confirm we are back on the Charge Information page and our licence agreement is present
    await expect(page.locator('h1')).toContainText('Licence set up')

    const row = page.locator('tbody tr', { hasText: '1 April 2018' })

    await expect(row.locator('td').nth(0)).toContainText('1 April 2018') // start date
    await expect(row.locator('td').nth(1)).toContainText('') // end date
    await expect(row.locator('td').nth(2)).toContainText('Two-part tariff') // agreement
    await expect(row.locator('td').nth(3)).toContainText('') // date signed

    // actions
    await expect(page.locator('[data-test="delete-agreement-0"]')).toBeVisible()
    await expect(page.locator('[data-test="end-agreement-0"]')).toBeVisible()

    // Navigate to back to the Licence summary page
    await page.locator('nav a', { hasText: 'Licence summary' }).click()

    // Check the new licence agreement has flagged the licence for supplementary billing
    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
      'This licence has been marked for the next supplementary bill run for the old charge scheme.'
    )
  })
})
