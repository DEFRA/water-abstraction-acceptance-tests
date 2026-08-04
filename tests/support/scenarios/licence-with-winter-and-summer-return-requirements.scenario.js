import returnLogData from '../data/return-log.data.js'
import licenceWithTwoReturnRequirementsScenario from './licence-with-two-return-requirements.scenario.js'
import { formatDateToIso, previousPeriod } from '../helpers/date.helpers.js'

export const title = 'Licence with winter and summer return requirements'
export const description =
  'A licence with a winter-cycle return requirement and a summer-cycle return requirement, each with a current return log and a previous completed return log'

export default function (calculatedDates) {
  const { currentSummerReturnCycle, currentWinterReturnCycle } = calculatedDates

  const licence = licenceWithTwoReturnRequirementsScenario()

  const [winterRequirement, summerRequirement] = licence.returnRequirements
  const [winterPurpose, summerPurpose] = licence.returnRequirementPurposes
  const [winterPoint, summerPoint] = licence.points

  summerRequirement.summer = true

  const currentWinterPeriod = {
    startDate: new Date(currentWinterReturnCycle.startDate),
    endDate: new Date(currentWinterReturnCycle.endDate),
    dueDate: null,
    quarterly: false
  }
  const currentSummerPeriod = {
    startDate: new Date(currentSummerReturnCycle.startDate),
    endDate: new Date(currentSummerReturnCycle.endDate),
    dueDate: null,
    quarterly: false
  }

  const previousWinterPeriod = previousPeriod({
    startDate: currentWinterReturnCycle.startDate,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: currentWinterReturnCycle.dueDate,
    quarterly: false
  })
  const previousSummerPeriod = previousPeriod({
    startDate: currentSummerReturnCycle.startDate,
    endDate: currentSummerReturnCycle.endDate,
    dueDate: currentSummerReturnCycle.dueDate,
    quarterly: false
  })

  // In the service return logs will cover the whole period of their matching return version, and a return version
  // can't start before the licence itself. To ensure our test data is realistic, we push the licence's, licence
  // version's, and return version's start dates back to match the earliest return log we're seeding, which is the
  // previous summer cycle's, as summer cycles start in November, ahead of the winter cycle's April start.
  const earliestStartDate = formatDateToIso(previousSummerPeriod.startDate)

  licence.licence.startDate = earliestStartDate
  licence.licenceVersion.startDate = earliestStartDate
  licence.returnVersion.startDate = earliestStartDate

  const currentWinterReturnLog = returnLogData(
    licence.licence,
    winterRequirement,
    [winterPurpose],
    [winterPoint],
    currentWinterPeriod
  )
  const currentSummerReturnLog = returnLogData(
    licence.licence,
    summerRequirement,
    [summerPurpose],
    [summerPoint],
    currentSummerPeriod
  )

  const previousWinterReturnLog = returnLogData(
    licence.licence,
    winterRequirement,
    [winterPurpose],
    [winterPoint],
    previousWinterPeriod
  )

  previousWinterReturnLog.status = 'completed'

  const previousSummerReturnLog = returnLogData(
    licence.licence,
    summerRequirement,
    [summerPurpose],
    [summerPoint],
    previousSummerPeriod
  )

  previousSummerReturnLog.status = 'completed'

  return {
    ...licence,
    returnLogs: [currentWinterReturnLog, currentSummerReturnLog, previousWinterReturnLog, previousSummerReturnLog]
  }
}
