import buildLicenceEntity from '../entities/licence.entity.js'
import buildReturnRequirementEntity from '../entities/return-requirement.entity.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'

export const title = 'Licence with a due return log (winter cycle)'
export const description =
  'Licence with one return requirement and a due winter return log for the previous winter cycle'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates
  const periods = returnLogPeriods(currentWinterReturnCycle, currentWinterReturnCycle.dueDate)

  const licenceEntity = buildLicenceEntity()

  const returnRequirementEntity = buildReturnRequirementEntity(
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose,
    licenceEntity.point
  )

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnRequirementEntity.returnVersion.startDate = periods[0].startDate

  const returnLogs = buildReturnLogs(
    licenceEntity.licence,
    returnRequirementEntity.returnRequirement,
    returnRequirementEntity.returnRequirementPurpose,
    licenceEntity.point,
    periods
  )

  return {
    ...licenceEntity,
    ...returnRequirementEntity,
    returnLogs
  }
}
