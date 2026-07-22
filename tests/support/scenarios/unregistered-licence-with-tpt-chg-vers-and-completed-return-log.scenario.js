import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnSubmissionData from '../data/return-submission.data.js'
import returnVersionData from '../data/return-version.data.js'
import unregisteredLicenceWithChargeVersionScenario from './unregistered-licence-with-charge-version.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Unregistered licence with tpt charge version and completed return log'
export const description =
  'Unregistered licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle'

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

  const licence = unregisteredLicenceWithChargeVersionScenario()

  const returnVersion = returnVersionData(licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersion.returnVersions[0].startDate = previousPeriodDetails.startDate

  const returnRequirement = returnRequirementData(returnVersion, licence)

  returnRequirement.returnRequirements[0].twoPartTariff = true

  const previousReturnLog = returnLogData(licence, returnRequirement, previousPeriodDetails)
  const currentReturnLog = returnLogData(licence, returnRequirement, currentPeriodDetails)

  previousReturnLog.returnLogs[0].status = 'completed'

  const totalVolume = licence.licenceVersionPurposes[0].annualQuantity

  const returnSubmission = returnSubmissionData(previousPeriodDetails, previousReturnLog, totalVolume)

  return mergeByKey(licence, returnVersion, returnRequirement, previousReturnLog, currentReturnLog, returnSubmission)
}
