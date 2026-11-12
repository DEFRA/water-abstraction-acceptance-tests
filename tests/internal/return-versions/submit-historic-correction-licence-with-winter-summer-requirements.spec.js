import scenarioData from '../../support/scenarios/licence-with-winter-and-summer-return-requirements.scenario.js'
import { calculatedDates } from '../../support/helpers/calculated-dates.helpers.js'
import { returnLogDateDetails } from '../../support/helpers/date.helpers.js'
import { expect, test } from '../../support/fixtures.js'

test.describe('Submit historic correction for licence with both a winter and summer return requirement (internal)', () => {
  let licence
  let startYear
  let winterCurrent
  let summerCurrent
  let winterPrevious
  let summerPrevious
  let summerCycleStartedAfterWinter

  test.beforeAll(async ({ setup }) => {
    const { currentWinterReturnCycle } = calculatedDates()

    startYear = new Date(currentWinterReturnCycle.startDate).getFullYear()

    const scenario = scenarioData()

    licence = scenario.licence

    const [winterCurrentLog, winterPreviousLog, summerCurrentLog, summerPreviousLog] = scenario.returnLogs

    winterCurrent = { ...returnLogDateDetails(winterCurrentLog), returnReference: winterCurrentLog.returnReference }
    summerCurrent = { ...returnLogDateDetails(summerCurrentLog), returnReference: summerCurrentLog.returnReference }
    winterPrevious = { ...returnLogDateDetails(winterPreviousLog), returnReference: winterPreviousLog.returnReference }
    summerPrevious = { ...returnLogDateDetails(summerPreviousLog), returnReference: summerPreviousLog.returnReference }

    // The summer cycle runs 1 Nov to 31 Oct, whereas the winter cycle runs 1 Apr to 31 Mar. From 1 Nov until 31 Mar the
    // current summer cycle starts in the same year as the current winter cycle (and the new return version's 1 April
    // start date). That changes the outcome: the seeded 'previous' summer log now straddles the new start date so it is
    // voided and reissued, and an extra return log is created for the part of that cycle after the start date.
    summerCycleStartedAfterWinter = new Date(summerCurrent.startDate).getFullYear() === startYear

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('adds a new return version using copy existing for a licence with existing winter and summer return requirement', async ({
    page
  }) => {
    // The winter and summer return requirements are seeded with independent random references, so we can't assume
    // which sorts first on the page - look each row up by its known reference instead. A reference alone isn't
    // enough though: the same requirement's current and previous period logs share it, so filter on the date range
    // too
    const returnRow = (reference, dateString) => {
      return page
        .locator('tr')
        .filter({ hasText: `${reference}` })
        .filter({ hasText: dateString })
    }

    await page.goto(`/system/licences/${licence.id}/returns`)

    await expect(page.locator('h1')).toContainText('Returns')

    await expect(
      returnRow(winterCurrent.returnReference, winterCurrent.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText(winterCurrent.status)
    await expect(
      returnRow(summerCurrent.returnReference, summerCurrent.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText(summerCurrent.status)
    await expect(
      returnRow(winterPrevious.returnReference, winterPrevious.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText(winterPrevious.status)
    await expect(
      returnRow(summerPrevious.returnReference, summerPrevious.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText(summerPrevious.status)

    await page.getByText('Licence set up').click()

    await expect(page.locator('h1')).toContainText('Licence set up')
    await page.getByText('Set up new requirements').click()

    await expect(page.locator('h1')).toContainText('Select the start date for the requirements for returns')
    await page.getByRole('radio', { name: 'Another date' }).check()
    await page.locator('#startDateDay').fill('01')
    await page.locator('#startDateMonth').fill('04')
    await page.locator('#startDateYear').fill(`${startYear}`)
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select the reason for the requirements for returns')
    await page.locator('#newLicence').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('How do you want to set up the requirements for returns?')
    await page.locator('#useExistingRequirements').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Use previous requirements for returns')
    await page.locator('#existing').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await page.getByText('Approve returns requirement').click()

    await expect(page.locator('.govuk-panel__title')).toContainText('Requirements for returns approved')
    await page.getByText('Return to licence set up').click()
    await page.getByRole('link', { name: 'Returns' }).click()

    await expect(page.locator('h1')).toContainText('Returns')

    // The two current-period return logs are now superseded by the new return version, so both are void; the two
    // previous-period logs are untouched and keep their original status. Look each up by its known reference rather
    // than assuming page position
    await expect(
      returnRow(summerCurrent.returnReference, summerCurrent.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText('void')
    await expect(
      returnRow(winterCurrent.returnReference, winterCurrent.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText('void')
    await expect(
      returnRow(summerPrevious.returnReference, summerPrevious.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText(summerCycleStartedAfterWinter ? 'void' : summerPrevious.status)
    await expect(
      returnRow(winterPrevious.returnReference, winterPrevious.dateString).locator(
        '[data-test^="return-status-"] > .govuk-tag'
      )
    ).toContainText(winterPrevious.status)

    // The new return version creates return logs whose references aren't known ahead of the journey creating them, so
    // we confirm them by status count instead of position. Before the summer cycle rolls over that is 3: 2 new current
    // periods (not due yet) plus 1 new split log for the previous period (open). After it rolls over there is a 4th,
    // the summer split log for the period from the start date to the end of the previous summer cycle (open)
    const statuses = (await page.locator('[data-test^="return-status-"] > .govuk-tag').allTextContents()).map(
      (status) => {
        return status.trim()
      }
    )
    const newLogCount = summerCycleStartedAfterWinter ? 4 : 3
    const expectedVoidCount = summerCycleStartedAfterWinter ? 3 : 2
    const previousLogs = summerCycleStartedAfterWinter ? [winterPrevious] : [summerPrevious, winterPrevious]
    const expectedOpenCount =
      previousLogs.filter((log) => {
        return log.status === 'open'
      }).length + (summerCycleStartedAfterWinter ? 2 : 1)

    expect(statuses).toHaveLength(4 + newLogCount)
    expect(
      statuses.filter((status) => {
        return status === 'void'
      })
    ).toHaveLength(expectedVoidCount)
    expect(
      statuses.filter((status) => {
        return status === 'not due yet'
      })
    ).toHaveLength(2)
    expect(
      statuses.filter((status) => {
        return status === 'open'
      })
    ).toHaveLength(expectedOpenCount)
  })
})
