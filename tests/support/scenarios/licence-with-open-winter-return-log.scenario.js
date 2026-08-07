import buildLicenceEntity from '../entities/licence.entity.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'

export const title = 'Licence with an open return log (winter cycle)'
export const description =
  'Licence with one return requirement and an open winter return log for the previous winter cycle'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licenceEntity = buildLicenceEntity()

  const returnVersionEntity = buildReturnVersionEntity(
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose,
    licenceEntity.point
  )

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const returnLogs = buildReturnLogs(
    licenceEntity.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    licenceEntity.point,
    periods
  )

  return {
    ...licenceEntity,
    ...returnVersionEntity,
    returnLogs
  }
}
