import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import buildReturnRequirementEntity from '../entities/return-requirement.entity.js'
import { buildReturnLogs } from '../helpers/return-log.helpers.js'

export const title = 'Licence with tpt charge version and due return log'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a due return log for the previous winter cycle'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const licenceEntity = buildLicenceEntity()
  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity.company,
    licenceEntity.address,
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose
  )

  const returnRequirementEntity = buildReturnRequirementEntity(
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose,
    licenceEntity.point
  )

  const returnLogs = buildReturnLogs(
    licenceEntity.licence,
    returnRequirementEntity.returnRequirement,
    returnRequirementEntity.returnRequirementPurpose,
    licenceEntity.point,
    currentWinterReturnCycle
  )

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnRequirementEntity.returnVersion.startDate = returnLogs[0].startDate

  return {
    ...licenceEntity,
    ...chargeVersionEntity,
    ...returnRequirementEntity,
    returnLogs
  }
}
