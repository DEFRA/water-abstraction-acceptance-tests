import buildLicenceEntity from '../entities/licence.entity.js'
import buildReturnRequirementEntity from '../entities/return-requirement.entity.js'
import { buildReturnLogs } from '../helpers/return-log.helpers.js'

export const title = 'Licence with a due return log (winter cycle)'
export const description =
  'Licence with one return requirement and a due winter return log for the previous winter cycle'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const licenceEntity = buildLicenceEntity()

  const returnRequirementEntity = buildReturnRequirementEntity(
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose,
    licenceEntity.point
  )

  const [previousReturnLog, currentReturnLog] = buildReturnLogs(
    licenceEntity.licence,
    returnRequirementEntity.returnRequirement,
    returnRequirementEntity.returnRequirementPurpose,
    licenceEntity.point,
    currentWinterReturnCycle,
    currentWinterReturnCycle.dueDate
  )

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnRequirementEntity.returnVersion.startDate = previousReturnLog.startDate

  return {
    ...licenceEntity,
    ...returnRequirementEntity,
    returnLogs: [previousReturnLog, currentReturnLog]
  }
}
