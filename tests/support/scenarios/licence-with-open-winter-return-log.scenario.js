import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildLicenceEntity from 'water-abstraction-engine/cli/world/entities/licence.entity.js'
import buildReturnVersionEntity from 'water-abstraction-engine/cli/world/entities/return-version.entity.js'
import { calculatedDates } from 'water-abstraction-engine/cli/world/helpers/calculated-dates.helpers.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'
import { buildReturnLogs, returnLogPeriods } from 'water-abstraction-engine/cli/world/helpers/return-log.helpers.js'

export const title = 'Licence with an open return log (winter cycle)'
export const description =
  'Licence with one return requirement and an open winter return log for the previous winter cycle'

export default function (region = null) {
  if (!region) {
    region = regions.THAMES
  }

  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licenceEntity = buildLicenceEntity(region)

  const returnVersionEntity = buildReturnVersionEntity(licenceEntity)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const returnLogs = buildReturnLogs(
    licenceEntity.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    licenceEntity.point,
    periods,
    region
  )

  const internalUserEntity = buildInternalUserEntity()

  return {
    ...licenceEntity,
    ...returnVersionEntity,
    returnLogs,
    ...internalUserEntity
  }
}
