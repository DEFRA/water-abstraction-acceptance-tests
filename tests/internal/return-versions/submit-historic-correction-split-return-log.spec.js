import { calculatedDates } from '../../support/helpers/calculated-dates.helpers.js'
import { returnLogDateDetails } from '../../support/helpers/date.helpers.js'
import scenarioData from '../../support/scenarios/licence-with-open-winter-return-log.scenario.js'
import { tableRow } from '../../support/helpers/govuk.helpers.js'
import { expect, test } from '../../support/fixtures.js'

test.describe('Submit historic correction that results in a split-log (internal)', () => {
  let licence
  let oldReference
  let startYear
  let truncatedOldPeriod
  let newFromSplitPeriod
  let currentCyclePeriod
  let previousCyclePeriod

  test.beforeAll(async ({ setup }) => {
    const { currentFinancialYear } = calculatedDates()

    startYear = new Date(currentFinancialYear.startDate).getFullYear()

    const scenario = scenarioData()

    licence = scenario.licence
    oldReference = `${scenario.returnRequirement.reference}`

    // The correction splits the previous winter cycle return log at 1 September, so the old requirement's log for
    // that cycle is truncated to end the day before, and a new log covering the remainder is created
    const splitDate = new Date(`${startYear - 1}-09-01`)
    const truncatedOldPeriodEnd = new Date(splitDate)

    truncatedOldPeriodEnd.setUTCDate(truncatedOldPeriodEnd.getUTCDate() - 1)

    truncatedOldPeriod = returnLogDateDetails({
      startDate: scenario.returnLogs[0].startDate,
      endDate: truncatedOldPeriodEnd
    })
    newFromSplitPeriod = returnLogDateDetails({ startDate: splitDate, endDate: scenario.returnLogs[0].endDate })
    currentCyclePeriod = returnLogDateDetails(scenario.returnLogs[1])
    previousCyclePeriod = returnLogDateDetails(scenario.returnLogs[0])

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('adds a return version to a licence part way through the previous winter cycle resulting in a split-log', async ({
    page
  }) => {
    await page.goto(`/system/licences/${licence.id}/returns`)

    // confirm we are on the licence returns tab and that there are previous return logs
    await expect(page.locator('h1')).toContainText('Returns')

    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText('not due yet')
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('open')

    // click licence set up tab
    await page.getByText('Licence set up').click()

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Licence set up')

    // click set up new requirements
    await page.getByText('Set up new requirements').click()

    // set the start date to be 1 year in the past, and mid-way through the existing return log's
    // period so that it splits rather than aligning with the period's start
    await page.getByRole('radio', { name: 'Another date' }).check()
    await page.locator('#startDateDay').fill('01')
    await page.locator('#startDateMonth').fill('09')
    await page.locator('#startDateYear').fill(`${startYear - 1}`)
    await page.locator('form > .govuk-button').click()

    // confirm we are on the reason page
    await expect(page.locator('h1')).toContainText('Select the reason for the requirements for returns')

    // choose reason (minor change) and click continue
    await page.locator('#minorChange').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the set up page
    await expect(page.locator('h1')).toContainText('How do you want to set up the requirements for returns?')

    // choose to copy the existing requirements and continue
    await page.locator('#useExistingRequirements').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the existing requirements page
    await expect(page.locator('h1')).toContainText('Use previous requirements for returns')

    // choose the existing requirement to copy and continue
    await page.locator('#existing').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // choose the approve return requirement button
    await page.getByText('Approve returns requirement').click()

    // confirm we are on the approved page
    await expect(page.locator('.govuk-panel__title')).toContainText('Requirements for returns approved')

    // click link to return to licence set up and the returns tabs
    await page.getByText('Return to licence set up').click()
    await page.getByRole('link', { name: 'Returns' }).click()

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Returns')

    // Confirm the return logs have been updated and created as expected. The old (now voided) and new return logs
    // for the current cycle cover the exact same period, so we identify which row is which by return reference
    // rather than by table position or date alone
    const currentCycleRows = tableRow(page, currentCyclePeriod.dateString)

    await expect(currentCycleRows.filter({ hasText: oldReference }).locator('.govuk-tag')).toContainText('void')
    await expect(currentCycleRows.filter({ hasNotText: oldReference }).locator('.govuk-tag')).toContainText(
      'not due yet'
    )

    await expect(tableRow(page, newFromSplitPeriod.dateString).locator('[data-test^="return-due-date-"]')).toBeEmpty()
    await expect(tableRow(page, newFromSplitPeriod.dateString).locator('.govuk-tag')).toContainText('open')

    await expect(tableRow(page, previousCyclePeriod.dateString).locator('[data-test^="return-due-date-"]')).toBeEmpty()
    await expect(tableRow(page, previousCyclePeriod.dateString).locator('.govuk-tag')).toContainText('void')

    await expect(tableRow(page, truncatedOldPeriod.dateString).locator('[data-test^="return-due-date-"]')).toBeEmpty()
    await expect(tableRow(page, truncatedOldPeriod.dateString).locator('.govuk-tag')).toContainText('open')
  })
})
