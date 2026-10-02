import { summaryRow } from '../../support/helpers/govuk.helpers.js'
import { expect, test } from '../../support/fixtures.js'

test.describe('Submit a nil return (internal)', () => {
  let returnLog
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('licence-with-open-winter-return-log')

    returnLog = scenario.returnLogs[0]
    user = scenario.user
  })

  test.beforeEach(async ({ login }) => {
    await login(user.username)
  })

  test('submit a nil return', async ({ page }) => {
    await page.goto(`/system/return-logs/${returnLog.id}/details`)

    // Abstraction return
    // submit return
    await page.locator('.govuk-button').first().click()

    // When was the return received?
    // select yesterday
    await page.locator('#yesterday').click()
    await page.locator('.govuk-button').click()

    // What do you want to do with this return?
    // choose Enter a nil return and continue
    await page.locator('#nilReturn').click()
    await page.locator('.govuk-button').click()

    // Reporting details
    // Confirm the return is nil and continue
    await expect(summaryRow(page, 'Nil return').locator('.govuk-summary-list__value')).toContainText('Yes')
    await page.locator('.govuk-button').first().click()

    // Return submitted
    // confirm we see the success panel
    await expect(page.locator('.govuk-panel')).toContainText(`Return ${returnLog.returnReference} submitted`)

    // Navigate to the Return page
    // Confirm the return is a nil return
    await page.getByRole('link', { name: 'View this return' }).click()
    await expect(page.locator('[data-test="total"]')).toContainText('Nil return')
  })
})
