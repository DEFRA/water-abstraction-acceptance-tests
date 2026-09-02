import scenarioData from '../../support/scenarios/registered-licence-with-all-return-log-statuses.scenario.js'
import { expect, test } from '../../support/fixtures.js'

test.describe('View return statuses (external)', () => {
  let licence
  let returnLogs
  let user

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    licence = scenario.licence
    returnLogs = scenario.returnLogs
    user = scenario.user

    await setup(scenario)
  })

  test.beforeEach(async ({ loginExternal }) => {
    await loginExternal(user.username)
  })

  test('login as an existing user and view returns', async ({ page, externalUrl }) => {
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
      returnsTable.locator('tr', { hasText: `${returnLogs[5].returnReference}` }).locator('.govuk-tag')
    ).toContainText('complete')

    await expect(
      returnsTable.locator('tr', { hasText: `${returnLogs[4].returnReference}` }).locator('.govuk-tag')
    ).toContainText('open')

    await expect(
      returnsTable.locator('tr', { hasText: `${returnLogs[3].returnReference}` }).locator('.govuk-tag')
    ).toContainText('overdue')

    await expect(
      returnsTable.locator('tr', { hasText: `${returnLogs[2].returnReference}` }).locator('.govuk-tag')
    ).toContainText('due')
  })
})
