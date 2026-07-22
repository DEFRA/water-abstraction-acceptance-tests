import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import licenceScenario from './licence.scenario.js'
import { compareDates } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with open return log (first period)'
export const description = 'Licence with an open return log for the first return period with no due date set'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  const firstPeriod = {
    startDate: new Date(firstReturnPeriod.startDate),
    endDate: new Date(firstReturnPeriod.endDate),
    dueDate: null,
    quarterly: firstReturnPeriod.quarterly
  }

  const licence = licenceScenario()

  // We want the return logs for the licence to match with the first quarter shown in the journey. This is dynamically
  // calculated based on the current date, so could be a quarterly period, or the winter or summer cycle.
  // Only licences flagged as water undertakers are eligible for quarterly returns, so we ensure the licence aligns.
  licence.licences[0].waterUndertaker = firstPeriod.quarterly

  const returnVersion = returnVersionData(licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersion.returnVersions[0].startDate = firstPeriod.startDate

  const returnRequirement = returnRequirementData(returnVersion, licence)

  const periods = _periods(firstPeriod, calculatedDates)
  const returnLogs = _returnLogs(licence, returnRequirement, periods)

  const result = mergeByKey(licence, returnVersion, returnRequirement, returnLogs)

  return result
}

/**
 * Determines which quarterly periods (if any) need covering with return logs
 *
 * If the first period is not a quarterly period, then we will be generating an annual (winter or summer) return log
 * that covers the entire cycle.
 *
 * If it's quarterly though, it will only cover a 3 month period of the cycle. That's fine if its the last one (Jan to
 * Mar), but if its an earlier one, we need to generate return logs for the remaining quarterly periods in the cycle.
 *
 * This function determines which periods we need to generate return logs for, and returns them in an array.
 *
 * @private
 */
function _periods(firstPeriod, calculatedDates) {
  const periods = [firstPeriod]

  if (!firstPeriod.quarterly) {
    return periods
  }

  for (const quarterlyPeriod of calculatedDates.quarterlyPeriods) {
    if (compareDates(new Date(quarterlyPeriod.startDate), firstPeriod.startDate) === 1) {
      periods.push({
        startDate: new Date(quarterlyPeriod.startDate),
        endDate: new Date(quarterlyPeriod.endDate),
        dueDate: null,
        quarterly: true
      })
    }
  }

  return periods
}

/**
 * Generate the return logs for the determined periods
 *
 * The complexity is we need an object with a property `returnLogs:` for `mergeKeys()` to work. But that's how
 * `returnLogData()` returns its data!
 *
 * So we need to pluck each new return log out of it, and add it to our own array of return logs, before returning it
 * in a new object!
 *
 * @private
 */
function _returnLogs(unregisteredLicence, returnRequirement, periods) {
  const returnLogs = []

  for (const period of periods) {
    returnLogs.push(returnLogData(unregisteredLicence, returnRequirement, period).returnLogs[0])
  }

  return { returnLogs }
}
