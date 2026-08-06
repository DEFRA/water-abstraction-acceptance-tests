import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import buildReturnRequirementEntity from '../entities/return-requirement.entity.js'
import buildReturnSubmissionEntity from '../entities/return-submission.entity.js'
import { buildReturnLogs } from '../helpers/return-log.helpers.js'
import licenceWithChargeVersionAndTwoPurposesScenario from './licence-with-charge-version-and-two-purposes.scenario.js'

export const title = 'Licence with tpt charge version and two completed return logs'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus two completed return logs for the previous winter cycle, one TPT and one not'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const licence = licenceWithChargeVersionAndTwoPurposesScenario()

  const [firstLicenceVersionPurpose, secondLicenceVersionPurpose] = licence.licenceVersionPurposes
  const [firstPoint, secondPoint] = licence.points

  const { returnVersion, ...firstReturnRequirement } = buildReturnRequirementEntity(
    licence.licence,
    firstLicenceVersionPurpose,
    firstPoint
  )

  const [previousFirstReturnLog, currentFirstReturnLog] = buildReturnLogs(
    licence.licence,
    firstReturnRequirement.returnRequirement,
    firstReturnRequirement.returnRequirementPurpose,
    firstPoint,
    currentWinterReturnCycle
  )

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersion.startDate = previousFirstReturnLog.startDate

  previousFirstReturnLog.status = 'completed'

  const secondReturnRequirement = _returnRequirement(returnVersion, secondLicenceVersionPurpose, secondPoint)

  const [previousSecondReturnLog, currentSecondReturnLog] = buildReturnLogs(
    licence.licence,
    secondReturnRequirement.returnRequirement,
    secondReturnRequirement.returnRequirementPurpose,
    secondPoint,
    currentWinterReturnCycle
  )

  previousSecondReturnLog.status = 'completed'

  const firstReturnSubmissionEntity = buildReturnSubmissionEntity(
    previousFirstReturnLog,
    firstLicenceVersionPurpose.annualQuantity
  )
  const secondReturnSubmissionEntity = buildReturnSubmissionEntity(
    previousSecondReturnLog,
    secondLicenceVersionPurpose.annualQuantity
  )

  return {
    ...licence,
    returnVersion,
    returnRequirements: [firstReturnRequirement.returnRequirement, secondReturnRequirement.returnRequirement],
    returnRequirementPoints: [
      firstReturnRequirement.returnRequirementPoint,
      secondReturnRequirement.returnRequirementPoint
    ],
    returnRequirementPurposes: [
      firstReturnRequirement.returnRequirementPurpose,
      secondReturnRequirement.returnRequirementPurpose
    ],
    returnLogs: [previousFirstReturnLog, currentFirstReturnLog, previousSecondReturnLog, currentSecondReturnLog],
    returnSubmissions: [firstReturnSubmissionEntity.returnSubmission, secondReturnSubmissionEntity.returnSubmission],
    returnSubmissionLines: [
      ...firstReturnSubmissionEntity.returnSubmissionLines,
      ...secondReturnSubmissionEntity.returnSubmissionLines
    ]
  }
}

/**
 * Builds a return requirement, point, and purpose against a shared return version
 *
 * @private
 */
function _returnRequirement(returnVersion, licenceVersionPurpose, point) {
  const returnRequirement = returnRequirementData(returnVersion, licenceVersionPurpose)
  const returnRequirementPoint = returnRequirementPointData(returnRequirement, point)
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licenceVersionPurpose)

  return { returnRequirement, returnRequirementPoint, returnRequirementPurpose }
}
