import scenarioData from '../../support/scenarios/licence-with-pre-sroc-charge-version.scenario.js'
import { convertCubicMetresToMegalitres } from '../../support/helpers/conversion.helpers.js'
import { formatLongDate } from '../../support/helpers/date.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Presroc licence transfer journey (internal)', () => {
  let chargeVersion
  let licence
  let licenceVersionPurpose

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      chargeVersions: [scenarioChargeVersion],
      licences: [scenarioLicence],
      licenceVersionPurposes: [scenarioLicenceVersionPurpose]
    } = scenario

    chargeVersion = scenarioChargeVersion
    licence = scenarioLicence
    licenceVersionPurpose = scenarioLicenceVersionPurpose

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
    await page.getByRole('radio', { name: 'Licence transferred and now chargeable' }).check()
    await page.locator('form > .govuk-button').click()

    // Set charge start date
    await page.getByRole('radio', { name: 'Licence version start date' }).check()
    await page.locator('form > .govuk-button').click()

    // Select an existing billing account
    await page.getByRole('radio', { name: 'Set up a new billing account' }).check()
    await page.locator('form > .govuk-button').click()

    // Who should the bills go to?
    await page.getByRole('radio', { name: 'Another billing contact' }).check()
    await page.getByLabel('Search for organisation or individual').fill('Test Farm Co Ltd')
    await page.locator('form > .govuk-button').click()

    // Select the account type
    // choose Individual and then enter a name and continue. We choose an individual because Company requires a
    // valid company's house number
    await page.getByRole('radio', { name: 'Individual' }).check()
    await page.getByLabel('Full name').fill('Test Farm Co Ltd')
    await page.locator('form > .govuk-button').click()

    // Select an existing address for Big Farm Co Ltd
    // choose existing address Big Farm and continue (we already have journeys that use the address lookup so no
    // need to repeat here)
    await page.getByRole('radio').first().check()
    await page.locator('form > .govuk-button').click()

    // Do you need to add an FAO?
    // choose Yes and continue
    // NOTE: the "Yes" radio has no accessible name in the rendered markup (its <label> shares an id with two
    // other elements, breaking the label association), so it can't be targeted by role/name. Target it by
    // position instead, since it is the first of only two radios in the group
    await page.getByRole('radio').first().check()
    await page.locator('form > .govuk-button').click()

    // Set up a contact
    // choose Add a new department and continue
    await page.getByRole('radio', { name: 'Add a new department' }).check()
    await page.getByRole('textbox', { name: 'Department name' }).fill('Test Farm Manager')
    await page.locator('form > .govuk-button').click()

    // Check billing account details
    // check the details are as expected and confirm
    await expect(page.locator('.govuk-summary-list__value', { hasText: 'Test Farm Co Ltd' })).toBeVisible()
    await expect(page.locator('.govuk-summary-list__value', { hasText: 'Big Farm' })).toBeVisible()
    await expect(page.locator('.govuk-summary-list__value', { hasText: 'Test Farm Manager' })).toBeVisible()
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Use abstraction data to set up the element?
    // choose to use the licence's existing charge information and continue
    await page
      .getByRole('radio', { name: `Use charge information valid from ${formatLongDate(chargeVersion.startDate)}` })
      .check()
    await page.locator('form > .govuk-button').click()

    // Check charge information
    // check the charge details and element details are as expected and then confirm
    await expect(
      page.locator('.govuk-summary-list__value', { hasText: 'Licence transferred and now chargeable' })
    ).toBeVisible()
    await expect(
      page.locator('.govuk-summary-list__value', { hasText: formatLongDate(chargeVersion.startDate) })
    ).toBeVisible()

    const annualQuantity = convertCubicMetresToMegalitres(licenceVersionPurpose.annualQuantity)

    await expect(
      page.locator('.govuk-summary-list__value', { hasText: `${annualQuantity}ML authorised` })
    ).toBeVisible()
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Charge information complete
    // confirm the charge information is submitted and then click to view it
    await expect(page.locator('.govuk-panel__title')).toContainText('Charge information complete')
    await page.getByRole('link', { name: 'View charge information' }).click()

    // Charge information
    // select to review it
    await page.getByRole('link', { name: 'Review' }).click()

    // Check charge information
    // approve the new charge version
    // NOTE: the "Yes, approve" radio has no accessible name in the rendered markup (its <label> shares an id
    // with two other elements, breaking the label association), so it can't be targeted by role/name. Target it
    // by position instead, since it is the first of only two radios in the group
    await expect(page.getByText('Review', { exact: true })).toBeVisible()
    await page
      .getByRole('group')
      .filter({ has: page.getByRole('radio', { name: 'No, request a change' }) })
      .getByRole('radio')
      .first()
      .check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Charge information
    // confirm our new charge information is APPROVED and that the licence has been flagged for the next
    // supplementary bill run
    await expect(page.getByText('Review', { exact: true })).not.toBeVisible()

    // Navigate to the Licence summary page
    await page.locator('nav a', { hasText: 'Licence summary' }).click()

    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
      'This licence has been marked for the next supplementary bill run for the old charge scheme.'
    )
  })
})
