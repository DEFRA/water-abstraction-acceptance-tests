import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import licenceScenario from './licence.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with an open return log (winter cycle)'
export const description =
  'Licence with one return requirement and an open winter return log for the previous winter cycle'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const previousPeriodDetails = previousPeriod({
    startDate: currentWinterReturnCycle.startDate,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: null,
    quarterly: false
  })

  const currentPeriodDetails = {
    startDate: new Date(currentWinterReturnCycle.startDate),
    endDate: new Date(currentWinterReturnCycle.endDate),
    dueDate: null,
    quarterly: false
  }

  const licence = licenceScenario()

  const returnVersion = returnVersionData(licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersion.returnVersions[0].startDate = previousPeriodDetails.startDate

  const returnRequirement = returnRequirementData(returnVersion, licence)

  const previousReturnLog = returnLogData(licence, returnRequirement, previousPeriodDetails)
  const currentReturnLog = returnLogData(licence, returnRequirement, currentPeriodDetails)

  return mergeByKey(licence, returnVersion, returnRequirement, previousReturnLog, currentReturnLog)
}
