import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnSubmissionData from '../data/return-submission.data.js'
import returnVersionData from '../data/return-version.data.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'

export const title = 'Licence with tpt charge version and completed return log'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the previous winter cycle'

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

  const licence = licenceWithChargeVersionScenario()

  const returnVersion = returnVersionData(licence.licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersion.startDate = previousPeriodDetails.startDate

  const returnRequirement = returnRequirementData(returnVersion, licence.licenceVersionPurpose)

  returnRequirement.twoPartTariff = true

  const returnRequirementPoint = returnRequirementPointData(returnRequirement, licence.point)
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licence.licenceVersionPurpose)

  const previousReturnLog = returnLogData(
    licence.licence,
    returnRequirement,
    [returnRequirementPurpose],
    [licence.point],
    previousPeriodDetails
  )
  const currentReturnLog = returnLogData(
    licence.licence,
    returnRequirement,
    [returnRequirementPurpose],
    [licence.point],
    currentPeriodDetails
  )

  previousReturnLog.status = 'completed'

  const totalVolume = licence.licenceVersionPurpose.annualQuantity

  const { returnSubmission, returnSubmissionLines } = returnSubmissionData(
    previousPeriodDetails,
    previousReturnLog,
    totalVolume
  )

  return {
    ...licence,
    returnVersion,
    returnRequirement,
    returnRequirementPoint,
    returnRequirementPurpose,
    returnLogs: [previousReturnLog, currentReturnLog],
    returnSubmission,
    returnSubmissionLines
  }
}
