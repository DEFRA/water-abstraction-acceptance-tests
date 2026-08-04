import returnLogData from '../data/return-log.data.js'
import licenceWithTwoReturnRequirementsScenario from './licence-with-two-return-requirements.scenario.js'
import { formatDateToIso, previousPeriod } from '../helpers/date.helpers.js'

export const title = 'Licence with two return requirements and historic return logs'
export const description =
  'A licence with two winter-cycle return requirements at two abstraction points, each with a current due return log and two previous completed return logs'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const licence = licenceWithTwoReturnRequirementsScenario()

  const currentPeriod = {
    startDate: new Date(currentWinterReturnCycle.startDate),
    endDate: new Date(currentWinterReturnCycle.endDate),
    dueDate: null,
    quarterly: false
  }

  const previousPeriodOneYearAgo = previousPeriod({
    startDate: currentWinterReturnCycle.startDate,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: currentWinterReturnCycle.dueDate,
    quarterly: false
  })

  const previousPeriodTwoYearsAgo = previousPeriod(previousPeriodOneYearAgo)

  // In the service return logs will cover the whole period of their matching return version, and a return version
  // can't start before the licence itself. To ensure our test data is realistic, we push the licence's, licence
  // version's, and return version's start dates back to match the earliest return log we're seeding.
  const earliestStartDate = formatDateToIso(previousPeriodTwoYearsAgo.startDate)

  licence.licence.startDate = earliestStartDate
  licence.licenceVersion.startDate = earliestStartDate
  licence.returnVersion.startDate = earliestStartDate

  return {
    ...licence,
    returnLogs: [
      ..._returnLogsForPeriod(licence, currentPeriod),
      ..._returnLogsForPeriod(licence, previousPeriodOneYearAgo, 'completed'),
      ..._returnLogsForPeriod(licence, previousPeriodTwoYearsAgo, 'completed')
    ]
  }
}

/**
 * Builds a return log for each of the licence's two return requirements covering the given period
 *
 * @private
 */
function _returnLogsForPeriod(licence, period, statusOverride = null) {
  return licence.returnRequirements.map((requirement, index) => {
    const purpose = licence.returnRequirementPurposes[index]
    const point = licence.points[index]

    const returnLog = returnLogData(licence.licence, requirement, [purpose], [point], period)

    if (statusOverride) {
      returnLog.status = statusOverride
    }

    return returnLog
  })
}
