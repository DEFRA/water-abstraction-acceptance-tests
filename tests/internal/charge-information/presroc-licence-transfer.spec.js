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

  test(
    'adds a new charge version which transfers the licence to a new billing account with new address and FAO contact then approves it and confirms licence is flagged for supplementary billing',
    {
      annotation: {
        type: 'description',
        description:
          'Transfers a pre-SRoC licence to a new billing account (new address, FAO contact) reusing its existing charge information, then approves the resulting charge version via the review flow and confirms the licence is flagged for the next supplementary bill run on the old charge scheme.'
      }
    },
    async ({ page }) => {
      await page.goto(`/system/licences/${licence.id}/set-up`)

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByText('Set up a new charge').click()

      await expect(page.locator('h1')).toContainText('Select reason for new charge information')
      await page.getByRole('radio', { name: 'Licence transferred and now chargeable' }).check()
      await page.locator('form > .govuk-button').click()

      await expect(page.locator('h1')).toContainText('Set charge start date')
      await page.getByRole('radio', { name: 'Licence version start date' }).check()
      await page.locator('form > .govuk-button').click()

      await expect(page.locator('h1')).toContainText('Select an existing billing account for Big Farm Co Ltd')
      await page.getByRole('radio', { name: 'Set up a new billing account' }).check()
      await page.locator('form > .govuk-button').click()

      await expect(page.locator('h1')).toContainText('Who should the bills go to?')
      await page.getByRole('radio', { name: 'Another billing contact' }).check()
      await page.getByLabel('Search for organisation or individual').fill('Test Farm Co Ltd')
      await page.locator('form > .govuk-button').click()

      await expect(page.locator('h1')).toContainText('Select the account type')
      await page.getByRole('radio', { name: 'Individual' }).check()
      await page.getByLabel('Full name').fill('Test Farm Co Ltd')
      await page.locator('form > .govuk-button').click()

      await expect(page.locator('h1')).toContainText('Select an existing address for Big Farm Co Ltd')
      await page.getByRole('radio').first().check()
      await page.locator('form > .govuk-button').click()

      await expect(page.locator('h1')).toContainText('Do you need to add an FAO?')
      await page.getByRole('radio').first().check()
      await page.locator('form > .govuk-button').click()

      await expect(page.locator('h1')).toContainText('Set up a contact')
      await page.getByRole('radio', { name: 'Add a new department' }).check()
      await page.getByRole('textbox', { name: 'Department name' }).fill('Test Farm Manager')
      await page.locator('form > .govuk-button').click()

      await expect(page.locator('h1')).toContainText('Check billing account details')
      await expect(page.locator('.govuk-summary-list__value', { hasText: 'Test Farm Co Ltd' })).toBeVisible()
      await expect(page.locator('.govuk-summary-list__value', { hasText: 'Big Farm' })).toBeVisible()
      await expect(page.locator('.govuk-summary-list__value', { hasText: 'Test Farm Manager' })).toBeVisible()
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1')).toContainText('Use abstraction data to set up the element?')
      await page
        .getByRole('radio', { name: `Use charge information valid from ${formatLongDate(chargeVersion.startDate)}` })
        .check()
      await page.locator('form > .govuk-button').click()

      await expect(page.locator('h1')).toContainText('Check charge information')
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

      await expect(page.locator('h1').last()).toContainText('Charge information complete')
      await page.getByRole('link', { name: 'View charge information' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('link', { name: 'Review' }).click()

      await expect(page.locator('h1').last()).toContainText('Do you want to approve this charge information?')
      await page
        .getByRole('group')
        .filter({ has: page.getByRole('radio', { name: 'No, request a change' }) })
        .getByRole('radio')
        .first()
        .check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await expect(page.getByText('Review', { exact: true })).not.toBeVisible()
      await page.locator('nav a', { hasText: 'Licence summary' }).click()

      await expect(page.locator('.govuk-notification-banner__content')).toContainText(
        'This licence has been marked for the next supplementary bill run for the old charge scheme.'
      )
    }
  )
})
