import scenarioData from '../../support/scenarios/licence-with-agreement.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('End licence agreement journey (internal)', () => {
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

  test('ends a licence agreement using a valid date and check its flags the licence for supplementary billing', async ({
    page
  }) => {
    await page.goto(`/system/licences/${licence.id}/summary`)

    // Check there are no notification banners present initially
    await expect(page.locator('.govuk-notification-banner__content')).toHaveCount(0)

    // Navigate to the Licence set up page
    await page.locator('nav a', { hasText: 'Licence set up' }).click()
    await expect(page.locator('h1')).toContainText('Licence set up')

    // Charge information
    // On the Charge Information tab select to end the licence
    await page.locator('[data-test="end-agreement-0"]').click()

    // Set agreement end date
    // first check the validation for invalid dates is working
    await page.locator('#endDate-day').fill('01')
    await page.locator('#endDate-month').fill('01')
    await page.locator('#endDate-year').fill('2021')
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary')).toContainText(
      'You must enter an end date that matches some existing charge information or is 31 March.You cannot use a date that is before the agreement start date.'
    )

    // then repeat using a valid date
    await page.locator('#endDate-day').fill('31')
    await page.locator('#endDate-month').fill('03')
    await page.locator('#endDate-year').fill('2022')
    await page.locator('form > .govuk-button').click()

    // You're about to end this agreement
    // confirm the details match what was entered and continue
    const confirmRow = page.locator('tbody tr')

    await expect(confirmRow.locator('td').nth(0)).toContainText('Two-part tariff') // agreement
    await expect(confirmRow.locator('td').nth(1)).toContainText('') // date signed
    await expect(confirmRow.locator('td').nth(2)).toContainText('1 January 2018') // start date
    await expect(confirmRow.locator('td').nth(3)).toContainText('31 March 2022') // end date

    await page.locator('form > .govuk-button', { hasText: 'End agreement' }).click()

    // Charge information
    // confirm we are back on the licence set up tab and our licence agreement is present with an end date and only
    // the delete action available
    await expect(page.locator('h1')).toContainText('Licence set up')

    const row = page.locator('tbody tr', { hasText: 'Two-part tariff' })

    await expect(row.locator('td').nth(0)).toContainText('1 January 2018')
    await expect(row.locator('td').nth(1)).toContainText('31 March 2022')
    await expect(row.locator('td').nth(2)).toContainText('Two-part tariff')
    await expect(row.locator('td').nth(3)).toContainText('')
    await expect(page.locator('[data-test="delete-agreement-0"]')).toBeVisible()
    await expect(page.locator('[data-test="end-agreement-0"]')).toHaveCount(0)

    // Navigate to back to the Licence summary page
    await page.locator('nav a', { hasText: 'Licence summary' }).click()

    // Check the new licence agreement has flagged the licence for supplementary billing
    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
      'This licence has been marked for the next supplementary bill run for the old charge scheme.'
    )
  })
})
