import scenarioData from '../../support/scenarios/licence-with-all-return-log-statuses.scenario.js'
import { expect, test } from '../../support/fixtures.js'

test.describe('View returns and their status (internal)', () => {
  let licence
  let returnLogs

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    licence = scenario.licence
    returnLogs = scenario.returnLogs

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('lists the returns for a licence and their status', async ({ page }) => {
    await page.goto(`/system/licences/${licence.id}/returns`)

    // confirm we are on the returns tab page
    await expect(page.locator('h1')).toContainText('Returns')

    // confirm we see the expected returns and their statuses
    await expect(page.locator('[data-test="return-reference-0"]')).toContainText(`${returnLogs[0].returnReference}`)
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText('not due yet')

    await expect(page.locator('[data-test="return-reference-1"]')).toContainText(`${returnLogs[1].returnReference}`)
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-reference-2"]')).toContainText(`${returnLogs[2].returnReference}`)
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('due')

    await expect(page.locator('[data-test="return-reference-3"]')).toContainText(`${returnLogs[3].returnReference}`)
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('overdue')

    await expect(page.locator('[data-test="return-reference-4"]')).toContainText(`${returnLogs[4].returnReference}`)
    await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText('open')

    await expect(page.locator('[data-test="return-reference-5"]')).toContainText(`${returnLogs[5].returnReference}`)
    await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText('complete')
  })
})
