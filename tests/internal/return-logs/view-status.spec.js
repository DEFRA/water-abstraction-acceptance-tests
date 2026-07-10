import scenarioData from '../../support/scenarios/return-statuses.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('View returns and their status (internal)', () => {
  let licence
  let returnLogs

  test.beforeAll(async ({ setup, calculatedDates }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    const {
      licences: [licenceScenario],
      returnLogs: returnLogsScenario
    } = scenario

    licence = licenceScenario
    returnLogs = returnLogsScenario

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('lists the returns for a licence and their status', async ({ page }) => {
    const returnLog = (returnReference) => {
      return returnLogs.find((log) => {
        return log.returnReference === returnReference
      })
    }

    await page.goto(`/system/licences/${licence.id}/returns`)

    // confirm we are on the returns tab page
    await expect(page.locator('h1')).toContainText('Returns')

    // confirm we see the expected returns and their statuses
    await expect(page.locator('[data-test="return-reference-0"]')).toContainText(
      `${returnLog(9999995).returnReference}`
    )
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText('not due yet')

    await expect(page.locator('[data-test="return-reference-1"]')).toContainText(
      `${returnLog(9999994).returnReference}`
    )
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-reference-2"]')).toContainText(
      `${returnLog(9999993).returnReference}`
    )
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('due')

    await expect(page.locator('[data-test="return-reference-3"]')).toContainText(
      `${returnLog(9999992).returnReference}`
    )
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('overdue')

    await expect(page.locator('[data-test="return-reference-4"]')).toContainText(
      `${returnLog(9999991).returnReference}`
    )
    await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText('open')

    await expect(page.locator('[data-test="return-reference-5"]')).toContainText(
      `${returnLog(9999990).returnReference}`
    )
    await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText('complete')
  })
})
