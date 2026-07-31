import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnSubmissionData from '../data/return-submission.data.js'
import returnVersionData from '../data/return-version.data.js'
import licenceWithChargeVersionAndTwoPurposesScenario from './licence-with-charge-version-and-two-purposes.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'

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

  const returnVersion = returnVersionData(licence.licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersion.startDate = previousPeriodDetails.startDate

  const [firstLicenceVersionPurpose, secondLicenceVersionPurpose] = licence.licenceVersionPurposes
  const [firstPoint, secondPoint] = licence.points

  const firstReturnRequirement = returnRequirementData(returnVersion, firstLicenceVersionPurpose)
  const firstReturnRequirementPoint = returnRequirementPointData(firstReturnRequirement, firstPoint)
  const firstReturnRequirementPurpose = returnRequirementPurposeData(firstReturnRequirement, firstLicenceVersionPurpose)

  const previousFirstReturnLog = returnLogData(
    licence.licence,
    firstReturnRequirement,
    [firstReturnRequirementPurpose],
    [firstPoint],
    previousPeriodDetails
  )
  const currentFirstReturnLog = returnLogData(
    licence.licence,
    firstReturnRequirement,
    [firstReturnRequirementPurpose],
    [firstPoint],
    currentPeriodDetails
  )

  previousFirstReturnLog.status = 'completed'

  const secondReturnRequirement = returnRequirementData(returnVersion, secondLicenceVersionPurpose)
  const secondReturnRequirementPoint = returnRequirementPointData(secondReturnRequirement, secondPoint)
  const secondReturnRequirementPurpose = returnRequirementPurposeData(
    secondReturnRequirement,
    secondLicenceVersionPurpose
  )

  const previousSecondReturnLog = returnLogData(
    licence.licence,
    secondReturnRequirement,
    [secondReturnRequirementPurpose],
    [secondPoint],
    previousPeriodDetails
  )
  const currentSecondReturnLog = returnLogData(
    licence.licence,
    secondReturnRequirement,
    [secondReturnRequirementPurpose],
    [secondPoint],
    currentPeriodDetails
  )

  previousSecondReturnLog.status = 'completed'

  const firstSubmission = returnSubmissionData(
    previousPeriodDetails,
    previousFirstReturnLog,
    firstLicenceVersionPurpose.annualQuantity
  )
  const secondSubmission = returnSubmissionData(
    previousPeriodDetails,
    previousSecondReturnLog,
    secondLicenceVersionPurpose.annualQuantity
  )

  return {
    ...licence,
    returnVersion,
    returnRequirements: [firstReturnRequirement, secondReturnRequirement],
    returnRequirementPoints: [firstReturnRequirementPoint, secondReturnRequirementPoint],
    returnRequirementPurposes: [firstReturnRequirementPurpose, secondReturnRequirementPurpose],
    returnLogs: [previousFirstReturnLog, currentFirstReturnLog, previousSecondReturnLog, currentSecondReturnLog],
    returnSubmissions: [firstSubmission.returnSubmission, secondSubmission.returnSubmission],
    returnSubmissionLines: [...firstSubmission.returnSubmissionLines, ...secondSubmission.returnSubmissionLines]
  }
}
