import scenarioData from '../../support/scenarios/presroc-licence-with-agreement.scenario.js'
import { formatLongDate } from '../../support/helpers/date.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe(
  'Delete licence agreement journey (pre-Sroc) (internal)',
  {
    tag: ['@supplementary-billing', '@presroc'],
    annotation: {
      type: 'info',
      description:
        'When a licence agreement exists for a licence (pre-Sroc), and it is deleted, the licence should be flagged for supplementary billing. '
    }
  },
  () => {
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

    test('deletes a licence agreement and check its flags the licence for supplementary billing', async ({ page }) => {
      await page.goto(`/system/licences/${licence.id}/summary`)

      // Check there are no notification banners present initially
      await expect(page.locator('.govuk-notification-banner__content')).toHaveCount(0)

      // Navigate to the Licence set up page
      await page.locator('nav a', { hasText: 'Licence set up' }).click()
      await expect(page.locator('h1')).toContainText('Licence set up')

      // Charge information
      // On the Licence set up page select to delete the licence
      await page.locator('[data-test="delete-agreement-0"]').click()

      // You're about to delete this agreement
      // confirm we are on the right page and it is showing the right agreement then delete it
      await expect(page.locator('.govuk-heading-l')).toContainText("You're about to delete this agreement")

      const row = page.getByRole('row', { name: 'Two-part tariff' })

      // agreement, date signed, start date, end date
      await expect(row.getByRole('cell')).toHaveText(['Two-part tariff', '', formatLongDate(licence.startDate), ''])

      await page.getByText('Delete agreement').click()

      // Charge information
      // confirm we are back on the Charge Information page and our licence agreement is no longer present
      await expect(page.locator('h1')).toContainText('Licence set up')
      await expect(page.getByText('No agreements for this licence.')).toBeVisible()

      // Navigate to back to the Licence summary page
      await page.locator('nav a', { hasText: 'Licence summary' }).click()

      // Check the deleted licence agreement has flagged the licence for supplementary billing
      await expect(page.locator('.govuk-notification-banner__content')).toContainText(
        'This licence has been marked for the next supplementary bill run for the old charge scheme.'
      )
    })
  }
)
