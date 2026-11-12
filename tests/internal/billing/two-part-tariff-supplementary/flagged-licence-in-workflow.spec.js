import scenarioData from '../../../support/scenarios/licence-flagged-for-tpt-supplementary-in-workflow.scenario.js'
import { calculatedDates } from '../../../support/helpers/calculated-dates.helpers.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { expect, test } from '../../../support/fixtures.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe('Send a two-part tariff supplementary bill run (internal)', { tag: '@supplementary-billing' }, () => {
  let endYear

  test.beforeAll(async ({ setup }) => {
    const {
      billingPeriods: {
        twoPartTariff: [twoPartTariffPeriod]
      }
    } = calculatedDates()

    endYear = new Date(twoPartTariffPeriod.endDate).getFullYear()

    const scenario = scenarioData()

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test(
    'creates an SROC two-part tariff supplementary bill run and confirm the licence is not included',
    {
      annotation: {
        description: `A licence that is current and in workflow, has one applicable charge version with a single charge reference and two two-part tariff charge elements, and two completed returns matching them. The licence also has a sent two-part tariff bill run for the same year, which is what flags it for the next two-part tariff supplementary bill run.

**Acceptance Criteria**
- The licence should NOT appear in the bill run`,
        type: 'tpt-supplementary-journey'
      }
    },
    async ({ page }) => {
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Two-part tariff supplementary' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: 'Test Region' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the financial year')
      await page.locator(`input[value="${endYear}"]`).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      // We already have one sent two-part tariff bill run seeded (that's what flags the licence for supplementary
      // billing), so the one we just created is identified by position: it will be the top result. We expect its
      // status to be BUILDING. Building might take a few seconds though so to avoid the test failing we look for the
      // status EMPTY, and if not found reload the page and try again.
      //
      // The status being EMPTY asserts that the licence as NOT been picked up which is the expected behaviour
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'empty')
      await expect(page.locator('[data-test="date-created-0"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-0"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-0"]')).toContainText('Two-part tariff')
    }
  )
})
