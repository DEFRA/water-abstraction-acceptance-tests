import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnSubmissionData from '../data/return-submission.data.js'
import returnVersionData from '../data/return-version.data.js'
import licenceWithChargeVersionAndTwoPurposesScenario from './licence-with-charge-version-and-two-purposes.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with tpt charge version and two completed return logs'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus two completed return logs for the previous winter cycle, one TPT and one not'

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

  const licence = licenceWithChargeVersionAndTwoPurposesScenario()

  const returnVersion = returnVersionData(licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersion.returnVersions[0].startDate = previousPeriodDetails.startDate

  const {
    licenceVersionPurposes: [firstLicenceVersionPurpose, secondLicenceVersionPurpose],
    points: [firstPoint, secondPoint]
  } = licence

  const firstReturnRequirement = returnRequirementData(returnVersion, firstLicenceVersionPurpose, [firstPoint])

  const previousFirstReturnLog = returnLogData(licence, firstReturnRequirement, previousPeriodDetails)
  const currentFirstReturnLog = returnLogData(licence, firstReturnRequirement, currentPeriodDetails)

  previousFirstReturnLog.returnLogs[0].status = 'completed'

  const secondReturnRequirement = returnRequirementData(returnVersion, secondLicenceVersionPurpose, [secondPoint])

  const previousSecondReturnLog = returnLogData(licence, secondReturnRequirement, previousPeriodDetails)
  const currentSecondReturnLog = returnLogData(licence, secondReturnRequirement, currentPeriodDetails)

  previousSecondReturnLog.returnLogs[0].status = 'completed'

  const firstReturnSubmission = returnSubmissionData(
    previousPeriodDetails,
    previousFirstReturnLog,
    firstLicenceVersionPurpose.annualQuantity
  )
  const secondReturnSubmission = returnSubmissionData(
    previousPeriodDetails,
    previousSecondReturnLog,
    secondLicenceVersionPurpose.annualQuantity
  )

  return mergeByKey(
    licence,
    returnVersion,
    firstReturnRequirement,
    secondReturnRequirement,
    previousFirstReturnLog,
    previousSecondReturnLog,
    currentFirstReturnLog,
    currentSecondReturnLog,
    firstReturnSubmission,
    secondReturnSubmission
  )
}
