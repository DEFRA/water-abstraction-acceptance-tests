import scenarioData from '../../support/scenarios/licence-with-workflow-and-annual-bill-run.scenario.js'
import { formatLongDate } from '../../support/helpers/date.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe(
  'Cancelling a licence in workflow with an annual bill run (internal)',
  {
    tag: ['@presroc', '@supplementary-billing'],
    annotation: {
      type: 'description',
      description:
        'When the licence is in workflow, and you cancel a workflow item, and there is an annual bill run, and the workflow was created before the bill run, the licence should be flagged for supplementary billing'
    }
  },
  () => {
    let company
    let licence

    test.beforeAll(async ({ calculatedDates, setup }) => {
      const dates = await calculatedDates()
      const scenario = scenarioData(dates)

      const {
        licences: [scenarioLicence],
        companies: [scenarioCompany]
      } = scenario

      licence = scenarioLicence
      company = scenarioCompany

      await setup(scenario)
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('flags the licence for supplementary billing', async ({ page, users }) => {
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

      await expect(page.locator('.govuk-notification-banner__content')).toContainText(
        'This licence has been marked for the next supplementary bill run.'
      )
    })
  }
)
