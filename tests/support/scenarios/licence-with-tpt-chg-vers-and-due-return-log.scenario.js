import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnVersionData from '../data/return-version.data.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { previousPeriod } from '../helpers/date.helpers.js'

export const title = 'Licence with tpt charge version and due return log'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a due return log for the previous winter cycle'

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

  const licenceEntity = buildLicenceEntity()
  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity.company,
    licenceEntity.address,
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose
  )

  const returnVersion = returnVersionData(licenceEntity.licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersion.startDate = previousPeriodDetails.startDate

  const returnRequirement = returnRequirementData(returnVersion, licenceEntity.licenceVersionPurpose)

  const returnRequirementPoint = returnRequirementPointData(returnRequirement, licenceEntity.point)
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licenceEntity.licenceVersionPurpose)

  const previousReturnLog = returnLogData(
    licenceEntity.licence,
    returnRequirement,
    [returnRequirementPurpose],
    [licenceEntity.point],
    previousPeriodDetails
  )
  const currentReturnLog = returnLogData(
    licenceEntity.licence,
    returnRequirement,
    [returnRequirementPurpose],
    [licenceEntity.point],
    currentPeriodDetails
  )

  return {
    ...licenceEntity,
    ...chargeVersionEntity,
    returnVersion,
    returnRequirement,
    returnRequirementPoint,
    returnRequirementPurpose,
    returnLogs: [previousReturnLog, currentReturnLog]
  }
}
