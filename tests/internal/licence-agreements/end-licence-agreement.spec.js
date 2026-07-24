import scenarioData from '../../support/scenarios/licence-with-agreement.scenario.js'
import { formatLongDate } from '../../support/helpers/date.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('End licence agreement journey (internal)', () => {
  let licence
  let invalidEndDateYear
  let validEndDateYear

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licences: [scenarioLicence]
    } = scenario

    licence = scenarioLicence

    // The agreement's start date matches the licence's start date, which is always 1 April. A valid end date must
    // either match existing charge information or be 31 March, and cannot be before the agreement start date, so we
    // use 31 March of the following year. The invalid date only needs to be before the start date.
    const startDateYear = new Date(licence.startDate).getUTCFullYear()

    invalidEndDateYear = startDateYear - 1

    validEndDateYear = startDateYear + 1

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
    await page.locator('#endDate-year').fill(String(invalidEndDateYear))
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary')).toContainText(
      'You must enter an end date that matches some existing charge information or is 31 March.You cannot use a date that is before the agreement start date.'
    )

    // then repeat using a valid date
    await page.locator('#endDate-day').fill('31')
    await page.locator('#endDate-month').fill('03')
    await page.locator('#endDate-year').fill(String(validEndDateYear))
    await page.locator('form > .govuk-button').click()

    // You're about to end this agreement
    // confirm the details match what was entered and continue
    const confirmRow = page.getByRole('row', { name: 'Two-part tariff' })

    // agreement, date signed, start date, end date
    await expect(confirmRow.getByRole('cell')).toHaveText([
      'Two-part tariff',
      '',
      formatLongDate(licence.startDate),
      formatLongDate(validEndDateYear + '-03-31')
    ])

    await page.locator('form > .govuk-button', { hasText: 'End agreement' }).click()

    // Charge information
    // confirm we are back on the licence set up tab and our licence agreement is present with an end date and only
    // the delete action available
    await expect(page.locator('h1')).toContainText('Licence set up')

    const row = page.getByRole('row', { name: 'Two-part tariff' })

    // start date, end date, agreement, date signed
    await expect(row.getByRole('cell')).toHaveText([
      formatLongDate(licence.startDate),
      formatLongDate(validEndDateYear + '-03-31'),
      'Two-part tariff',
      ''
    ])
    await expect(page.locator('[data-test="delete-agreement-0"]')).toBeVisible()
    await expect(page.locator('[data-test="end-agreement-0"]')).toHaveCount(0)
  })
})
