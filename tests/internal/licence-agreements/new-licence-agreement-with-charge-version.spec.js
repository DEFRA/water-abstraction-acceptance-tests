import scenarioData from '../../support/scenarios/licence-with-pre-sroc-charge-version.scenario.js'
import { formatLongDate } from '../../support/helpers/date.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('New licence agreement with charge version journey (internal)', () => {
  let licence
  let chargeVersionStartDate

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licences: [scenarioLicence],
      chargeVersions: [scenarioChargeVersion]
    } = scenario

    licence = scenarioLicence

    // With existing charge information, the app accepts a custom start date that matches it, so we use the charge
    // version's start date for the agreement's custom start date. It also pre-dates the SROC scheme, so setting up
    // the agreement against it flags the licence for the next old charge scheme supplementary bill run.
    chargeVersionStartDate = scenarioChargeVersion.startDate

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('setup a new agreement for a license, view it, and confirm it flags the licence for supplementary billing', async ({
    page
  }) => {
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
    // date, matching the licence's existing charge version, then continue
    const [year, month, day] = chargeVersionStartDate.split('-')

    await page.locator('input#isCustomStartDate').check()
    await page.locator('#startDate-day').fill(day)
    await page.locator('#startDate-month').fill(month)
    await page.locator('#startDate-year').fill(year)
    await page.locator('form > .govuk-button').click()

    // Check agreement details
    // confirm the details match what was entered and continue
    await expect(page.locator('.govuk-heading-l', { hasText: 'Check agreement details' })).toBeVisible()
    await expect(page.locator('.govuk-summary-list__value', { hasText: 'Two-part tariff' })).toBeVisible()
    await page.locator('form > .govuk-button').click()

    // Charge information
    // confirm we are back on the Charge Information page and our licence agreement is present
    await expect(page.locator('h1')).toContainText('Licence set up')

    const row = page.getByRole('row').filter({ hasText: 'Two-part tariff' })

    // start date, agreement
    await expect(row.getByRole('cell', { name: formatLongDate(chargeVersionStartDate), exact: true })).toBeVisible()
    await expect(row.getByRole('cell', { name: 'Two-part tariff', exact: true })).toBeVisible()

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
