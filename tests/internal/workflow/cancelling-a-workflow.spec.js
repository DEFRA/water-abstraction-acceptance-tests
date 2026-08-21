import { formatLongDate } from '../../support/helpers/date.helpers.js'
import scenarioData from '../../support/scenarios/licence-with-workflow.scenario.js'
import { expect, test } from '../../support/fixtures.js'

test.describe(
  'Cancelling a licence in workflow (internal)',
  {
    tag: '@supplementary-billing',
    annotation: {
      type: 'description',
      description:
        'When the licence is in workflow, and you cancel a workflow item and there are no bill runs, the licence should not be flagged for supplementary billing'
    }
  },
  () => {
    let company
    let licence

    test.beforeAll(async ({ setup }) => {
      const scenario = scenarioData()

      licence = scenario.licence
      company = scenario.company

      await setup(scenario)
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('does not flag the licence for supplementary billing', async ({ page, users }) => {
      await page.goto(`/system/licences/${licence.id}/summary`)

      await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
      await expect(page.locator('.govuk-notification-banner__content')).not.toBeVisible()
      await page.getByRole('link', { name: 'Manage', exact: true }).click()
      await page.getByRole('link', { name: 'Check licences in workflow' }).click()

      await expect(page.locator('h1').first()).toContainText('Workflow')
      await page.getByRole('tab', { name: 'Review charge information' }).click()
      const reviewChargeInformationTable = page.locator('table.govuk-table')
      const reviewChargeInformationRow = reviewChargeInformationTable.getByRole('row', { name: licence.licenceRef })
      await expect(reviewChargeInformationRow.getByRole('cell')).toHaveText([
        licence.licenceRef,
        company.name,
        users.billingAndData,
        formatLongDate(licence.startDate),
        'Review'
      ])
      await reviewChargeInformationRow.getByRole('link', { name: 'Review' }).click()

      await expect(page.locator('h1').last()).toContainText('Do you want to approve this charge information?')
      await page.getByRole('button', { name: 'Cancel charge information' }).click()

      await expect(page.locator('h1')).toContainText("You're about to cancel this charge information")
      await page.getByRole('button', { name: 'Cancel' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('link', { name: 'Licence summary' }).click()

      await expect(page.locator('.govuk-notification-banner')).not.toBeVisible()
    })
  }
)
