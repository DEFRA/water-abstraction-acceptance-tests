import { calculatedDates } from '../../support/helpers/calculated-dates.helpers.js'
import { returnLogDateDetails } from '../../support/helpers/date.helpers.js'
import scenarioData from '../../support/scenarios/licence-with-two-return-requirements-and-historic-return-logs.scenario.js'
import { expect, test } from '../../support/fixtures.js'

test.describe('Submit historic correction using abstraction data for licence with two purposes (internal)', () => {
  let licence
  let startYear
  let purpose400Current
  let purpose400Previous
  let purpose420Current
  let purpose420Previous

  test.beforeAll(async ({ setup }) => {
    const { currentWinterReturnCycle } = calculatedDates()

    startYear = new Date(currentWinterReturnCycle.startDate).getFullYear()

    const scenario = scenarioData()

    licence = scenario.licence

    const [purpose400CurrentLog, purpose400PreviousLog, purpose420CurrentLog, purpose420PreviousLog] =
      scenario.returnLogs

    purpose400Current = {
      ...returnLogDateDetails(purpose400CurrentLog),
      returnReference: purpose400CurrentLog.returnReference
    }
    purpose400Previous = {
      ...returnLogDateDetails(purpose400PreviousLog),
      returnReference: purpose400PreviousLog.returnReference
    }
    purpose420Current = {
      ...returnLogDateDetails(purpose420CurrentLog),
      returnReference: purpose420CurrentLog.returnReference
    }
    purpose420Previous = {
      ...returnLogDateDetails(purpose420PreviousLog),
      returnReference: purpose420PreviousLog.returnReference
    }

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('adds a new return version using abstraction data for a licence with two purposes', async ({ page }) => {
    // The two purposes' return requirements are seeded with independent random references, so we can't assume which
    // sorts first on the page - look each row up by its known reference instead. A reference alone isn't enough
    // though: the same requirement's current and previous period logs share it, so filter on the date range too
    const returnRow = (reference, dateString) => {
      return page
        .locator('tr')
        .filter({ hasText: `${reference}` })
        .filter({ hasText: dateString })
    }

    await page.goto(`/system/licences/${licence.id}/returns`)

    await expect(page.locator('h1')).toContainText('Returns')

    await expect(
      returnRow(purpose420Current.returnReference, purpose420Current.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText(purpose420Current.status)
    await expect(
      returnRow(purpose400Current.returnReference, purpose400Current.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText(purpose400Current.status)
    await expect(
      returnRow(purpose420Previous.returnReference, purpose420Previous.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText(purpose420Previous.status)
    await expect(
      returnRow(purpose400Previous.returnReference, purpose400Previous.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText(purpose400Previous.status)

    await page.getByText('Licence set up').click()

    await expect(page.locator('h1')).toContainText('Licence set up')
    await page.getByText('Set up new requirements').click()

    await expect(page.locator('h1')).toContainText('Select the start date for the requirements for returns')
    await page.getByRole('radio', { name: 'Another date' }).check()
    await page.locator('#startDateDay').fill('01')
    await page.locator('#startDateMonth').fill('09')
    await page.locator('#startDateYear').fill(`${startYear - 1}`)
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select the reason for the requirements for returns')
    await page.locator('#newLicence').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('How do you want to set up the requirements for returns?')
    await page.locator('#useAbstractionData').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await page.getByText('Approve returns requirement').click()

    await expect(page.locator('.govuk-panel__title')).toContainText('Requirements for returns approved')
    await page.getByText('Return to licence set up').click()
    await page.getByRole('link', { name: 'Returns' }).click()

    await expect(page.locator('h1')).toContainText('Returns')

    // The four original return logs are now superseded by the new return version, so all four are void - this we can
    // confirm by looking each up by its known reference, regardless of where the page now lists it
    await expect(
      returnRow(purpose420Current.returnReference, purpose420Current.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText('void')
    await expect(
      returnRow(purpose400Current.returnReference, purpose400Current.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText('void')
    await expect(
      returnRow(purpose420Previous.returnReference, purpose420Previous.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText('void')
    await expect(
      returnRow(purpose400Previous.returnReference, purpose400Previous.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText('void')

    // The new return version creates 6 more return logs, whose references aren't known ahead of the journey creating
    // them, so we confirm them by status count instead of position: 2 new current periods (not due yet) plus 4 new
    // split logs for the previous period (open)
    const statuses = (await page.locator('[data-test^="return-status-"] > .govuk-tag').allTextContents()).map(
      (status) => {
        return status.trim()
      }
    )

    expect(statuses).toHaveLength(10)
    expect(
      statuses.filter((status) => {
        return status === 'void'
      })
    ).toHaveLength(4)
    expect(
      statuses.filter((status) => {
        return status === 'not due yet'
      })
    ).toHaveLength(2)
    expect(
      statuses.filter((status) => {
        return status === 'open'
      })
    ).toHaveLength(4)
  })
})
