import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { regions } from '../default-values.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'

export const title = 'Licence with a two-part tariff charge version and a due return log'
export const description =
  'Licence with a return version and TPT charge version based on the licence data, plus a due return log for the previous winter cycle'

export default function (region = null) {
  if (!region) {
    region = regions.MIDLANDS
  }

  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licenceEntity = buildLicenceEntity(region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, region)

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

  return {
    ...licenceEntity,
    ...chargeVersionEntity,
    ...returnVersionEntity,
    returnLogs
  }
}
