import scenarioData from '../../support/scenarios/registered-licence-with-all-return-log-statuses.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('View return statuses (external)', () => {
  let licence
  let returnLogs
  let user

  test.beforeAll(async ({ setup, calculatedDates }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    const {
      licences: [scenarioLicence],
      returnLogs: scenarioReturnLogs,
      users: [scenarioUser]
    } = scenario

    licence = scenarioLicence
    returnLogs = scenarioReturnLogs
    user = scenarioUser

    await setup(scenario)
  })

  test.beforeEach(async ({ loginExternal }) => {
    await loginExternal(user.username)
  })

  test('login as an existing user and view returns', async ({ page, externalUrl }) => {
    const returnLog = (reference) => {
      return returnLogs.find((log) => {
        return log.returnReference === reference
      })
    }

    await page.goto(`${externalUrl}/licences`)

    await page.getByRole('link', { name: licence.licenceRef }).click()
    await page.locator('#tab_returns').click()

    await expect(page.locator('#returns')).toBeVisible()

    const returnsTable = page.locator('#returns .govuk-table__body')

    const statuses = (await returnsTable.locator('.govuk-tag').allTextContents()).map((status) => {
      return status.trim()
    })

    expect(statuses).not.toContain('not yet due')
    expect(statuses).not.toContain('void')

    await expect(
      returnsTable.locator('tr', { hasText: `${returnLog(9999990).returnReference}` }).locator('.govuk-tag')
    ).toContainText('complete')

    await expect(
      returnsTable.locator('tr', { hasText: `${returnLog(9999991).returnReference}` }).locator('.govuk-tag')
    ).toContainText('open')

    await expect(
      returnsTable.locator('tr', { hasText: `${returnLog(9999992).returnReference}` }).locator('.govuk-tag')
    ).toContainText('overdue')

    await expect(
      returnsTable.locator('tr', { hasText: `${returnLog(9999993).returnReference}` }).locator('.govuk-tag')
    ).toContainText('due')
  })
})
