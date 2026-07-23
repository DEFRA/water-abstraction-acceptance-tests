import scenarioData from '../../support/scenarios/licence-with-presroc-charge-version-and-bill-run.scenario.js'
import { summaryRow } from '../../support/helpers/govuk.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('PRESROC licence transfer (internal)', () => {
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

  test('adds a new charge version which transfers the licence to a new billing account with new address and FAO contact then approves it and confirms licence is flagged for supplementary billing', async ({
    page
  }) => {
    await page.goto(`/system/licences/${licence.id}/set-up`)

    // Confirm we are on the licence set-up page and then click Set up a new charge
    await expect(page.locator('h1')).toContainText('Licence set up')
    await page.getByText('Set up a new charge').click()

    // Select reason for new charge information
    // choose Licence transferred and now chargeable and continue
    await page.locator('input#reason-7').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Set charge start date
    // choose Licence version start date and continue
    await page.locator('input#startDate-2').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select an existing billing account for Big Farm Co Ltd
    // choose Set up a new billing account and continue
    await page.getByRole('radio', { name: 'Set up a new billing account' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Who should the bills go to?
    // choose Another billing contact then enter a name to search for and continue
    await page.locator('input#account-2').click()
    await page.locator('input#accountSearch').fill('Test Farm Co Ltd')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select the account type
    // choose Individual and then enter a name and continue. We choose an individual because Company requires a
    // valid company's house number
    await page.locator('input#accountType-3').click()
    await page.locator('input#personName').fill('Test Farm Co Ltd')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select an existing address for Big Farm Co Ltd
    // choose existing address Big Farm and continue (we already have journeys that use the address lookup so no need to
    // repeat here)
    await page.locator('input#selectedAddress').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Do you need to add an FAO?
    // choose Yes and continue
    await page.locator('input#faoRequired').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Set up a contact
    // choose Add a new department and continue
    await page.locator('input#selectedContact-2').click()
    await page.locator('input#department').fill('Test Farm Manager')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check billing account details
    // check the details are as expected and confirm
    await expect(summaryRow(page, 'Billing contact name').locator('.govuk-summary-list__value')).toContainText(
      'Test Farm Co Ltd'
    )
    await expect(summaryRow(page, 'Billing address').locator('.govuk-summary-list__value')).toContainText('Big Farm')
    await expect(summaryRow(page, 'FAO').locator('.govuk-summary-list__value')).toContainText('Test Farm Manager')
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Use abstraction data to set up the element?
    // choose Yes and continue
    await page.locator('input#useAbstractionData-4').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check charge information
    // check the charge details and element details are as expected and then confirm

    // reason
    await expect(summaryRow(page, 'Reason').locator('.govuk-summary-list__value')).toContainText(
      'Licence transferred and now chargeable'
    )
    // start date
    await expect(summaryRow(page, 'Start date').locator('.govuk-summary-list__value')).toContainText('1 January 2018')
    // billing account
    await expect(summaryRow(page, 'Billing account').locator('.govuk-summary-list__value')).toContainText(
      'Test Farm Co Ltd'
    )
    await expect(summaryRow(page, 'Billing account').locator('.govuk-summary-list__value')).toContainText('Big Farm')
    await expect(summaryRow(page, 'Billing account').locator('.govuk-summary-list__value')).toContainText(
      'Test Farm Manager'
    )
    // licence holder
    await expect(summaryRow(page, 'Licence holder').locator('.govuk-summary-list__value')).toContainText(
      'Big Farm Co Ltd'
    )

    await expect(page.locator('form > section > h2')).toContainText('Element')

    // abstraction period
    await expect(summaryRow(page, 'Abstraction period').locator('.govuk-summary-list__value')).toContainText(
      '1 April to 31 March'
    )
    // annual quantities
    await expect(summaryRow(page, 'Annual quantities').locator('.govuk-summary-list__value')).toContainText(
      '15.54ML authorised'
    )
    // time limit
    await expect(summaryRow(page, 'Time limit').locator('.govuk-summary-list__value')).toContainText('No')
    // source
    await expect(summaryRow(page, 'Source').locator('.govuk-summary-list__value')).toContainText('Unsupported')
    // season
    await expect(summaryRow(page, 'Season').locator('.govuk-summary-list__value')).toContainText('All Year')
    // loss
    await expect(summaryRow(page, 'Loss').locator('.govuk-summary-list__value')).toContainText('Medium')
    // environmental improvement unit charge
    await expect(
      summaryRow(page, 'Environmental Improvement Unit Charge').locator('.govuk-summary-list__value')
    ).toContainText('Other')

    await page.getByRole('button', { name: 'Confirm' }).click()

    // Charge information complete
    // confirm the charge information is submitted and then click to view it
    await expect(page.locator('.govuk-panel__title')).toContainText('Charge information complete')
    await page.locator('a[href*="licences/"]', { hasText: 'View charge information' }).click()

    // Charge information
    // select to review it
    await page.locator('[data-test="review-charge-version-0"]').click()

    // Check charge information
    // approve the new charge version
    await expect(page.locator('strong.govuk-tag--orange')).toContainText('Review')
    await page.locator('input#reviewOutcome').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Charge information
    // confirm our new charge information is APPROVED and that the licence has been flagged for the next supplementary
    // bill run
    await expect(page.getByText('Review')).toHaveCount(0)

    // Navigate to the Licence summary page
    await page.locator('nav a', { hasText: 'Licence summary' }).click()

    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
      'This licence has been marked for the next supplementary bill run for the old charge scheme.'
    )
  })
})
